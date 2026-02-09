# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "Neo Kizomba Festival <refunds@neokizombafestival.com>"
  layout "mailer"
end
