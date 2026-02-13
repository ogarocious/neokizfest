# frozen_string_literal: true

module Api
  class RefundRequestsController < ApplicationController
  # Skip CSRF for API endpoints (they use JSON)
  skip_before_action :verify_authenticity_token

  # POST /api/refunds/validate-email
  # Validates email against Master Ticket Holders database
  # Checks for chargebacks and existing refund requests
  def validate_email
    email = normalize_email(params[:email])

    if email.blank?
      return render json: {
        success: false,
        error: "invalid_email",
        errorMessage: "Email is required"
      }, status: :unprocessable_entity
    end

    result = ticket_holder_service.validate_email(email)

    if result[:success]
      render json: {
        success: true,
        passHolder: format_pass_holder(result[:pass_holder])
      }
    else
      render json: {
        success: false,
        error: result[:error].to_s,
        errorMessage: result[:message],
        existingConfirmation: result[:existing_confirmation],
        existingStatus: result[:existing_status]
      }
    end
  rescue Notion::ApiClient::ConfigurationError => e
    Rails.logger.info("[RefundRequestsController] Notion not configured, using mock data: #{e.message}")
    # Return mock data in development
    render json: mock_validate_email(email)
  rescue Notion::ApiClient::NotionError => e
    Rails.logger.error("[RefundRequestsController] Validation failed: #{e.message}")
    render json: {
      success: false,
      error: "server_error",
      errorMessage: "Unable to validate email. Please try again."
    }, status: :internal_server_error
  end

  # POST /api/refunds
  # Creates a new refund request in Notion
  def create
    result = refund_request_service.create(refund_params)

    if result[:success]
      # Send confirmation email (async in production)
      email_sent = send_confirmation_email(params[:email], result[:confirmation_number])
      send_admin_refund_notification(params[:email], result[:confirmation_number])

      render json: {
        success: true,
        confirmationNumber: result[:confirmation_number],
        emailSent: email_sent
      }, status: :created
    else
      render json: {
        success: false,
        error: result[:error].to_s,
        errorMessage: result[:message] || "Failed to submit request"
      }, status: :unprocessable_entity
    end
  rescue ArgumentError => e
    render json: {
      success: false,
      error: "validation_error",
      errorMessage: e.message
    }, status: :unprocessable_entity
  rescue Notion::ApiClient::ConfigurationError => e
    Rails.logger.info("[RefundRequestsController] Notion not configured, using mock data: #{e.message}")
    # Return mock response in development
    render json: mock_create_request, status: :created
  rescue Notion::ApiClient::NotionError => e
    Rails.logger.error("[RefundRequestsController] Create failed: #{e.message}")
    render json: {
      success: false,
      error: "server_error",
      errorMessage: "Unable to submit your request. Please try again."
    }, status: :internal_server_error
  end

  # POST /api/refunds/status
  # Looks up refund request status by email and confirmation number
  def status
    confirmation_number = params[:confirmationNumber]
    email = params[:email]

    if confirmation_number.blank? || email.blank?
      return render json: {
        success: false,
        error: "validation_error",
        errorMessage: "Email and confirmation number are required"
      }, status: :unprocessable_entity
    end

    result = refund_request_service.find_by_confirmation_and_email(
      confirmation_number: confirmation_number,
      email: email
    )

    if result[:success]
      render json: {
        success: true,
        request: format_status_response(result[:request])
      }
    else
      render json: {
        success: false,
        error: result[:error].to_s
      }
    end
  rescue Notion::ApiClient::ConfigurationError => e
    Rails.logger.info("[RefundRequestsController] Notion not configured, using mock data: #{e.message}")
    # Return mock data in development
    render json: mock_status_lookup(email, confirmation_number)
  rescue Notion::ApiClient::NotionError => e
    Rails.logger.error("[RefundRequestsController] Status lookup failed: #{e.message}")
    render json: {
      success: false,
      error: "server_error"
    }, status: :internal_server_error
  end

  # POST /api/refunds/notify-completion
  # Called by n8n when a refund status is changed to "Completed" in Notion
  # Sends a status update email to the user
  # Protected by bearer token (refund_cache_secret)
  def notify_completion
    unless valid_auth_token?
      return render json: { error: "Unauthorized" }, status: :unauthorized
    end

    confirmation_number = params[:confirmationNumber]

    if confirmation_number.blank?
      return render json: {
        success: false,
        error: "validation_error",
        errorMessage: "Confirmation number is required"
      }, status: :unprocessable_entity
    end

    result = refund_request_service.find_by_confirmation(confirmation_number)

    unless result[:success]
      return render json: {
        success: false,
        error: "not_found",
        errorMessage: "No refund request found for #{confirmation_number}"
      }, status: :not_found
    end

    request = result[:request]
    email = request[:email]

    if email.blank?
      return render json: {
        success: false,
        error: "no_email",
        errorMessage: "No email address on record for #{confirmation_number}"
      }, status: :unprocessable_entity
    end

    RefundMailer.status_update_email(
      email: email,
      confirmation_number: request[:confirmation_number],
      status: "completed",
      details: {
        decision: request[:decision],
        refund_amount: request[:refund_amount]
      }
    ).deliver_later

    # Mark "Notification Sent" checkbox in Notion so n8n doesn't re-trigger
    refund_request_service.mark_notification_sent(request[:id])

    Rails.logger.info("[RefundRequestsController] Queued completion email to #{email} for #{confirmation_number}")

    render json: {
      success: true,
      message: "Completion email sent to #{email} for #{confirmation_number}"
    }
  rescue Notion::ApiClient::ConfigurationError => e
    Rails.logger.info("[RefundRequestsController] Notion not configured: #{e.message}")
    render json: {
      success: true,
      message: "Mock: would send completion email for #{confirmation_number}"
    }
  rescue Notion::ApiClient::NotionError => e
    Rails.logger.error("[RefundRequestsController] Notify completion failed: #{e.message}")
    render json: {
      success: false,
      error: "server_error",
      errorMessage: "Failed to look up refund request"
    }, status: :internal_server_error
  rescue StandardError => e
    Rails.logger.error("[RefundRequestsController] Email send failed: #{e.message}")
    render json: {
      success: false,
      error: "email_failed",
      errorMessage: "Failed to send email: #{e.message}"
    }, status: :internal_server_error
  end

  private

  def valid_auth_token?
    # Prefer dedicated token, fall back to shared secret for backward compatibility
    expected_token = Rails.application.credentials.notify_completion_secret ||
                     Rails.application.credentials.refund_cache_secret
    return false if expected_token.blank?

    auth_header = request.headers["Authorization"]
    return false if auth_header.blank?

    provided_token = auth_header.gsub(/^Bearer\s+/i, "")
    ActiveSupport::SecurityUtils.secure_compare(provided_token, expected_token)
  end

  def ticket_holder_service
    @ticket_holder_service ||= Notion::TicketHolderService.new
  end

  def refund_request_service
    @refund_request_service ||= Notion::RefundRequestService.new
  end

  def refund_params
    {
      email: params[:email],
      decision: params[:decision],
      pass_type: params[:passType],
      platform: params[:platform],
      refund_amount: params[:refundAmount],
      amount_paid: params[:amountPaid],
      wants_shirt: params[:wantsShirt],
      shirt_size: params.dig(:shirts, 0, :size),
      shipping_address: params[:shippingAddress],
      zelle_contact: format_zelle_contact(params[:zelleInfo]),
      ticket_holder_page_id: params[:ticketHolderPageId]
    }
  end

  def format_pass_holder(pass_holder)
    {
      email: pass_holder[:email],
      name: pass_holder[:name],
      passType: pass_holder[:pass_type],
      amountPaid: pass_holder[:amount_paid] || 0,
      purchaseDate: pass_holder[:purchase_date],
      confirmationNumber: pass_holder[:confirmation_number],
      hasChargeback: false,
      notionPageId: pass_holder[:notion_page_id]
    }
  end

  def format_zelle_contact(zelle_info)
    return nil unless zelle_info.present?

    # Prefer email, fall back to phone
    zelle_info[:email].presence || zelle_info[:phone].presence
  end

  def send_confirmation_email(email, confirmation_number)
    decision = params[:decision]
    refund_amount = params[:refundAmount].present? ? params[:refundAmount].to_f : nil
    amount_paid = params[:amountPaid].present? ? params[:amountPaid].to_f : nil

    RefundMailer.confirmation_email(
      email: email,
      confirmation_number: confirmation_number,
      decision: decision,
      refund_amount: refund_amount,
      amount_paid: amount_paid
    ).deliver_later

    Rails.logger.info("[RefundRequestsController] Queued confirmation email to #{email} for #{confirmation_number}")
    true
  rescue StandardError => e
    # Don't fail the request if email fails - log and surface to frontend
    Rails.logger.error("[RefundRequestsController] Failed to send confirmation email: #{e.message}")
    false
  end

  def send_admin_refund_notification(email, confirmation_number)
    decision = params[:decision].to_s
    amount_paid = params[:amountPaid].present? ? params[:amountPaid].to_f : nil
    refund_amount = params[:refundAmount].present? ? params[:refundAmount].to_f : nil

    if %w[waive waive_refund].include?(decision.downcase)
      AdminMailer.refund_waived(
        email: email,
        confirmation_number: confirmation_number,
        amount_paid: amount_paid
      ).deliver_later
    else
      AdminMailer.new_refund_request(
        email: email,
        confirmation_number: confirmation_number,
        decision: decision,
        refund_amount: refund_amount,
        amount_paid: amount_paid
      ).deliver_later
    end
  rescue StandardError => e
    Rails.logger.error("[RefundRequestsController] Admin notification failed: #{e.message}")
  end

  def format_status_response(request)
    {
      confirmationNumber: request[:confirmation_number],
      status: map_status(request[:status]),
      decision: map_decision(request[:decision]),
      refundAmount: request[:refund_amount],
      shirtOrdered: request[:wants_shirt],
      shirtDetails: request[:shirt_size] ? [{ size: request[:shirt_size], quantity: 1 }] : nil,
      submittedAt: request[:date_submitted],
      completedAt: request[:date_processed]
    }.compact
  end

  def map_status(status)
    return "pending" unless status

    case status.downcase
    when "completed" then "completed"
    when "processing", "verified" then "processing"
    when "submitted" then "pending"
    when "waived" then "completed"
    else "pending"
    end
  end

  def map_decision(decision)
    return nil unless decision

    case decision.downcase
    when "full refund", "full" then "full"
    when "partial refund", "partial" then "partial"
    when "waive refund", "waive" then "waive"
    else decision.downcase
    end
  end

  # ==================== MOCK RESPONSES FOR DEVELOPMENT ====================

  def mock_validate_email(email)
    mock_holders = {
      "john@example.com" => {
        success: true,
        passHolder: {
          email: "john@example.com",
          name: "John Smith",
          passType: "full_pass",
          amountPaid: 250,
          purchaseDate: "2024-06-15",
          confirmationNumber: "NKF-2024-001234",
          hasChargeback: false
        }
      },
      "sarah@example.com" => {
        success: true,
        passHolder: {
          email: "sarah@example.com",
          name: "Sarah Johnson",
          passType: "vip_pass",
          amountPaid: 450,
          purchaseDate: "2024-05-20",
          confirmationNumber: "NKF-2024-002345",
          hasChargeback: false
        }
      },
      "chargeback@example.com" => {
        success: false,
        error: "chargeback",
        errorMessage: "This email is associated with a chargeback. Please contact us on Facebook to resolve this."
      }
    }

    normalized = email.downcase.strip
    mock_holders[normalized] || {
      success: false,
      error: "not_found",
      errorMessage: "We couldn't find a ticket purchase associated with this email address."
    }
  end

  def mock_create_request
    confirmation_number = "RR-#{rand(1000..9999).to_s.rjust(4, '0')}"
    {
      success: true,
      confirmationNumber: confirmation_number,
      emailSent: true
    }
  end

  def mock_status_lookup(email, confirmation_number = nil)
    mock_by_email = {
      "john@example.com" => {
        confirmationNumber: "RR-0001",
        status: "completed",
        decision: "full",
        refundAmount: 250,
        shirtOrdered: false,
        submittedAt: "2024-12-01T10:30:00Z",
        completedAt: "2024-12-05T14:20:00Z"
      },
      "sarah@example.com" => {
        confirmationNumber: "RR-0002",
        status: "processing",
        decision: "partial",
        refundAmount: 150,
        shirtOrdered: true,
        shirtDetails: [{ size: "M", quantity: 1 }],
        submittedAt: "2024-12-03T09:15:00Z"
      }
    }

    normalized_email = email.to_s.downcase.strip
    request_data = mock_by_email[normalized_email]

    # If confirmation number provided, verify it matches
    if request_data && confirmation_number.present?
      return { success: false, error: "not_found" } unless request_data[:confirmationNumber].casecmp?(confirmation_number)
    end

    return { success: false, error: "not_found" } unless request_data

    { success: true, request: request_data }
  end
  end
end
