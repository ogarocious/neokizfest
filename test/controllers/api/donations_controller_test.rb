# frozen_string_literal: true

require "test_helper"

class Api::DonationsControllerTest < ActionDispatch::IntegrationTest
  def post_checkout(params = {})
    post "/api/donations/checkout",
      params: params.to_json,
      headers: {
        "Content-Type" => "application/json",
        "Accept" => "application/json"
      }
  end

  def mock_checkout_service
    @mock_checkout_service ||= Minitest::Mock.new
  end

  def with_mock_service(&block)
    LemonSqueezy::CheckoutService.stub(:new, mock_checkout_service, &block)
  end

  # ==================== VALIDATION ====================

  test "rejects missing email" do
    post_checkout(amount: 25)
    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_equal false, body["success"]
    assert_equal "invalid_email", body["error"]
  end

  test "rejects blank email" do
    post_checkout(email: "  ", amount: 25)
    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_equal "invalid_email", body["error"]
  end

  test "rejects invalid email format" do
    post_checkout(email: "not-an-email", amount: 25)
    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_equal "invalid_email", body["error"]
  end

  test "rejects missing amount" do
    post_checkout(email: "donor@example.com")
    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_equal false, body["success"]
    assert_equal "invalid_amount", body["error"]
  end

  test "rejects zero amount" do
    post_checkout(email: "donor@example.com", amount: 0)
    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_equal "invalid_amount", body["error"]
  end

  test "rejects negative amount" do
    post_checkout(email: "donor@example.com", amount: -10)
    assert_response :unprocessable_entity

    body = JSON.parse(response.body)
    assert_equal "invalid_amount", body["error"]
  end

  # ==================== SUCCESSFUL CHECKOUT ====================

  test "creates checkout with valid params" do
    mock_checkout_service.expect(:create_checkout, {
      success: true,
      checkout_url: "https://neokizfest.lemonsqueezy.com/checkout/abc123"
    }, [], name: "Jane Donor", email: "jane@example.com", amount_cents: 2500)

    with_mock_service do
      post_checkout(name: "Jane Donor", email: "jane@example.com", amount: 25)
      assert_response :ok
    end

    body = JSON.parse(response.body)
    assert_equal true, body["success"]
    assert_equal "https://neokizfest.lemonsqueezy.com/checkout/abc123", body["checkoutUrl"]

    mock_checkout_service.verify
  end

  test "creates checkout without name" do
    mock_checkout_service.expect(:create_checkout, {
      success: true,
      checkout_url: "https://neokizfest.lemonsqueezy.com/checkout/xyz789"
    }, [], name: "", email: "anon@example.com", amount_cents: 1000)

    with_mock_service do
      post_checkout(email: "anon@example.com", amount: 10)
      assert_response :ok
    end

    body = JSON.parse(response.body)
    assert_equal true, body["success"]
    assert body["checkoutUrl"].present?

    mock_checkout_service.verify
  end

  # ==================== SERVICE ERRORS ====================

  test "returns error when checkout service fails" do
    mock_checkout_service.expect(:create_checkout, {
      success: false,
      error: "api_error",
      message: "Payment service returned an error. Please try again."
    }, [], name: "Jane Donor", email: "jane@example.com", amount_cents: 5000)

    with_mock_service do
      post_checkout(name: "Jane Donor", email: "jane@example.com", amount: 50)
      assert_response :unprocessable_entity
    end

    body = JSON.parse(response.body)
    assert_equal false, body["success"]
    assert_equal "api_error", body["error"]

    mock_checkout_service.verify
  end
end
