class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  rescue_from Notion::ApiClient::RateLimitError, with: :notion_rate_limited

  private

  def normalize_email(email)
    email.to_s.strip.downcase
  end

  def notion_rate_limited(exception)
    Rails.logger.warn("[ApplicationController] Notion rate limit hit: #{exception.message}")
    render json: {
      success: false,
      error: "rate_limited",
      errorMessage: "Our data service is temporarily busy. Please try again in a moment."
    }, status: :too_many_requests
  end
end
