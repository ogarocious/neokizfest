# frozen_string_literal: true

module Notion
  # Service for creating and managing refund requests in Notion
  class RefundRequestService
    DATABASE_ID = Rails.application.credentials.dig(:notion, :refund_requests_db_id)

    # Shirt price constant
    SHIRT_PRICE = 45

    def initialize
      @client = Notion::ApiClient.new
    end

    # Create a new refund request
    # Returns confirmation number on success
    def create(params)
      validate_params!(params)

      properties = build_properties(params)
      page = @client.create_page(database_id: DATABASE_ID, properties: properties)

      # Extract the confirmation number from the created page
      confirmation_number = extract_confirmation_number(page)

      {
        success: true,
        confirmation_number: confirmation_number,
        page_id: page.id
      }
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[RefundRequestService] Create failed: #{e.message}")
      { success: false, error: :creation_failed, message: e.message }
    end

    # Look up a refund request by confirmation number and email
    def find_by_confirmation_and_email(confirmation_number:, email:)
      results = @client.query_database(
        database_id: DATABASE_ID,
        filter: {
          and: [
            { property: "Confirmation #", unique_id: { equals: parse_confirmation_id(confirmation_number) } },
            { property: "Email", email: { equals: email.strip.downcase } }
          ]
        }
      )

      return { success: false, error: :not_found, message: "Request not found" } if results.empty?

      request = parse_refund_request(results.first)
      { success: true, request: request }
    rescue Notion::ApiClient::NotionError => e
      { success: false, error: :lookup_failed, message: e.message }
    end

    # Get a single refund request by confirmation number (for status lookup)
    def find_by_confirmation(confirmation_number)
      # Parse the confirmation number (e.g., "RR-0012" -> 12)
      id_number = parse_confirmation_id(confirmation_number)
      return { success: false, error: :invalid_format } unless id_number

      results = @client.query_database(
        database_id: DATABASE_ID,
        filter: {
          property: "Confirmation #",
          unique_id: { equals: id_number }
        }
      )

      return { success: false, error: :not_found } if results.empty?

      request = parse_refund_request(results.first)
      { success: true, request: request }
    rescue Notion::ApiClient::NotionError => e
      { success: false, error: :lookup_failed, message: e.message }
    end

    private

    def validate_params!(params)
      required = %i[email decision]
      missing = required.select { |key| params[key].blank? }
      raise ArgumentError, "Missing required params: #{missing.join(', ')}" if missing.any?
    end

    def build_properties(params)
      properties = {
        # Email field
        "Email" => { email: params[:email].strip.downcase },

        # Decision (Select)
        "Decision" => { select: { name: format_decision(params[:decision]) } },

        # Status (defaults to Submitted)
        "Status" => { status: { name: "Submitted" } },

        # Pass Type (if provided)
        "Pass Type" => params[:pass_type].present? ?
          { select: { name: params[:pass_type] } } : nil,

        # Platform (if provided)
        "Platform" => params[:platform].present? ?
          { select: { name: params[:platform] } } : nil,

        # T-Shirt fields
        "Wants T-Shirt" => { checkbox: params[:wants_shirt] == true },

        # Zelle Contact (if refund expected)
        "Zelle Contact" => params[:zelle_contact].present? ?
          { rich_text: [{ text: { content: params[:zelle_contact] } }] } : nil
      }

      # Add shirt size if ordering a shirt
      if params[:wants_shirt] && params[:shirt_size].present?
        properties["T-Shirt Size"] = { select: { name: params[:shirt_size] } }
      end

      # Add shipping address if provided
      if params[:shipping_address].present?
        properties["Shipping Address"] = {
          rich_text: [{ text: { content: format_shipping_address(params[:shipping_address]) } }]
        }
      end

      # Link to ticket holder if page ID provided
      if params[:ticket_holder_page_id].present?
        properties["Ticket Holder"] = {
          relation: [{ id: params[:ticket_holder_page_id] }]
        }
      end

      # Remove nil values
      properties.compact
    end

    def format_decision(decision)
      case decision.to_s.downcase
      when "full", "full_refund"
        "Full Refund"
      when "partial", "partial_refund"
        "Partial Refund"
      when "waive", "waive_refund"
        "Waive Refund"
      else
        decision.to_s.titleize
      end
    end

    def format_shipping_address(address)
      return address if address.is_a?(String)

      [
        address[:name],
        address[:street],
        "#{address[:city]}, #{address[:state]} #{address[:zip]}"
      ].compact.join("\n")
    end

    def extract_confirmation_number(page)
      unique_id = page.properties["Confirmation #"]
      return nil unless unique_id

      prefix = unique_id.dig("unique_id", "prefix") || "RR"
      number = unique_id.dig("unique_id", "number")

      return nil unless number

      "#{prefix}-#{number.to_s.rjust(4, '0')}"
    end

    def parse_confirmation_id(confirmation_number)
      return nil unless confirmation_number.present?

      # Extract number from format like "RR-0012" or just "12"
      match = confirmation_number.to_s.match(/(\d+)$/)
      match ? match[1].to_i : nil
    end

    def parse_refund_request(page)
      props = page.properties

      {
        id: page.id,
        confirmation_number: extract_confirmation_number(page),
        email: props.dig("Email", "email"),
        status: extract_status(props["Status"]),
        decision: extract_select(props["Decision"]),
        initials: extract_formula(props["Initials"]),
        pass_type: extract_select(props["Pass Type"]),
        platform: extract_select(props["Platform"]),
        wants_shirt: props.dig("Wants T-Shirt", "checkbox") || false,
        shirt_size: extract_select(props["T-Shirt Size"]),
        date_submitted: extract_created_time(props["Date Submitted"]) || page.created_time,
        date_processed: extract_date(props["Date Processed"]),
        refund_amount: extract_number(props["Refund Amount ..."]) || extract_formula_number(props["Amount Owed"])
      }
    end

    def extract_status(prop)
      prop&.dig("status", "name")
    end

    def extract_select(prop)
      prop&.dig("select", "name")
    end

    def extract_number(prop)
      prop&.dig("number")
    end

    def extract_formula_number(prop)
      prop&.dig("formula", "number")
    end

    def extract_formula(prop)
      prop&.dig("formula", "string")
    end

    def extract_date(prop)
      prop&.dig("date", "start")
    end

    def extract_created_time(prop)
      prop&.dig("created_time")
    end
  end
end
