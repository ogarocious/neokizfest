# frozen_string_literal: true

module Square
  class OrderVerificationService
    def verify(order_id)
      result = client.orders.get(order_id: order_id)
      order = result.order

      {
        success: true,
        status: order.state,
        completed: order.tenders&.any? && order.net_amount_due_money&.amount.to_i == 0,
        amount_cents: order.total_money&.amount.to_i,
        currency: order.total_money&.currency || "USD"
      }
    rescue ::Square::Errors::ResponseError => e
      Rails.logger.error("[Square::OrderVerificationService] API error: #{e.message}")
      { success: false, error: "api_error", message: e.message }
    rescue StandardError => e
      Rails.logger.error("[Square::OrderVerificationService] Unexpected error: #{e.message}")
      { success: false, error: "server_error", message: e.message }
    end

    private

    def client
      @client ||= ::Square::Client.new(
        base_url: ::Square::Environment::PRODUCTION,
        token: access_token
      )
    end

    def access_token = Rails.application.credentials.dig(:square, :access_token)
  end
end
