# frozen_string_literal: true

module Notion
  # Service for looking up ticket holders from the Master Ticket Holders database
  # Used for email validation in the refund request flow
  class TicketHolderService
    DATABASE_ID = ENV.fetch("NOTION_MASTER_TICKET_HOLDERS_DB_ID", nil)

    def initialize
      @client = Notion::ApiClient.new
    end

    # Validate an email address against the Master Ticket Holders database
    # Returns a hash with validation result and pass holder details
    def validate_email(email)
      return error_response(:invalid_email, "Email is required") if email.blank?

      normalized_email = email.strip.downcase
      ticket_holder = find_by_email(normalized_email)

      return error_response(:not_found, "Email not found in our records") unless ticket_holder

      # Check for chargeback
      if has_chargeback?(ticket_holder)
        return error_response(:chargeback, "This account has a chargeback on file and is not eligible for a refund")
      end

      # Check if already submitted a refund request
      if has_refund_request?(ticket_holder)
        return already_submitted_response(ticket_holder)
      end

      success_response(ticket_holder)
    end

    private

    def find_by_email(email)
      results = @client.query_database(
        database_id: DATABASE_ID,
        filter: {
          property: "Email",
          email: { equals: email }
        }
      )

      return nil if results.empty?

      parse_ticket_holder(results.first)
    end

    def has_chargeback?(ticket_holder)
      ticket_holder[:has_chargeback] == true
    end

    def has_refund_request?(ticket_holder)
      ticket_holder[:has_refund_request] == true
    end

    def parse_ticket_holder(page)
      props = page.properties

      {
        id: page.id,
        email: extract_email(props["Email"]),
        name: extract_title(props["Name"]) || extract_title(props["Ticket Holder"]),
        initials: extract_formula(props["Initials"]),
        pass_type: extract_select(props["Pass Type"]),
        platform: extract_select(props["Platform"]),
        amount_paid: extract_number(props["Amount Paid"]),
        purchase_date: extract_date(props["Purchase Date"]),
        has_chargeback: extract_chargeback_status(props),
        has_refund_request: extract_formula_boolean(props["Has Refund Req..."]) ||
                           extract_relation_exists(props["Refund Request"]),
        existing_confirmation: extract_rollup_text(props["Confirmation #"]),
        existing_status: extract_rollup_text(props["Refund Status"])
      }
    end

    def extract_email(prop)
      prop&.dig("email")
    end

    def extract_title(prop)
      prop&.dig("title", 0, "plain_text")
    end

    def extract_select(prop)
      prop&.dig("select", "name")
    end

    def extract_number(prop)
      prop&.dig("number")
    end

    def extract_date(prop)
      prop&.dig("date", "start")
    end

    def extract_formula(prop)
      prop&.dig("formula", "string")
    end

    def extract_formula_boolean(prop)
      prop&.dig("formula", "boolean")
    end

    def extract_relation_exists(prop)
      relations = prop&.dig("relation")
      relations.present? && relations.any?
    end

    def extract_rollup_text(prop)
      # Rollups can have different result types
      rollup = prop&.dig("rollup")
      return nil unless rollup

      case rollup["type"]
      when "array"
        rollup.dig("array", 0, "title", 0, "plain_text") ||
          rollup.dig("array", 0, "rich_text", 0, "plain_text")
      else
        rollup[rollup["type"]]
      end
    end

    def extract_chargeback_status(props)
      # Check the Chargeback field (could be select or checkbox)
      chargeback_prop = props["Chargeback"]
      return false unless chargeback_prop

      case chargeback_prop["type"]
      when "checkbox"
        chargeback_prop["checkbox"] == true
      when "select"
        name = chargeback_prop.dig("select", "name")
        name.present? && name.downcase != "none" && name.downcase != "no"
      else
        false
      end
    end

    def success_response(ticket_holder)
      {
        success: true,
        pass_holder: {
          email: ticket_holder[:email],
          name: ticket_holder[:name],
          initials: ticket_holder[:initials],
          pass_type: format_pass_type(ticket_holder[:pass_type]),
          platform: ticket_holder[:platform],
          amount_paid: ticket_holder[:amount_paid] || 0,
          purchase_date: ticket_holder[:purchase_date],
          notion_page_id: ticket_holder[:id]
        }
      }
    end

    def already_submitted_response(ticket_holder)
      {
        success: false,
        error: :already_submitted,
        message: "A refund request has already been submitted for this email",
        existing_confirmation: ticket_holder[:existing_confirmation],
        existing_status: ticket_holder[:existing_status]
      }
    end

    def error_response(error_type, message)
      {
        success: false,
        error: error_type,
        message: message
      }
    end

    def format_pass_type(pass_type)
      return nil unless pass_type

      # Normalize pass type to match frontend types
      pass_type.downcase.gsub(/\s+/, "_")
    end
  end
end
