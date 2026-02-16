# frozen_string_literal: true

module Square
  class CheckoutService
    def create_checkout(name:, email:, amount_cents:, success_url: nil, waived_refund: false)
      # Check for existing active checkout with same email + amount to prevent duplicate sessions
      checkout_cache_key = "active_checkout:#{email.to_s.downcase.strip}:#{amount_cents}"
      existing_url = Rails.cache.read(checkout_cache_key)
      if existing_url.present?
        Rails.logger.info("[Square::CheckoutService] Returning existing checkout for #{email}, amount: #{amount_cents}")
        return { success: true, checkout_url: existing_url }
      end

      params = {
        idempotency_key: SecureRandom.uuid,
        quick_pay: {
          name: "Donation to Neo Kizomba Festival",
          price_money: { amount: amount_cents, currency: "USD" },
          location_id: location_id
        },
        pre_populated_data: { buyer_email: email },
        payment_note: "Donation from #{name.presence || 'Supporter'}"
      }
      params[:checkout_options] = { redirect_url: success_url } if success_url.present?

      result = client.checkout.payment_links.create(**params)

      checkout_url = result.payment_link.long_url
      order_id = result.payment_link.order_id
      if order_id
        cache_data = {
          name: name.presence || "Supporter",
          email: email,
          amount: amount_cents / 100.0
        }
        cache_data[:waived_refund] = true if waived_refund
        Rails.cache.write("sq_order:#{order_id}", cache_data, expires_in: 24.hours)
      end

      # Cache this checkout URL so repeat clicks return the same session
      Rails.cache.write(checkout_cache_key, checkout_url, expires_in: 30.minutes)

      { success: true, checkout_url: checkout_url }
    rescue ::Square::Errors::ResponseError => e
      Rails.logger.error("[Square::CheckoutService] API error: #{e.message}")
      { success: false, error: "api_error", message: "Payment service returned an error. Please try again." }
    rescue StandardError => e
      Rails.logger.error("[Square::CheckoutService] Unexpected error: #{e.message}")
      { success: false, error: "server_error", message: "Something went wrong. Please try again." }
    end

    private

    def client
      @client ||= ::Square::Client.new(
        base_url: ::Square::Environment::PRODUCTION,
        token: access_token
      )
    end

    def access_token = Rails.application.credentials.dig(:square, :access_token)
    def location_id  = Rails.application.credentials.dig(:square, :location_id)
  end
end
