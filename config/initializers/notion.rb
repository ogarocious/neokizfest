# frozen_string_literal: true

# Configure the Notion API client
# Requires NOTION_API_KEY environment variable

Notion.configure do |config|
  config.token = ENV.fetch("NOTION_API_KEY", nil)
end
