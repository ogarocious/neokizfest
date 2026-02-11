# frozen_string_literal: true

module Notion
  # Service for fetching sanitized refund progress data for the public dashboard
  # This service is privacy-focused: it only returns initials and confirmation numbers
  # NEVER returns: full names, emails, dollar amounts, contact info, or any PII
  class ProgressService
    DATABASE_ID = Rails.application.credentials.dig(:notion, :refund_requests_db_id)
    TICKET_HOLDERS_DB_ID = Rails.application.credentials.dig(:notion, :master_ticket_holders_db_id)
    CACHE_KEY = "neo_kiz_refund_progress"
    CACHE_TTL = 15.minutes

    def initialize
      @client = Notion::ApiClient.new
    end

    # Fetch sanitized progress data with caching
    # Returns data suitable for public display
    def fetch
      Rails.cache.fetch(CACHE_KEY, expires_in: CACHE_TTL) do
        fetch_fresh_data
      end
    end

    # Force refresh the cache
    def self.bust_cache
      Rails.cache.delete(CACHE_KEY)
    end

    private

    def fetch_fresh_data
      all_requests = @client.query_database(
        database_id: DATABASE_ID,
        sorts: [{ property: "Date Submitted", direction: "descending" }]
      )

      refunds = []
      waived = []
      stats = { total: 0, completed: 0, processing: 0, submitted: 0, verified: 0, waived: 0 }

      all_requests.each do |page|
        entry = parse_sanitized_entry(page)
        next unless entry

        stats[:total] += 1

        case entry[:status]&.downcase
        when "completed"
          stats[:completed] += 1
          refunds << entry
        when "processing"
          stats[:processing] += 1
          refunds << entry
        when "verified"
          stats[:verified] += 1
          refunds << entry
        when "submitted"
          stats[:submitted] += 1
          refunds << entry
        when "waived"
          stats[:waived] += 1
          waived << entry.slice(:id, :initials)
        end

        # Also check decision for waived (in case status isn't "Waived")
        if entry[:decision]&.downcase&.include?("waive") && entry[:status]&.downcase != "waived"
          # Move to waived list if decision is waive but status tracking differs
          waived << entry.slice(:id, :initials) unless waived.any? { |w| w[:id] == entry[:id] }
        end
      end

      # Sort refunds: completed first, then processing, then verified, then submitted
      status_order = { "completed" => 0, "processing" => 1, "verified" => 2, "submitted" => 3 }
      refunds.sort_by! { |r| [status_order[r[:status]&.downcase] || 99, r[:id]] }

      holder_stats = fetch_ticket_holder_stats

      {
        last_updated: Time.current.iso8601,
        stats: {
          total_ticket_holders: holder_stats[:total],
          total_requests: stats[:total],
          completed: stats[:completed],
          processing: stats[:processing] + stats[:verified],
          submitted: stats[:submitted],
          waived: stats[:waived],
          chargebacks: holder_stats[:chargebacks]
        },
        refunds: refunds.map { |r| sanitize_for_public(r) },
        community_support: waived.map { |w| sanitize_for_public(w) }
      }
    end

    def fetch_ticket_holder_stats
      return { total: 0, chargebacks: 0 } unless TICKET_HOLDERS_DB_ID

      results = @client.query_database(database_id: TICKET_HOLDERS_DB_ID)
      chargebacks = results.count { |page| chargeback?(page) }
      { total: results.count, chargebacks: chargebacks }
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[ProgressService] Failed to fetch ticket holder stats: #{e.message}")
      { total: 0, chargebacks: 0 }
    end

    def chargeback?(page)
      prop = page.properties["Chargeback"]
      return false unless prop

      case prop["type"]
      when "checkbox"
        prop["checkbox"] == true
      when "select"
        name = prop.dig("select", "name")
        name.present? && !%w[none no false].include?(name.downcase)
      else
        false
      end
    end

    def parse_sanitized_entry(page)
      props = page.properties

      confirmation = extract_confirmation_number(props["Confirmation #"])
      return nil unless confirmation

      {
        id: confirmation,
        initials: extract_formula(props["Initials"]) || "—",
        status: extract_status(props["Status"]),
        decision: extract_select(props["Decision"])
      }
    end

    # Final sanitization - ensures only safe fields are included
    def sanitize_for_public(entry)
      {
        id: entry[:id],
        initials: entry[:initials] || "—",
        status: normalize_status(entry[:status])
      }.compact
    end

    def normalize_status(status)
      return nil unless status

      case status.downcase
      when "completed" then "completed"
      when "processing", "verified" then "processing"
      when "submitted" then "submitted"
      when "waived" then "waived"
      else "pending"
      end
    end

    def extract_confirmation_number(prop)
      return nil unless prop

      prefix = prop.dig("unique_id", "prefix") || "RR"
      number = prop.dig("unique_id", "number")

      return nil unless number

      "#{prefix}-#{number.to_s.rjust(4, '0')}"
    end

    def extract_status(prop)
      prop&.dig("status", "name")
    end

    def extract_select(prop)
      prop&.dig("select", "name")
    end

    def extract_formula(prop)
      prop&.dig("formula", "string")
    end
  end
end
