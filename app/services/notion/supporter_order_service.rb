# frozen_string_literal: true

module Notion
  class SupporterOrderService
    DATABASE_ID = Rails.application.credentials.dig(:notion, :supporter_orders_db_id)

    def initialize
      @client = Notion::ApiClient.new
    end

    # Create a new supporter order record in Notion
    def create(params)
      properties = build_properties(params)
      page = @client.create_page(database_id: DATABASE_ID, properties: properties)

      { success: true, page_id: page.id }
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[SupporterOrderService] Create failed: #{e.message}")
      { success: false, error: :creation_failed, message: e.message }
    end

    # Check if an order with this identifier already exists (dedup)
    def find_by_identifier(identifier)
      return nil if identifier.blank?

      results = @client.query_database(
        database_id: DATABASE_ID,
        filter: {
          property: "Payment Confirmation",
          rich_text: { equals: identifier }
        }
      )

      results.first
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[SupporterOrderService] Lookup failed: #{e.message}")
      nil
    end

    private

    def build_properties(params)
      properties = {
        "Name" => {
          title: [{ text: { content: params[:name].to_s } }]
        },
        "Email" => {
          email: params[:email]
        },
        "Amount Paid" => {
          number: params[:amount_paid].to_f
        },
        "Date Received" => {
          date: { start: params[:date_received] }
        },
        "Order Type" => {
          select: { name: "Donation" }
        },
        "Payment Confirmation" => {
          rich_text: [{ text: { content: params[:identifier].to_s } }]
        },
        "Payment Method" => {
          select: { name: "Lemon Squeezy" }
        },
        "Status" => {
          status: { name: params[:status] || "Received" }
        }
      }

      if params[:notes].present?
        properties["Notes"] = {
          rich_text: [{ text: { content: params[:notes] } }]
        }
      end

      properties
    end
  end
end
