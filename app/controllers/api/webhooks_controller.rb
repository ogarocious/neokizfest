# frozen_string_literal: true

module Api
  class WebhooksController < ApplicationController
    skip_before_action :verify_authenticity_token

    # POST /api/webhooks/lemon-squeezy
    # Receives Lemon Squeezy order_created webhooks and logs to Notion
    def lemon_squeezy
      raw_body = request.body.read

      unless verify_lemon_squeezy_signature!(raw_body)
        return render json: { error: "Invalid signature" }, status: :unauthorized
      end

      event_name = request.headers["X-Event-Name"]

      # Only process order_created events; acknowledge everything else
      unless event_name == "order_created"
        Rails.logger.info("[WebhooksController] Ignoring LS event: #{event_name}")
        return head :ok
      end

      payload = JSON.parse(raw_body)
      attrs = payload.dig("data", "attributes") || {}

      order_params = {
        name: attrs["user_name"],
        email: attrs["user_email"],
        amount_paid: (attrs["total"].to_i / 100.0).round(2),
        date_received: attrs["created_at"],
        identifier: attrs["identifier"],
        status: map_ls_status(attrs["status"]),
        notes: build_notes(attrs)
      }

      # Dedup: skip if this order was already recorded
      if supporter_order_service.find_by_identifier(order_params[:identifier])
        Rails.logger.info("[WebhooksController] Duplicate order #{order_params[:identifier]}, skipping")
        return head :ok
      end

      supporter_order_service.create(order_params)
      Rails.logger.info("[WebhooksController] Created supporter order #{order_params[:identifier]}")

      send_donation_confirmation(order_params)

      head :ok
    rescue JSON::ParserError => e
      Rails.logger.error("[WebhooksController] Invalid JSON: #{e.message}")
      head :ok # Return 200 to prevent LS retries on malformed payloads
    rescue StandardError => e
      Rails.logger.error("[WebhooksController] Webhook processing failed: #{e.message}")
      head :ok # Return 200 to prevent LS retries on our bugs
    end

    private

    def verify_lemon_squeezy_signature!(raw_body)
      secret = Rails.application.credentials.dig(:lemon_squeezy, :webhook_secret)
      return false if secret.blank?

      signature = request.headers["X-Signature"]
      return false if signature.blank?

      expected = OpenSSL::HMAC.hexdigest("SHA256", secret, raw_body)
      ActiveSupport::SecurityUtils.secure_compare(expected, signature)
    end

    def map_ls_status(status)
      case status.to_s.downcase
      when "paid" then "Received"
      when "refunded" then "Refunded"
      when "pending" then "Pending"
      else "Received"
      end
    end

    def build_notes(attrs)
      parts = []
      parts << "Product: #{attrs['first_order_item']&.dig('product_name')}" if attrs.dig("first_order_item", "product_name")
      parts << "Order ##{attrs['order_number']}" if attrs["order_number"]
      parts.join(" | ")
    end

    def send_donation_confirmation(params)
      DonationMailer.confirmation_email(
        email: params[:email],
        name: params[:name],
        amount: params[:amount_paid],
        identifier: params[:identifier]
      ).deliver_later
    rescue StandardError => e
      Rails.logger.error("[WebhooksController] Donation email failed: #{e.message}")
    end

    def supporter_order_service
      @supporter_order_service ||= Notion::SupporterOrderService.new
    end
  end
end
