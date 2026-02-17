# frozen_string_literal: true

class FlowerMailer < ApplicationMailer
  ADMIN_EMAIL = "charles@neokizomba.com"

  def admin_notification(name:, email:, content_type:, message: nil, media_url: nil)
    @name = name
    @email = email
    @content_type = content_type
    @message = message
    @media_url = media_url

    mail(to: ADMIN_EMAIL, subject: "New Flower Submission from #{@name}")
  end

  def submitter_confirmation(name:, email:)
    @name = name

    mail(to: email, subject: "Your flower has been received!")
  end
end
