# frozen_string_literal: true

module Notion
  # Service for fetching sanitized refund progress data for the public dashboard
  # This service is privacy-focused: it only returns initials and confirmation numbers
  # NEVER returns: full names, emails, dollar amounts, contact info, or any PII
  class ProgressService
    DATABASE_ID = Rails.application.credentials.dig(:notion, :refund_requests_db_id)
    TICKET_HOLDERS_DB_ID = Rails.application.credentials.dig(:notion, :master_ticket_holders_db_id)
    SUPPORTER_ORDERS_DB_ID = Rails.application.credentials.dig(:notion, :supporter_orders_db_id)
    ZELLE_TRANSFERS_DB_ID = Rails.application.credentials.dig(:notion, :zelle_transfers_db_id)
    CACHE_KEY = "neo_kiz_refund_progress"
    CACHE_TTL = 1.hour

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
      # Fire all 4 independent Notion queries concurrently.
      # Each creates its own ApiClient instance to avoid thread-safety concerns.
      # MRI Ruby releases the GIL during network I/O, so all 4 HTTP calls run in parallel.
      holder_future     = Concurrent::Future.execute { fetch_ticket_holder_data }
      supporters_future = Concurrent::Future.execute { fetch_all_supporter_orders }
      zelle_future      = Concurrent::Future.execute { fetch_paid_request_ids }
      requests_future   = Concurrent::Future.execute { fetch_all_refund_requests }

      # Each method returns a safe default on error, so .value! won't raise
      holder_data      = holder_future.value!
      supporter_pages  = supporters_future.value!
      paid_request_ids = zelle_future.value!
      all_requests     = requests_future.value!

      # Pure Ruby — no extra API call needed
      donation_data = compute_donation_stats(supporter_pages)

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
          email = extract_email_from_ticket_holder(page.properties["Ticket Holder"], holder_data[:email_lookup] || {})
          also_donated = email.present? && donation_data[:waive_donate_emails].include?(email.downcase)
          waived << entry.slice(:id, :initials).merge(donated: also_donated)
        end

        # Also check decision for waived (in case status isn't "Waived")
        if entry[:decision]&.downcase&.include?("waive") && entry[:status]&.downcase != "waived"
          unless waived.any? { |w| w[:id] == entry[:id] }
            email = extract_email_from_ticket_holder(page.properties["Ticket Holder"], holder_data[:email_lookup] || {})
            also_donated = email.present? && donation_data[:waive_donate_emails].include?(email.downcase)
            waived << entry.slice(:id, :initials).merge(donated: also_donated)
          end
        end
      end

      # Mark completed refunds that have a Zelle payment
      refunds.each do |r|
        r[:paid] = true if r[:page_id] && paid_request_ids.include?(r[:page_id])
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
        community_support: waived.map { |w| sanitize_community_support(w) },
        donation_stats: donation_data[:stats],
        community_messages: fetch_community_messages(all_requests, holder_data, donation_data, supporter_pages)
      }
    end

    # Fetch all refund requests, sorted newest first
    def fetch_all_refund_requests
      Notion::ApiClient.new.query_database(
        database_id: DATABASE_ID,
        sorts: [{ property: "Date Submitted", direction: "descending" }]
      )
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[ProgressService] Failed to fetch refund requests: #{e.message}")
      []
    end

    # Fetch all supporter orders (unfiltered). Used for both donation stats and
    # community messages — avoids a second round-trip to the same database.
    def fetch_all_supporter_orders
      return [] unless SUPPORTER_ORDERS_DB_ID

      Notion::ApiClient.new.query_database(database_id: SUPPORTER_ORDERS_DB_ID)
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[ProgressService] Failed to fetch supporter orders: #{e.message}")
      []
    end

    # Fetch ticket holders and build a name lookup map (page_id → name)
    # Reuses the same query for both stats and initials fallback
    def fetch_ticket_holder_data
      return { total: 0, chargebacks: 0, name_lookup: {}, initials_lookup: {}, email_lookup: {} } unless TICKET_HOLDERS_DB_ID

      results = Notion::ApiClient.new.query_database(database_id: TICKET_HOLDERS_DB_ID)
      chargebacks = results.count { |page| chargeback?(page) }

      name_lookup = {}
      initials_lookup = {}
      email_lookup = {}
      results.each do |page|
        name = extract_title(page.properties["Name"]) || extract_title(page.properties["Ticket Holder"])
        name_lookup[page.id] = name if name.present?

        holder_initials = extract_formula(page.properties["Initials"]).presence
        initials_lookup[page.id] = holder_initials if holder_initials

        email = page.properties.dig("Email", "email")
        email_lookup[page.id] = email.downcase if email.present?
      end

      { total: results.count, chargebacks: chargebacks, name_lookup: name_lookup, initials_lookup: initials_lookup, email_lookup: email_lookup }
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[ProgressService] Failed to fetch ticket holder data: #{e.message}")
      { total: 0, chargebacks: 0, name_lookup: {}, initials_lookup: {}, email_lookup: {} }
    end

    # Pure Ruby — compute donation stats from pre-fetched supporter order pages.
    # Filters for Order Type = Donation in Ruby instead of a separate filtered API call.
    def compute_donation_stats(pages)
      empty = { stats: { total_donated: 0, donor_count: 0, waive_and_donate_count: 0 }, waive_donate_emails: Set.new }
      return empty if pages.empty?

      donation_pages = pages.select { |p| p.properties.dig("Order Type", "select", "name") == "Donation" }

      total = 0.0
      waive_and_donate_count = 0
      waive_donate_emails = Set.new
      donation_pages.each do |page|
        amount = page.properties.dig("Amount Paid", "number")
        total += amount.to_f if amount

        notes = Array(page.properties.dig("Notes", "rich_text")).map { |t| t.dig("plain_text") }.join
        if notes.include?("Waived refund")
          waive_and_donate_count += 1
          email = page.properties.dig("Email", "email")
          waive_donate_emails << email.downcase if email.present?
        end
      end

      {
        stats: { total_donated: total.round(2), donor_count: donation_pages.size, waive_and_donate_count: waive_and_donate_count },
        waive_donate_emails: waive_donate_emails
      }
    end

    # Fetch Zelle Transfers and return a Set of refund request page IDs that have been paid
    def fetch_paid_request_ids
      return Set.new unless ZELLE_TRANSFERS_DB_ID

      results = Notion::ApiClient.new.query_database(database_id: ZELLE_TRANSFERS_DB_ID)

      paid_ids = Set.new
      results.each do |page|
        related = Array(page.properties.dig("Linked Request", "relation"))
        related.each { |r| paid_ids << r["id"] }
      end

      paid_ids
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[ProgressService] Failed to fetch Zelle transfers: #{e.message}")
      Set.new
    end

    # Collect approved community messages from both refund requests and donations.
    # Reuses already-fetched pages for both sources — no additional API calls.
    def fetch_community_messages(refund_pages, holder_data, donation_data, supporter_pages)
      messages = []

      # From refund requests (already fetched)
      refund_pages.each do |page|
        next unless page.properties.dig("Message Approved", "checkbox") == true

        text = extract_rich_text(page.properties["Community Message"])
        next if text.blank?

        initials = lookup_ticket_holder_initials(page.properties["Ticket Holder"], holder_data[:initials_lookup] || {}) ||
                   extract_formula(page.properties["Initials"]).presence ||
                   derive_initials_from_title(page.properties["Name"]) ||
                   "—"

        decision = extract_select(page.properties["Decision"])
        msg_type = decision&.downcase&.include?("waive") ? "waive" : "refund"

        messages << { initials: initials, message: text, type: msg_type }
      end

      # From supporter orders — filter approved messages from pre-fetched pages (no API call)
      supporter_pages.select { |p| p.properties.dig("Message Approved", "checkbox") == true }.each do |page|
        text = extract_rich_text(page.properties["Community Message"])
        next if text.blank?

        name = extract_title(page.properties["Name"])
        initials = name.present? ? initials_from_name(name) : "—"

        messages << { initials: initials || "—", message: text, type: "donation" }
      end

      messages
    end

    def extract_rich_text(prop)
      return nil unless prop
      Array(prop["rich_text"]).map { |t| t.dig("plain_text") }.join.presence
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
        decision: extract_select(props["Decision"]),
        page_id: page.id
      }
    end

    # Final sanitization - ensures only safe fields are included
    def sanitize_for_public(entry)
      result = {
        id: entry[:id],
        initials: entry[:initials].presence || "—",
        status: normalize_status(entry[:status])
      }.compact
      result[:paid] = true if entry[:paid]
      result
    end

    # Sanitize community support entries (waived), including donated flag
    def sanitize_community_support(entry)
      result = {
        id: entry[:id],
        initials: entry[:initials].presence || "—"
      }
      result[:donated] = true if entry[:donated]
      result
    end

    # Look up ticket holder email via relation (for cross-referencing with donations)
    def extract_email_from_ticket_holder(relation_prop, email_lookup)
      return nil unless relation_prop && email_lookup.present?

      related_ids = Array(relation_prop["relation"]).map { |r| r["id"] }
      return nil if related_ids.empty?

      email_lookup[related_ids.first]
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
