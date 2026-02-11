# frozen_string_literal: true

class DonationMailer < ApplicationMailer
  def confirmation_email(email:, name:, amount:, identifier:)
    @name = name.presence || "Generous Supporter"
    @amount = amount
    @identifier = identifier

    mail(to: email, subject: "Thank You for Your Donation to Neo Kizomba Festival")
  end
end
