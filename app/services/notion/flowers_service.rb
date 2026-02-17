# frozen_string_literal: true

module Notion
  # Service for managing the Flowers gallery — community testimonials and curated content
  # Privacy-first: emails are never sent to the frontend
  class FlowersService
    DATABASE_ID = Rails.application.credentials.dig(:notion, :flowers_db_id)
    REFUND_REQUESTS_DB_ID = Rails.application.credentials.dig(:notion, :refund_requests_db_id)
    SUPPORTER_ORDERS_DB_ID = Rails.application.credentials.dig(:notion, :supporter_orders_db_id)
    TICKET_HOLDERS_DB_ID = Rails.application.credentials.dig(:notion, :master_ticket_holders_db_id)
    CACHE_KEY = "neo_kiz_flowers"
    CACHE_TTL = 1.hour

    def initialize
      @client = Notion::ApiClient.new
    end

    # Fetch approved flowers with caching
    def fetch
      Rails.cache.fetch(CACHE_KEY, expires_in: CACHE_TTL) do
        fetch_fresh_data
      end
    end

    # Force refresh the cache
    def self.bust_cache
      Rails.cache.delete(CACHE_KEY)
    end

    # Create a new flower submission in Notion (Approved: false by default)
    def create_submission(name:, email:, content_type:, message: nil, media_url: nil)
      raise Notion::ApiClient::ConfigurationError, "Flowers database not configured" if DATABASE_ID.blank?

      properties = {
        "Name" => { title: [{ text: { content: name } }] },
        "Email" => { email: email },
        "Content Type" => { select: { name: content_type.capitalize } },
        "Source" => { select: { name: "Submission" } },
        "Approved" => { checkbox: false }
      }

      if message.present?
        properties["Message"] = { rich_text: [{ text: { content: message.truncate(2000) } }] }
      end

      if media_url.present?
        properties["Media URL"] = { url: media_url }
      end

      @client.create_page(database_id: DATABASE_ID, properties: properties)
    end

    private

    def fetch_fresh_data
      raise Notion::ApiClient::ConfigurationError, "Flowers database not configured" if DATABASE_ID.blank?

      results = @client.query_database(
        database_id: DATABASE_ID,
        filter: {
          property: "Approved",
          checkbox: { equals: true }
        },
        sorts: [{ timestamp: "created_time", direction: "descending" }]
      )

      flowers = results.filter_map { |page| parse_flower(page) }

      # Pull in approved community messages from other databases
      community_messages = fetch_community_messages

      {
        flowers: flowers,
        community_messages: community_messages,
        last_updated: Time.current.iso8601
      }
    end

    # Fetch approved community messages from refund requests and supporter orders
    # Uses first names (not initials) for a warmer display on the Flowers page
    def fetch_community_messages
      messages = []

      # From refund requests
      if REFUND_REQUESTS_DB_ID.present?
        name_lookup = fetch_ticket_holder_name_lookup

        refund_pages = @client.query_database(database_id: REFUND_REQUESTS_DB_ID)
        refund_pages.each do |page|
          next unless page.properties.dig("Message Approved", "checkbox") == true

          text = extract_rich_text(page.properties["Community Message"])
          next if text.blank?

          display_name = first_name_from_ticket_holder(page.properties["Ticket Holder"], name_lookup) ||
                         first_name_from_title(page.properties["Name"]) ||
                         "Anonymous"

          decision = extract_select(page.properties["Decision"])
          msg_type = decision&.downcase&.include?("waive") ? "community_waive" : "community_refund"

          messages << {
            id: "cm-#{page.id}",
            display_name: display_name,
            content_type: "text",
            message: text,
            source: msg_type,
            date_submitted: page.dig("created_time")
          }
        end
      end

      # From supporter orders (donations)
      if SUPPORTER_ORDERS_DB_ID.present?
        donation_pages = @client.query_database(
          database_id: SUPPORTER_ORDERS_DB_ID,
          filter: {
            property: "Message Approved",
            checkbox: { equals: true }
          }
        )

        donation_pages.each do |page|
          text = extract_rich_text(page.properties["Community Message"])
          next if text.blank?

          name = extract_title(page.properties["Name"])
          display_name = name.present? ? first_name(name) : "Anonymous"

          messages << {
            id: "cm-#{page.id}",
            display_name: display_name,
            content_type: "text",
            message: text,
            source: "community_donation",
            date_submitted: page.dig("created_time")
          }
        end
      end

      messages
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[FlowersService] Failed to fetch community messages: #{e.message}")
      []
    end

    # Build a lookup of ticket holder page_id → full name
    def fetch_ticket_holder_name_lookup
      return {} unless TICKET_HOLDERS_DB_ID.present?

      results = @client.query_database(database_id: TICKET_HOLDERS_DB_ID)
      lookup = {}
      results.each do |page|
        name = extract_title(page.properties["Name"]) || extract_title(page.properties["Ticket Holder"])
        lookup[page.id] = name if name.present?
      end
      lookup
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[FlowersService] Failed to fetch ticket holder names: #{e.message}")
      {}
    end

    # Follow the Ticket Holder relation and return their first name
    def first_name_from_ticket_holder(relation_prop, name_lookup)
      return nil unless relation_prop && name_lookup.present?
      related_ids = Array(relation_prop["relation"]).map { |r| r["id"] }
      return nil if related_ids.empty?
      full_name = name_lookup[related_ids.first]
      full_name.present? ? first_name(full_name) : nil
    end

    # Extract first name from the refund request title (e.g., "John Smith — Full Refund" → "John")
    def first_name_from_title(prop)
      title_text = extract_title(prop)
      return nil if title_text.blank?
      name_part = title_text.split(" — ").first&.strip
      name_part.present? ? first_name(name_part) : nil
    end

    def parse_flower(page)
      props = page.properties

      name = extract_title(props["Name"])
      return nil if name.blank?

      display_name = extract_rich_text(props["Display Name"]).presence || first_name(name)
      content_type = extract_select(props["Content Type"])&.downcase || "text"
      source = extract_select(props["Source"])&.downcase || "submission"

      {
        id: page.id,
        display_name: display_name,
        content_type: content_type,
        message: extract_rich_text(props["Message"]),
        media_url: props.dig("Media URL", "url"),
        source: source,
        date_submitted: props.dig("Date Submitted", "date", "start") || page.dig("created_time")
      }.compact
    end

    # Extract just the first name for public display
    def first_name(full_name)
      full_name.to_s.split(/\s+/).first.presence || full_name
    end

    def extract_title(prop)
      return nil unless prop
      Array(prop["title"]).map { |t| t.dig("plain_text") }.join.presence
    end

    def extract_rich_text(prop)
      return nil unless prop
      Array(prop["rich_text"]).map { |t| t.dig("plain_text") }.join.presence
    end

    def extract_select(prop)
      prop&.dig("select", "name")
    end
  end
end
