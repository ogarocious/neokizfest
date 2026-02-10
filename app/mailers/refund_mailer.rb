# frozen_string_literal: true

class RefundMailer < ApplicationMailer
  # Sent after a refund request is successfully submitted
  def confirmation_email(email:, confirmation_number:, decision:, name: nil)
    @confirmation_number = confirmation_number
    @decision = decision
    @name = name || "Valued Guest"
    @decision_text = format_decision(decision)
    @waived = %w[waive waive_refund].include?(decision.to_s.downcase)
    @status_url = status_url(confirmation_number)

    subject = if @waived
                "Thank You for Your Generosity - #{confirmation_number}"
              else
                "Your Neo Kizomba Festival Refund Request - #{confirmation_number}"
              end

    mail(to: email, subject: subject)
  end

  # Sent when a refund request status changes (e.g., processing -> completed)
  def status_update_email(email:, confirmation_number:, status:, name: nil, details: {})
    @confirmation_number = confirmation_number
    @status = status
    @name = name || "Valued Guest"
    @status_text = format_status(status)
    @details = details
    @status_url = status_url(confirmation_number)

    subject = case status.to_s.downcase
              when "completed"
                "Your Refund Has Been Processed - #{confirmation_number}"
              when "processing"
                "Your Refund Request is Being Processed - #{confirmation_number}"
              else
                "Update on Your Refund Request - #{confirmation_number}"
              end

    mail(to: email, subject: subject)
  end

  private

  def format_decision(decision)
    case decision.to_s.downcase
    when "full", "full_refund", "full refund"
      "Full Refund"
    when "partial", "partial_refund", "partial refund"
      "Partial Refund"
    when "waive", "waive_refund", "waive refund"
      "Waived (Thank you for your support!)"
    else
      decision.to_s.titleize
    end
  end

  def format_status(status)
    case status.to_s.downcase
    when "submitted"
      "Submitted"
    when "verified"
      "Verified"
    when "processing"
      "Processing"
    when "completed"
      "Completed"
    when "waived"
      "Waived"
    else
      status.to_s.titleize
    end
  end

  def status_url(confirmation_number)
    # Build the status lookup URL with pre-filled confirmation number
    host = Rails.application.config.action_mailer.default_url_options[:host]
    protocol = Rails.application.config.action_mailer.default_url_options[:protocol] || "https"
    "#{protocol}://#{host}/status?ref=#{confirmation_number}"
  end
end
