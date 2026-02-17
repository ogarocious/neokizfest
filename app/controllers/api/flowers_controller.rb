# frozen_string_literal: true

module Api
  class FlowersController < ApplicationController
    skip_before_action :verify_authenticity_token

    ALLOWED_CONTENT_TYPES = %w[text image audio video].freeze
    MAX_MESSAGE_LENGTH = 2000
    CLOUDINARY_URL_PATTERN = %r{\Ahttps://res\.cloudinary\.com/}

    # POST /api/flowers
    def create
      name = params[:name].to_s.strip
      email = params[:email].to_s.strip.downcase
      content_type = params[:content_type].to_s.strip.downcase
      message = params[:message].to_s.strip.presence
      media_url = params[:media_url].to_s.strip.presence

      # Validations
      if name.blank?
        return render json: { success: false, error: "Name is required" }, status: :unprocessable_entity
      end

      unless email.match?(/\A[^@\s]+@[^@\s]+\z/)
        return render json: { success: false, error: "Valid email is required" }, status: :unprocessable_entity
      end

      unless ALLOWED_CONTENT_TYPES.include?(content_type)
        return render json: { success: false, error: "Invalid content type" }, status: :unprocessable_entity
      end

      if content_type == "text" && message.blank?
        return render json: { success: false, error: "Message is required for text submissions" }, status: :unprocessable_entity
      end

      if %w[image audio video].include?(content_type) && media_url.blank?
        return render json: { success: false, error: "File is required for #{content_type} submissions" }, status: :unprocessable_entity
      end

      # Validate media URL is from Cloudinary
      if media_url.present? && !media_url.match?(CLOUDINARY_URL_PATTERN)
        return render json: { success: false, error: "Invalid media URL" }, status: :unprocessable_entity
      end

      if message.present? && message.length > MAX_MESSAGE_LENGTH
        message = message.truncate(MAX_MESSAGE_LENGTH)
      end

      flowers_service.create_submission(
        name: name,
        email: email,
        content_type: content_type,
        message: message,
        media_url: media_url
      )

      # Send notification emails
      FlowerMailer.admin_notification(
        name: name, email: email, content_type: content_type,
        message: message, media_url: media_url
      ).deliver_later

      FlowerMailer.submitter_confirmation(name: name, email: email).deliver_later

      render json: { success: true }
    rescue StandardError => e
      Rails.logger.error("[Api::FlowersController] Submission failed: #{e.message}")
      render json: { success: false, error: "Failed to save submission. Please try again." }, status: :internal_server_error
    end

    private

    def flowers_service
      @flowers_service ||= Notion::FlowersService.new
    end
  end
end
