# frozen_string_literal: true

module Api
  # POST /api/post-draft/generate
  # Triggered by n8n on a schedule (e.g. daily at 8am).
  # Responds immediately with 202 to avoid gateway timeouts, then drafts
  # and emails the post in a background thread (~15s of Notion + Claude work).
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

      # Respond immediately so the gateway doesn't time out (Notion + Claude takes ~15s).
      # All the real work happens in a background thread — email arrives shortly after.
      Thread.new do
        Rails.application.executor.wrap do
          result = PostDraftingService.new(force_type: force_type).draft!

          AdminMailer.post_draft(
            draft:          result[:draft],
            type:           result[:type],
            day:            result[:day],
            week:           result[:week],
            stats:          result[:stats],
            donation_stats: result[:donation_stats]
          ).deliver_now

          Rails.logger.info("[PostDraftController] Draft emailed — Day #{result[:day]}, #{result[:type]}")
        rescue => e
          Rails.logger.error("[PostDraftController] Background draft failed: #{e.message}")
        end
      end

      render json: { success: true, message: "Draft generation started — email will arrive shortly." }, status: :accepted
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
