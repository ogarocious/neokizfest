# frozen_string_literal: true

# Rate limiting configuration for API endpoints
# Uses Rails.cache (memory_store) as the backing store

# Disable rate limiting in test environment
Rack::Attack.enabled = !Rails.env.test?

class Rack::Attack
  # Use Rails cache for rate limit tracking
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

  # === Throttle: Email validation ===
  # 5 requests per minute per IP
  # Prevents email enumeration attacks
  throttle("api/validate-email", limit: 5, period: 1.minute) do |req|
    req.ip if req.path == "/api/refunds/validate-email" && req.post?
  end

  # === Throttle: Refund submission ===
  # 3 requests per hour per IP
  # Prevents spam submissions
  throttle("api/refund-submit", limit: 3, period: 1.hour) do |req|
    req.ip if req.path == "/api/refunds" && req.post?
  end

  # === Throttle: Status lookup ===
  # 10 requests per minute per IP
  # More generous since users may retry with typos
  throttle("api/status-lookup", limit: 10, period: 1.minute) do |req|
    req.ip if req.path == "/api/refunds/status" && req.post?
  end

  # === Throttle: Donation checkout ===
  # 5 requests per minute per IP
  # Prevents checkout session spam
  throttle("api/donation-checkout", limit: 5, period: 1.minute) do |req|
    req.ip if req.path == "/api/donations/checkout" && req.post?
  end

  # === Response for throttled requests ===
  self.throttled_responder = lambda do |req|
    retry_after = (req.env["rack.attack.match_data"] || {})[:period]
    [
      429,
      {
        "Content-Type" => "application/json",
        "Retry-After" => retry_after.to_s
      },
      [{ error: "rate_limited", errorMessage: "Too many requests. Please try again later." }.to_json]
    ]
  end
end
