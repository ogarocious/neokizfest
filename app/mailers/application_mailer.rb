# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "Neo Kizomba Festival <charles@neokizomba.com>"
  layout "mailer"
end
