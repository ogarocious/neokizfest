# frozen_string_literal: true

class RefundProgressController < ApplicationController
  # Skip CSRF for the refresh endpoint (called by n8n or external services)
  skip_before_action :verify_authenticity_token, only: [:refresh]

  # GET /progress
  # Public accountability dashboard showing anonymized refund progress
  def index
    progress_data = fetch_progress_data

    render inertia: "Progress", props: {
      last_updated: progress_data[:last_updated],
      stats: progress_data[:stats],
      refunds: progress_data[:refunds],
      community_support: progress_data[:community_support],
      donation_stats: progress_data[:donation_stats] || { total_donated: 0, donor_count: 0, waive_and_donate_count: 0 },
      community_messages: progress_data[:community_messages] || []
    }
  end

  # POST /progress/refresh
  # Cache-busting endpoint for external services (e.g., n8n after processing a refund)
  # Requires Authorization header with bearer token matching REFUND_CACHE_SECRET
  def refresh
    unless valid_refresh_token?
      return render json: { error: "Unauthorized" }, status: :unauthorized
    end

    Notion::ProgressService.bust_cache
    render json: { success: true, message: "Cache cleared" }, status: :ok
  end

  private

  def fetch_progress_data
    Notion::ProgressService.new.fetch
  rescue Notion::ApiClient::ConfigurationError => e
    # Return mock data if Notion isn't configured (development without API key)
    Rails.logger.info("[RefundProgressController] Notion not configured, using mock data: #{e.message}")
    mock_progress_data
  rescue Notion::ApiClient::NotionError => e
    Rails.logger.error("[RefundProgressController] Failed to fetch progress: #{e.message}")
    # Return empty data structure on error
    {
      last_updated: Time.current.iso8601,
      stats: { total_ticket_holders: 0, total_requests: 0, completed: 0, processing: 0, submitted: 0, waived: 0, chargebacks: 0 },
      refunds: [],
      community_support: [],
      donation_stats: { total_donated: 0, donor_count: 0, waive_and_donate_count: 0 },
      community_messages: []
    }
  end

  def valid_refresh_token?
    # Prefer dedicated token, fall back to shared secret for backward compatibility
    expected_token = Rails.application.credentials.progress_refresh_secret.presence ||
                     Rails.application.credentials.refund_cache_secret
    return false if expected_token.blank?

    auth_header = request.headers["Authorization"]
    return false if auth_header.blank?

    provided_token = auth_header.gsub(/^Bearer\s+/i, "")
    ActiveSupport::SecurityUtils.secure_compare(provided_token, expected_token)
  end

  # Mock data for development when Notion isn't configured
  def mock_progress_data
    {
      last_updated: Time.current.iso8601,
      stats: {
        total_ticket_holders: 203,
        total_requests: 34,
        completed: 21,
        processing: 5,
        submitted: 6,
        waived: 8,
        chargebacks: 3
      },
      refunds: [
        { id: "RR-0012", initials: "S.M.", status: "completed", paid: true },
        { id: "RR-0008", initials: "J.T.", status: "completed", paid: true },
        { id: "RR-0015", initials: "A.K.", status: "completed" },
        { id: "RR-0022", initials: "M.L.", status: "processing" },
        { id: "RR-0019", initials: "D.R.", status: "processing" },
        { id: "RR-0025", initials: "R.B.", status: "submitted" },
        { id: "RR-0027", initials: "L.P.", status: "submitted" }
      ],
      community_support: [
        { id: "RR-0003", initials: "K.B.", donated: true },
        { id: "RR-0011", initials: "P.S." },
        { id: "RR-0007", initials: "A.W." },
        { id: "RR-0014", initials: "M.C." }
      ],
      donation_stats: {
        total_donated: 126.00,
        donor_count: 3,
        waive_and_donate_count: 1
      },
      community_messages: [
        { initials: "K.B.", message: "This community changed my life. Wishing you all the best.", type: "waive" },
        { initials: "R.M.", message: "Thank you for doing the right thing. Neo Kiz forever!", type: "donation" }
      ]
    }
  end
end
