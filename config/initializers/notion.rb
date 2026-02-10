# frozen_string_literal: true

# Configure the Notion API client
# Reads from Rails credentials (bin/rails credentials:edit)

Notion.configure do |config|
  config.token = Rails.application.credentials.dig(:notion, :api_key)
end
