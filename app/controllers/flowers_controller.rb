# frozen_string_literal: true

class FlowersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:refresh]

  # GET /flowers
  def index
    data = fetch_flowers_data

    render inertia: "Flowers", props: {
      flowers: data[:flowers],
      communityMessages: data[:community_messages] || [],
      lastUpdated: data[:last_updated],
      cloudinaryCloudName: Rails.application.credentials.dig(:cloudinary, :cloud_name) || "",
      cloudinaryUploadPreset: Rails.application.credentials.dig(:cloudinary, :upload_preset) || ""
    }
  end

  # POST /flowers/refresh
  def refresh
    unless valid_refresh_token?
      return render json: { error: "Unauthorized" }, status: :unauthorized
    end

    Notion::FlowersService.bust_cache
    render json: { success: true, message: "Cache cleared" }, status: :ok
  end

  private

  def fetch_flowers_data
    Notion::FlowersService.new.fetch
  rescue Notion::ApiClient::ConfigurationError => e
    Rails.logger.info("[FlowersController] Notion not configured: #{e.message}")
    { flowers: [], last_updated: Time.current.iso8601 }
  rescue Notion::ApiClient::NotionError => e
    Rails.logger.error("[FlowersController] Failed to fetch flowers: #{e.message}")
    { flowers: [], last_updated: Time.current.iso8601 }
  end

  def valid_refresh_token?
    expected_token = Rails.application.credentials.refund_cache_secret
    return false if expected_token.blank?

    auth_header = request.headers["Authorization"]
    return false if auth_header.blank?

    provided_token = auth_header.gsub(/^Bearer\s+/i, "")
    ActiveSupport::SecurityUtils.secure_compare(provided_token, expected_token)
  end
end
