# frozen_string_literal: true

# Configure Cloudinary Ruby SDK for server-side uploads (e.g., Zelle payment proof).
# Client-side (unsigned) uploads use the upload_preset directly in the browser.
cloud_name = Rails.application.credentials.dig(:cloudinary, :cloud_name)

if cloud_name.present?
  Cloudinary.config do |config|
    config.cloud_name = cloud_name
    config.api_key    = Rails.application.credentials.dig(:cloudinary, :api_key)
    config.api_secret = Rails.application.credentials.dig(:cloudinary, :api_secret)
    config.secure     = true
  end
end
