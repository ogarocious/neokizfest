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
    Square::CheckoutService.stub(:new, mock_checkout_service, &block)
  end

  setup do
    Rails.cache.clear
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
      checkout_url: "https://square.link/u/abc123"
    }) do |**kwargs|
      kwargs[:name] == "Jane Donor" &&
        kwargs[:email] == "jane@example.com" &&
        kwargs[:amount_cents] == 2500
    end

    with_mock_service do
      post_checkout(name: "Jane Donor", email: "jane@example.com", amount: 25)
      assert_response :ok
    end

    body = JSON.parse(response.body)
    assert_equal true, body["success"]
    assert_equal "https://square.link/u/abc123", body["checkoutUrl"]

    mock_checkout_service.verify
  end

  test "creates checkout without name" do
    mock_checkout_service.expect(:create_checkout, {
      success: true,
      checkout_url: "https://square.link/u/xyz789"
    }) do |**kwargs|
      kwargs[:name] == "" &&
        kwargs[:email] == "anon@example.com" &&
        kwargs[:amount_cents] == 1000
    end

    with_mock_service do
      post_checkout(email: "anon@example.com", amount: 10)
      assert_response :ok
    end

    body = JSON.parse(response.body)
    assert_equal true, body["success"]
    assert body["checkoutUrl"].present?

    mock_checkout_service.verify
  end

  test "passes waived flag when present" do
    mock_checkout_service.expect(:create_checkout, {
      success: true,
      checkout_url: "https://square.link/u/waived123"
    }) do |**kwargs|
      kwargs[:email] == "waiver@example.com" &&
        kwargs[:amount_cents] == 2500 &&
        kwargs[:waived_refund] == true
    end

    with_mock_service do
      post "/api/donations/checkout",
        params: { name: "Waiver", email: "waiver@example.com", amount: 25, waived: true }.to_json,
        headers: { "Content-Type" => "application/json", "Accept" => "application/json" }
      assert_response :ok
    end

    body = JSON.parse(response.body)
    assert_equal true, body["success"]

    mock_checkout_service.verify
  end

  # ==================== SERVICE ERRORS ====================

  test "returns error when checkout service fails" do
    mock_checkout_service.expect(:create_checkout, {
      success: false,
      error: "api_error",
      message: "Payment service returned an error. Please try again."
    }) do |**kwargs|
      kwargs[:email] == "jane@example.com" && kwargs[:amount_cents] == 5000
    end

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
