# frozen_string_literal: true

module Notion
  # Shared Notion API client wrapper with error handling
  # Named ApiClient to avoid collision with notion-ruby-client gem's Notion::Client
  class ApiClient
    class NotionError < StandardError; end
    class RecordNotFoundError < NotionError; end
    class RateLimitError < NotionError; end
    class ConfigurationError < NotionError; end

    def initialize
      raise ConfigurationError, "NOTION_API_KEY is not configured" if api_key.blank?
    end

    def client
      # Use the gem's Notion::Client
      @client ||= ::Notion::Client.new(token: api_key)
    end

    # Query a database with optional filters and pagination
    # Returns all results by handling pagination automatically
    def query_database(database_id:, filter: nil, sorts: nil)
      raise ConfigurationError, "Database ID is required" if database_id.blank?

      results = []
      has_more = true
      start_cursor = nil

      while has_more
        response = client.database_query(
          database_id: database_id,
          filter: filter,
          sorts: sorts,
          start_cursor: start_cursor,
          page_size: 100
        )

        results.concat(response.results)
        has_more = response.has_more
        start_cursor = response.next_cursor
      end

      results
    rescue Faraday::TooManyRequestsError => e
      raise RateLimitError, "Notion API rate limit exceeded: #{e.message}"
    rescue StandardError => e
      Rails.logger.error("[Notion::Client] Query failed: #{e.message}")
      raise NotionError, "Failed to query Notion database: #{e.message}"
    end

    # Create a new page (record) in a database
    def create_page(database_id:, properties:)
      raise ConfigurationError, "Database ID is required" if database_id.blank?

      client.create_page(
        parent: { database_id: database_id },
        properties: properties
      )
    rescue Faraday::TooManyRequestsError => e
      raise RateLimitError, "Notion API rate limit exceeded: #{e.message}"
    rescue StandardError => e
      Rails.logger.error("[Notion::Client] Create failed: #{e.message}")
      raise NotionError, "Failed to create Notion page: #{e.message}"
    end

    # Update an existing page
    def update_page(page_id:, properties:)
      raise ConfigurationError, "Page ID is required" if page_id.blank?

      client.update_page(
        page_id: page_id,
        properties: properties
      )
    rescue Faraday::TooManyRequestsError => e
      raise RateLimitError, "Notion API rate limit exceeded: #{e.message}"
    rescue StandardError => e
      Rails.logger.error("[Notion::Client] Update failed: #{e.message}")
      raise NotionError, "Failed to update Notion page: #{e.message}"
    end

    # Retrieve a single page by ID
    def get_page(page_id:)
      raise ConfigurationError, "Page ID is required" if page_id.blank?

      client.page(page_id: page_id)
    rescue Faraday::ResourceNotFound
      raise RecordNotFoundError, "Page not found: #{page_id}"
    rescue StandardError => e
      Rails.logger.error("[Notion::Client] Get page failed: #{e.message}")
      raise NotionError, "Failed to retrieve Notion page: #{e.message}"
    end

    private

    def api_key
      ENV.fetch("NOTION_API_KEY", nil)
    end
  end
end
