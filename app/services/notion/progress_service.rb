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
      # Fetch ticket holders first so we can build a name lookup for initials fallback
      holder_data = fetch_ticket_holder_data

      all_requests = @client.query_database(
        database_id: DATABASE_ID,
        sorts: [{ property: "Date Submitted", direction: "descending" }]
      )

      refunds = []
      waived = []
      stats = { total: 0, completed: 0, processing: 0, submitted: 0, verified: 0, waived: 0 }

      all_requests.each do |page|
        entry = parse_sanitized_entry(page, holder_data)
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

      {
        last_updated: Time.current.iso8601,
        stats: {
          total_ticket_holders: holder_data[:total],
          total_requests: stats[:total],
          completed: stats[:completed],
          processing: stats[:processing] + stats[:verified],
          submitted: stats[:submitted],
          waived: stats[:waived],
          chargebacks: holder_data[:chargebacks]
        },
        refunds: refunds.map { |r| sanitize_for_public(r) },
        community_support: waived.map { |w| sanitize_for_public(w) }
      }
    end

    # Fetch ticket holders and build a name lookup map (page_id → name)
    # Reuses the same query for both stats and initials fallback
    def fetch_ticket_holder_data
      return { total: 0, chargebacks: 0, name_lookup: {}, initials_lookup: {} } unless TICKET_HOLDERS_DB_ID

      results = @client.query_database(database_id: TICKET_HOLDERS_DB_ID)
      chargebacks = results.count { |page| chargeback?(page) }

      name_lookup = {}
      initials_lookup = {}
      results.each do |page|
        name = extract_title(page.properties["Name"]) || extract_title(page.properties["Ticket Holder"])
        name_lookup[page.id] = name if name.present?

        holder_initials = extract_formula(page.properties["Initials"]).presence
        initials_lookup[page.id] = holder_initials if holder_initials
      end

      { total: results.count, chargebacks: chargebacks, name_lookup: name_lookup, initials_lookup: initials_lookup }
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[ProgressService] Failed to fetch ticket holder data: #{e.message}")
      { total: 0, chargebacks: 0, name_lookup: {}, initials_lookup: {} }
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

    def parse_sanitized_entry(page, holder_data = {})
      props = page.properties

      confirmation = extract_confirmation_number(props["Confirmation #"])
      return nil unless confirmation

      # Prefer Ticket Holder initials (most reliable), then refund request formula,
      # then derive from title, then derive from ticket holder name, then fallback
      initials = lookup_ticket_holder_initials(props["Ticket Holder"], holder_data[:initials_lookup] || {}) ||
                 extract_formula(props["Initials"]).presence ||
                 derive_initials_from_title(props["Name"]) ||
                 derive_initials_from_ticket_holder(props["Ticket Holder"], holder_data[:name_lookup] || {}) ||
                 "—"

      {
        id: confirmation,
        initials: initials,
        status: extract_status(props["Status"]),
        decision: extract_select(props["Decision"])
      }
    end

    # Final sanitization - ensures only safe fields are included
    def sanitize_for_public(entry)
      {
        id: entry[:id],
        initials: entry[:initials].presence || "—",
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

    # Fallback: derive initials from the Name title property
    # Title format is "First Last — Decision" (e.g., "John Smith — Full Refund")
    def derive_initials_from_title(prop)
      title_text = extract_title(prop)
      return nil if title_text.blank?

      # Split on " — " to get just the name portion (before the decision)
      name_part = title_text.split(" — ").first&.strip
      return nil if name_part.blank?

      initials_from_name(name_part)
    end

    # Preferred: use the Ticket Holder's own Initials formula (most reliable source)
    def lookup_ticket_holder_initials(relation_prop, initials_lookup)
      return nil unless relation_prop && initials_lookup.present?

      related_ids = Array(relation_prop["relation"]).map { |r| r["id"] }
      return nil if related_ids.empty?

      initials_lookup[related_ids.first]
    end

    # Fallback: follow Ticket Holder relation and look up name from pre-fetched map
    def derive_initials_from_ticket_holder(relation_prop, name_lookup)
      return nil unless relation_prop && name_lookup.present?

      related_ids = Array(relation_prop["relation"]).map { |r| r["id"] }
      return nil if related_ids.empty?

      name = name_lookup[related_ids.first]
      return nil if name.blank?

      initials_from_name(name)
    end

    # Convert a full name to formatted initials (e.g., "John Smith" → "J.S.")
    def initials_from_name(name)
      letters = name.split(/\s+/).map { |word| word[0]&.upcase }.compact.join(".")
      letters.present? ? "#{letters}." : nil
    end

    def extract_title(prop)
      return nil unless prop

      Array(prop["title"]).map { |t| t.dig("plain_text") }.join.presence
    end
  end
end
