# frozen_string_literal: true

class DonationMailer < ApplicationMailer
  def confirmation_email(email:, name:, amount:, identifier:, waived_refund: false)
    @name = name.presence || "Generous Supporter"
    @amount = amount
    @identifier = identifier
    @waived_refund = waived_refund

    subject = waived_refund ? "You're Incredible — Waived AND Donated!" : "Thank You for Your Donation to Neo Kizomba Festival"
    mail(to: email, cc: AdminMailer::ADMIN_EMAIL, subject: subject)
  end
end
