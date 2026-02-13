# frozen_string_literal: true

module Api
  class CommunityMessagesController < ApplicationController
    skip_before_action :verify_authenticity_token

    # POST /api/community-messages
    # Saves a community message on an existing refund request or donation
    def create
      message = params[:message].to_s.strip
      identifier = params[:identifier].to_s.strip
      source_type = params[:type].to_s # "refund" or "donation"

      if message.blank?
        return render json: { success: false, error: "Message is required" }, status: :unprocessable_entity
      end

      if identifier.blank?
        return render json: { success: false, error: "Identifier is required" }, status: :unprocessable_entity
      end

      if message.length > 1000
        message = message.truncate(1000)
      end

      case source_type
      when "donation"
        save_donation_message(identifier, message)
      else
        save_refund_message(identifier, message)
      end
    end

    private

    def save_refund_message(confirmation_number, message)
      result = refund_request_service.find_by_confirmation(confirmation_number)

      unless result[:success]
        return render json: { success: false, error: "Request not found" }, status: :not_found
      end

      refund_request_service.set_community_message(result[:request][:id], message)

      render json: { success: true }
    rescue StandardError => e
      Rails.logger.error("[CommunityMessagesController] Refund message failed: #{e.message}")
      render json: { success: false, error: "Failed to save message" }, status: :internal_server_error
    end

    def save_donation_message(order_id, message)
      page = supporter_order_service.find_by_identifier(order_id)

      unless page
        return render json: { success: false, error: "Donation not found" }, status: :not_found
      end

      supporter_order_service.set_community_message(page.id, message)

      render json: { success: true }
    rescue StandardError => e
      Rails.logger.error("[CommunityMessagesController] Donation message failed: #{e.message}")
      render json: { success: false, error: "Failed to save message" }, status: :internal_server_error
    end

    def refund_request_service
      @refund_request_service ||= Notion::RefundRequestService.new
    end

    def supporter_order_service
      @supporter_order_service ||= Notion::SupporterOrderService.new
    end
  end
end
