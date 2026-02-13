# frozen_string_literal: true

class AdminMailer < ApplicationMailer
  ADMIN_EMAIL = "charles@neokizomba.com"

  def new_donation(name:, email:, amount:, identifier:)
    @name = name.presence || "Anonymous"
    @email = email
    @amount = amount
    @identifier = identifier

    mail(to: ADMIN_EMAIL, subject: "New Donation: $#{sprintf('%.2f', amount)} from #{@name}")
  end

  def new_refund_request(email:, confirmation_number:, decision:, refund_amount: nil, amount_paid: nil)
    @email = email
    @confirmation_number = confirmation_number
    @decision = decision
    @refund_amount = refund_amount
    @amount_paid = amount_paid

    mail(to: ADMIN_EMAIL, subject: "New Refund Request: #{confirmation_number} (#{decision.to_s.titleize})")
  end

  def refund_waived(email:, confirmation_number:, amount_paid: nil)
    @email = email
    @confirmation_number = confirmation_number
    @amount_paid = amount_paid

    mail(to: ADMIN_EMAIL, subject: "Refund Waived: #{confirmation_number} - $#{sprintf('%.2f', amount_paid.to_f)}")
  end
end
