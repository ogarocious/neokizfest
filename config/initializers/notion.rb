# frozen_string_literal: true

# Configure the Notion API client
# Reads from Rails credentials (bin/rails credentials:edit)

Notion.configure do |config|
  config.token = Rails.application.credentials.dig(:notion, :api_key)
end

# Warn about missing credentials on boot
Rails.application.config.after_initialize do
  if Rails.application.credentials.dig(:notion, :api_key).blank?
    Rails.logger.warn("[CREDENTIALS] Notion API key is missing. Notion services will use mock data.")
  end

  if Rails.application.credentials.refund_cache_secret.blank?
    Rails.logger.warn("[CREDENTIALS] refund_cache_secret is missing. Cache-bust and notify-completion endpoints will reject all requests.")
  end

  if Rails.application.credentials.dig(:brevo, :smtp_user).blank?
    Rails.logger.warn("[CREDENTIALS] Brevo SMTP credentials are missing. Emails will not be delivered.")
  end

  if Rails.application.credentials.dig(:notion, :supporter_orders_db_id).blank?
    Rails.logger.warn("[CREDENTIALS] Supporter Orders database ID is missing.")
  end

  if Rails.application.credentials.dig(:lemon_squeezy, :webhook_secret).blank?
    Rails.logger.warn("[CREDENTIALS] Lemon Squeezy webhook secret is missing.")
  end

  if Rails.application.credentials.dig(:lemon_squeezy, :api_key).blank?
    Rails.logger.warn("[CREDENTIALS] Lemon Squeezy API key is missing.")
  end
end
