# frozen_string_literal: true

module Notion
  # Sends refund completion/waived notification emails for requests that
  # are resolved but haven't been notified yet. Can be called from:
  #   - Rake task:  bin/rails notifications:send_pending
  #   - Console:    Notion::NotificationService.new.send_pending_completions!
  #   - Endpoint:   POST /api/refunds/send-pending-notifications
  class NotificationService
    DATABASE_ID = Rails.application.credentials.dig(:notion, :refund_requests_db_id)

    def initialize
      @client = Notion::ApiClient.new
      @refund_request_service = Notion::RefundRequestService.new
      @zelle_transfer_service = Notion::ZelleTransferService.new
    end

    # Find all Completed/Waived requests where "Notification Sent" is false,
    # send status update emails, and mark as notified.
    # Returns { sent: [...], errors: [] }
    def send_pending_completions!
      pages = fetch_pending_notifications
      results = { sent: [], errors: [] }

      pages.each do |page|
        request = parse_page(page)
        result = send_notification_for(request)
        results[result[:status]] << result
      end

      results
    end

    # Send (or re-send) notification for a single confirmation number.
    # Does NOT check "Notification Sent" — always sends and marks as sent.
    def send_for_confirmation!(confirmation_number)
      result = @refund_request_service.find_by_confirmation(confirmation_number)

      unless result[:success]
        return { status: :errors, confirmation_number: confirmation_number,
                 message: "Not found" }
      end

      send_notification_for(result[:request])
    end

    private

    def fetch_pending_notifications
      @client.query_database(
        database_id: DATABASE_ID,
        filter: {
          and: [
            { property: "Notification Sent", checkbox: { equals: false } },
            {
              or: [
                { property: "Status", status: { equals: "Completed" } },
                { property: "Status", status: { equals: "Waived" } }
              ]
            }
          ]
        },
        sorts: [{ property: "Confirmation #", direction: "ascending" }]
      )
    end

    def send_notification_for(request)
      confirmation = request[:confirmation_number]
      email = request[:email]

      if email.blank?
        return { status: :errors, confirmation_number: confirmation,
                 message: "No email on record" }
      end

      decision = request[:decision].to_s.downcase
      is_waived = %w[waive waive_refund waive\ refund].include?(decision)
      email_status = is_waived ? "waived" : "completed"

      # Attach Zelle payment proof for non-waived refunds
      payment_proof = nil
      if email_status == "completed"
        payment_proof = @zelle_transfer_service.fetch_payment_proof(request[:id])
      end

      RefundMailer.status_update_email(
        email: email,
        confirmation_number: confirmation,
        status: email_status,
        name: request[:name],
        payment_proof: payment_proof,
        details: {
          decision: request[:decision],
          refund_amount: request[:refund_amount]
        }
      ).deliver_now

      @refund_request_service.mark_notification_sent(request[:id])

      Rails.logger.info("[NotificationService] Sent #{email_status} email to #{email} for #{confirmation}")

      { status: :sent, confirmation_number: confirmation, email: email,
        name: request[:name], email_status: email_status }
    rescue StandardError => e
      Rails.logger.error("[NotificationService] Failed for #{confirmation}: #{e.message}")
      { status: :errors, confirmation_number: confirmation, message: e.message }
    end

    def parse_page(page)
      props = page.properties
      unique_id = props["Confirmation #"]
      prefix = unique_id&.dig("unique_id", "prefix") || "RR"
      number = unique_id&.dig("unique_id", "number")
      confirmation = number ? "#{prefix}-#{number.to_s.rjust(4, '0')}" : nil

      title = Array(props.dig("Name", "title")).map { |t| t.dig("plain_text") }.join
      name = title&.split(" — ")&.first&.strip

      {
        id: page.id,
        confirmation_number: confirmation,
        name: name,
        email: props.dig("Email", "email"),
        status: props.dig("Status", "status", "name"),
        decision: props.dig("Decision", "select", "name"),
        refund_amount: props.dig("Refund Amount Requested", "number") ||
                       props.dig("Amount Owed", "formula", "number")
      }
    end
  end
end
