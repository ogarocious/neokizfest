# frozen_string_literal: true

module LemonSqueezy
  class CheckoutService
    API_BASE = "https://api.lemonsqueezy.com/v1"

    def create_checkout(name:, email:, amount_cents:, success_url: nil)
      uri = URI("#{API_BASE}/checkouts")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true

      request = Net::HTTP::Post.new(uri)
      request["Authorization"] = "Bearer #{api_key}"
      request["Accept"] = "application/vnd.api+json"
      request["Content-Type"] = "application/vnd.api+json"
      request.body = checkout_body(name: name, email: email, amount_cents: amount_cents, success_url: success_url).to_json

      response = http.request(request)

      if response.is_a?(Net::HTTPSuccess)
        data = JSON.parse(response.body)
        checkout_url = data.dig("data", "attributes", "url")

        if checkout_url.present?
          { success: true, checkout_url: checkout_url }
        else
          Rails.logger.error("[CheckoutService] No checkout URL in response: #{response.body}")
          { success: false, error: "checkout_failed", message: "Unable to create checkout session." }
        end
      else
        Rails.logger.error("[CheckoutService] LS API error #{response.code}: #{response.body}")
        { success: false, error: "api_error", message: "Payment service returned an error. Please try again." }
      end
    rescue Net::OpenTimeout, Net::ReadTimeout => e
      Rails.logger.error("[CheckoutService] Timeout: #{e.message}")
      { success: false, error: "timeout", message: "Payment service is temporarily unavailable. Please try again." }
    rescue StandardError => e
      Rails.logger.error("[CheckoutService] Unexpected error: #{e.message}")
      { success: false, error: "server_error", message: "Something went wrong. Please try again." }
    end

    private

    def checkout_body(name:, email:, amount_cents:, success_url: nil)
      attrs = {
        custom_price: amount_cents,
        checkout_data: {
          name: name.presence,
          email: email
        },
        product_options: {
          enabled_variants: [variant_id.to_i]
        }
      }
      attrs[:checkout_options] = { redirect_url: success_url } if success_url.present?

      {
        data: {
          type: "checkouts",
          attributes: attrs,
          relationships: {
            store: {
              data: { type: "stores", id: store_id.to_s }
            },
            variant: {
              data: { type: "variants", id: variant_id.to_s }
            }
          }
        }
      }
    end

    def api_key
      Rails.application.credentials.dig(:lemon_squeezy, :api_key)
    end

    def store_id
      Rails.application.credentials.dig(:lemon_squeezy, :store_id)
    end

    def variant_id
      Rails.application.credentials.dig(:lemon_squeezy, :variant_id)
    end
  end
end
