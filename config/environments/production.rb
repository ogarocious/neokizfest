require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Turn on fragment caching in view templates.
  config.action_controller.perform_caching = true

  # Cache assets for far-future expiry since they are all digest stamped.
  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.year.to_i}" }

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.asset_host = "http://assets.example.com"

  # Assume all access to the app is happening through a SSL-terminating reverse proxy.
  config.assume_ssl = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  config.force_ssl = true

  # Skip http-to-https redirect for the default health check endpoint.
  # config.ssl_options = { redirect: { exclude: ->(request) { request.path == "/up" } } }

  # Log to STDOUT with the current request id as a default log tag.
  config.log_tags = [ :request_id ]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Change to "debug" to log everything (including potentially personally-identifiable information!)
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Prevent health checks from clogging up the logs.
  config.silence_healthcheck_path = "/up"

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Use file-based cache (persists across restarts, no database required)
  config.cache_store = :file_store, Rails.root.join("tmp", "cache")

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Use async job processing (in-process thread pool, no database needed)
  # deliver_later runs in a background thread so users aren't blocked by SMTP
  config.active_job.queue_adapter = :async

  # Enable DNS rebinding protection and other `Host` header attacks.
  config.hosts = [
    "neokizfest.com",
    "www.neokizfest.com"
  ]

  # Skip DNS rebinding protection for the default health check endpoint.
  config.host_authorization = { exclude: ->(request) { request.path == "/up" } }

  # ==================== Action Mailer Configuration (Brevo SMTP) ====================
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: "smtp-relay.brevo.com",
    port: 587,
    user_name: Rails.application.credentials.dig(:brevo, :smtp_user),
    password: Rails.application.credentials.dig(:brevo, :smtp_password),
    authentication: :login,
    enable_starttls_auto: true
  }

  config.action_mailer.perform_caching = false
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.default_url_options = {
    host: Rails.application.credentials.dig(:mailer, :host) || "www.neokizfest.com",
    protocol: "https"
  }
  config.action_mailer.default_options = {
    from: Rails.application.credentials.dig(:mailer, :from) || "Neo Kizomba Festival <charles@neokizomba.com>"
  }
end
