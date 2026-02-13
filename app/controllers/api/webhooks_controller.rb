# frozen_string_literal: true

module Api
  class WebhooksController < ApplicationController
    skip_before_action :verify_authenticity_token

    # POST /api/webhooks/square
    # Receives Square payment webhooks and logs completed payments to Notion
    def square
      raw_body = request.body.read

      unless verify_square_signature!(raw_body)
        return render json: { error: "Invalid signature" }, status: :unauthorized
      end

      payload = JSON.parse(raw_body)
      event_type = payload["type"]

      # Square fires payment.created (status already COMPLETED for card payments)
      # and payment.updated (status changes). Process both, but only if COMPLETED.
      unless %w[payment.created payment.updated].include?(event_type)
        Rails.logger.info("[WebhooksController] Ignoring Square event: #{event_type}")
        return head :ok
      end

      payment = payload.dig("data", "object", "payment") || {}

      unless payment["status"] == "COMPLETED"
        Rails.logger.info("[WebhooksController] Ignoring non-completed payment: #{payment['status']}")
        return head :ok
      end
      order_id = payment["order_id"]

      order_params = {
        name: Rails.cache.read("sq_order:#{order_id}"),
        email: payment["buyer_email_address"],
        amount_paid: (payment.dig("amount_money", "amount").to_i / 100.0).round(2),
        date_received: payment["created_at"],
        identifier: payment["id"],
        status: "Payment Received",
        notes: payment["receipt_url"] ? "Receipt: #{payment['receipt_url']}" : nil
      }

      if supporter_order_service.find_by_identifier(order_params[:identifier])
        Rails.logger.info("[WebhooksController] Duplicate order #{order_params[:identifier]}, skipping")
        return head :ok
      end

      supporter_order_service.create(order_params)
      Rails.logger.info("[WebhooksController] Created supporter order #{order_params[:identifier]}")

      send_donation_confirmation(order_params) if order_params[:email].present?
      send_admin_donation_notification(order_params)

      head :ok
    rescue JSON::ParserError => e
      Rails.logger.error("[WebhooksController] Invalid JSON: #{e.message}")
      head :ok
    rescue StandardError => e
      Rails.logger.error("[WebhooksController] Webhook processing failed: #{e.message}")
      head :ok
    end

    private

    def verify_square_signature!(raw_body)
      signature_key = Rails.application.credentials.dig(:square, :webhook_signature_key)
      return false if signature_key.blank?

      signature = request.headers["x-square-hmacsha256-signature"]
      return false if signature.blank?

      payload = "#{request.original_url}#{raw_body}"
      expected = Base64.strict_encode64(OpenSSL::HMAC.digest("SHA256", signature_key, payload))
      ActiveSupport::SecurityUtils.secure_compare(expected, signature)
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

    def send_admin_donation_notification(params)
      AdminMailer.new_donation(
        name: params[:name],
        email: params[:email],
        amount: params[:amount_paid],
        identifier: params[:identifier]
      ).deliver_later
    rescue StandardError => e
      Rails.logger.error("[WebhooksController] Admin notification failed: #{e.message}")
    end

    def supporter_order_service
      @supporter_order_service ||= Notion::SupporterOrderService.new
    end
  end
end
