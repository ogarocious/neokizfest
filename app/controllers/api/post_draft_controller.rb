# frozen_string_literal: true

module Api
  # POST /api/post-draft/generate
  # Triggered by n8n on a schedule (e.g. daily at 6 or 8am).
  # Drafts a Facebook post using live Notion stats + post history,
  # then emails the result to charles@neokizomba.com.
  # Protected by a bearer token (post_draft_secret in Rails credentials).
  class PostDraftController < ApplicationController
    skip_before_action :verify_authenticity_token

    def generate
      unless valid_token?
        return render json: { error: "Unauthorized" }, status: :unauthorized
      end

      force_type = params[:type]&.strip&.downcase&.to_sym
      if force_type && !%i[daily weekly].include?(force_type)
        return render json: { error: "Invalid type. Use 'daily' or 'weekly'." }, status: :unprocessable_entity
      end

      result = PostDraftingService.new(force_type: force_type).draft!

      AdminMailer.post_draft(
        draft:          result[:draft],
        type:           result[:type],
        day:            result[:day],
        week:           result[:week],
        stats:          result[:stats],
        donation_stats: result[:donation_stats]
      ).deliver_now

      render json: {
        success:    true,
        type:       result[:type],
        day:        result[:day],
        week:       result[:week],
        email_sent: true
      }
    rescue => e
      Rails.logger.error("[PostDraftController] Failed to generate draft: #{e.message}")
      render json: { error: e.message }, status: :internal_server_error
    end

    private

    def valid_token?
      expected = Rails.application.credentials.post_draft_secret
      return false if expected.blank?

      auth_header = request.headers["Authorization"]
      return false if auth_header.blank?

      provided = auth_header.gsub(/^Bearer\s+/i, "")
      ActiveSupport::SecurityUtils.secure_compare(provided, expected)
    end
  end
end
