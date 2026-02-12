# frozen_string_literal: true

module Api
  class DonationsController < ApplicationController
    skip_before_action :verify_authenticity_token

    # POST /api/donations/checkout
    def checkout
      email = normalize_email(params[:email])
      amount = params[:amount].to_f
      name = params[:name].to_s.strip

      if email.blank? || !email.match?(/\A[^@\s]+@[^@\s]+\z/)
        return render json: {
          success: false,
          error: "invalid_email",
          errorMessage: "A valid email address is required."
        }, status: :unprocessable_entity
      end

      if amount <= 0
        return render json: {
          success: false,
          error: "invalid_amount",
          errorMessage: "Donation amount must be greater than zero."
        }, status: :unprocessable_entity
      end

      amount_cents = (amount * 100).round

      success_url = "#{request.base_url}/donation-thank-you"

      result = checkout_service.create_checkout(
        name: name,
        email: email,
        amount_cents: amount_cents,
        success_url: success_url
      )

      if result[:success]
        render json: {
          success: true,
          checkoutUrl: result[:checkout_url]
        }
      else
        render json: {
          success: false,
          error: result[:error],
          errorMessage: result[:message]
        }, status: :unprocessable_entity
      end
    end

    private

    def checkout_service
      @checkout_service ||= Square::CheckoutService.new
    end
  end
end
