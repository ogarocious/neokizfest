# frozen_string_literal: true

module Api
  class RefundRequestsController < ApplicationController
  # Skip CSRF for API endpoints (they use JSON)
  skip_before_action :verify_authenticity_token

  # POST /api/refunds/validate-email
  # Validates email against Master Ticket Holders database
  # Checks for chargebacks and existing refund requests
  def validate_email
    email = params[:email]

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
      send_confirmation_email(params[:email], result[:confirmation_number])

      render json: {
        success: true,
        confirmationNumber: result[:confirmation_number]
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
  # Looks up refund request status by confirmation number and email
  def status
    confirmation_number = params[:confirmationNumber]
    email = params[:email]

    if confirmation_number.blank? || email.blank?
      return render json: {
        success: false,
        error: "validation_error",
        errorMessage: "Confirmation number and email are required"
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
    render json: mock_status_lookup(confirmation_number)
  rescue Notion::ApiClient::NotionError => e
    Rails.logger.error("[RefundRequestsController] Status lookup failed: #{e.message}")
    render json: {
      success: false,
      error: "server_error"
    }, status: :internal_server_error
  end

  private

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

    RefundMailer.confirmation_email(
      email: email,
      confirmation_number: confirmation_number,
      decision: decision
    ).deliver_later

    Rails.logger.info("[RefundRequestsController] Queued confirmation email to #{email} for #{confirmation_number}")
  rescue StandardError => e
    # Don't fail the request if email fails - just log it
    Rails.logger.error("[RefundRequestsController] Failed to send confirmation email: #{e.message}")
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
      confirmationNumber: confirmation_number
    }
  end

  def mock_status_lookup(confirmation_number)
    mock_data = {
      "RR-0001" => {
        success: true,
        request: {
          confirmationNumber: "RR-0001",
          status: "completed",
          decision: "full",
          refundAmount: 250,
          shirtOrdered: false,
          submittedAt: "2024-12-01T10:30:00Z",
          completedAt: "2024-12-05T14:20:00Z"
        }
      },
      "RR-0002" => {
        success: true,
        request: {
          confirmationNumber: "RR-0002",
          status: "processing",
          decision: "partial",
          refundAmount: 150,
          shirtOrdered: true,
          shirtDetails: [{ size: "M", quantity: 1 }],
          submittedAt: "2024-12-03T09:15:00Z"
        }
      }
    }

    mock_data[confirmation_number.upcase] || { success: false, error: "not_found" }
  end
  end
end
