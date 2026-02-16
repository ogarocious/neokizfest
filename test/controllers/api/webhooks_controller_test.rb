# frozen_string_literal: true

require "test_helper"
require "ostruct"

class Api::WebhooksControllerTest < ActionDispatch::IntegrationTest
  WEBHOOK_SECRET = "test-square-webhook-secret"
  TEST_ORDER_ID = "test-order-#{SecureRandom.hex(4)}"

  def valid_payload(overrides = {})
    payment = {
      "id" => "sq_payment_#{SecureRandom.hex(4)}",
      "order_id" => TEST_ORDER_ID,
      "status" => "COMPLETED",
      "amount_money" => { "amount" => 5000, "currency" => "USD" },
      "buyer_email_address" => "jane@example.com",
      "created_at" => "2026-02-10T12:00:00Z",
      "receipt_url" => "https://squareup.com/receipt/test"
    }.merge(overrides)

    {
      "type" => "payment.created",
      "data" => {
        "object" => {
          "payment" => payment
        }
      }
    }
  end

  def sign_payload(body, url)
    payload = "#{url}#{body}"
    Base64.strict_encode64(OpenSSL::HMAC.digest("SHA256", WEBHOOK_SECRET, payload))
  end

  def post_webhook(payload: nil, body: nil, signature: nil)
    raw = body || (payload || valid_payload).to_json
    url = "http://www.example.com/api/webhooks/square"
    sig = signature || sign_payload(raw, url)

    post "/api/webhooks/square",
      params: raw,
      headers: {
        "Content-Type" => "application/json",
        "x-square-hmacsha256-signature" => sig
      }
  end

  def with_square_credentials(&block)
    Rails.application.credentials.stub(:dig, ->(*args) {
      if args == [:square, :webhook_signature_key]
        WEBHOOK_SECRET
      elsif args[0] == :notion
        Rails.application.credentials.public_send(:[], :notion)&.dig(args[1])
      elsif args == [:square, :access_token]
        "test-access-token"
      elsif args == [:square, :location_id]
        "test-location-id"
      else
        nil
      end
    }, &block)
  end

  def mock_service
    @mock_service ||= Minitest::Mock.new
  end

  def with_mock_service(&block)
    Notion::SupporterOrderService.stub(:new, mock_service, &block)
  end

  setup do
    Rails.cache.clear
  end

  # ==================== SIGNATURE VERIFICATION ====================

  test "rejects request with missing signature" do
    with_square_credentials do
      post "/api/webhooks/square",
        params: valid_payload.to_json,
        headers: { "Content-Type" => "application/json" }

      assert_response :unauthorized
    end
  end

  test "rejects request with invalid signature" do
    with_square_credentials do
      post_webhook(signature: "bad-signature")
      assert_response :unauthorized
    end
  end

  # ==================== EVENT FILTERING ====================

  test "ignores non-payment events with 200" do
    payload = valid_payload.merge("type" => "refund.created")

    with_square_credentials do
      post_webhook(payload: payload)
      assert_response :ok
    end
  end

  test "ignores non-completed payments with 200" do
    payload = valid_payload
    payload["data"]["object"]["payment"]["status"] = "PENDING"

    with_square_credentials do
      post_webhook(payload: payload)
      assert_response :ok
    end
  end

  test "skips payment with no order_id" do
    payload = valid_payload
    payload["data"]["object"]["payment"].delete("order_id")

    with_square_credentials do
      post_webhook(payload: payload)
      assert_response :ok
    end
  end

  # ==================== SUCCESSFUL ORDER PROCESSING ====================

  test "processes valid payment.created event" do
    order_id = "order-#{SecureRandom.hex(4)}"
    payload = valid_payload("order_id" => order_id)

    mock_service.expect(:find_by_identifier, nil, [order_id])
    mock_service.expect(:create, { success: true, page_id: "abc-123" }, [Hash])

    with_square_credentials do
      with_mock_service do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    mock_service.verify
  end

  test "parses amount from cents to dollars" do
    order_id = "order-#{SecureRandom.hex(4)}"
    payload = valid_payload("order_id" => order_id, "amount_money" => { "amount" => 7500, "currency" => "USD" })

    captured_params = nil
    service = Object.new
    service.define_singleton_method(:find_by_identifier) { |_id| nil }
    service.define_singleton_method(:create) { |params| captured_params = params; { success: true, page_id: "abc-123" } }

    with_square_credentials do
      Notion::SupporterOrderService.stub(:new, service) do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    assert_equal 75.0, captured_params[:amount_paid]
  end

  test "uses order_id as identifier (not payment id)" do
    order_id = "order-#{SecureRandom.hex(4)}"
    payload = valid_payload("order_id" => order_id)

    captured_params = nil
    service = Object.new
    service.define_singleton_method(:find_by_identifier) { |_id| nil }
    service.define_singleton_method(:create) { |params| captured_params = params; { success: true, page_id: "abc-123" } }

    with_square_credentials do
      Notion::SupporterOrderService.stub(:new, service) do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    assert_equal order_id, captured_params[:identifier]
  end

  test "reads cached donor name from checkout" do
    order_id = "order-#{SecureRandom.hex(4)}"
    Rails.cache.write("sq_order:#{order_id}", { name: "Cached Donor", email: "cached@example.com", amount: 50.0 }, expires_in: 24.hours)
    payload = valid_payload("order_id" => order_id)

    captured_params = nil
    service = Object.new
    service.define_singleton_method(:find_by_identifier) { |_id| nil }
    service.define_singleton_method(:create) { |params| captured_params = params; { success: true, page_id: "abc-123" } }

    with_square_credentials do
      Notion::SupporterOrderService.stub(:new, service) do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    assert_equal "Cached Donor", captured_params[:name]
  end

  # ==================== DEDUP ====================

  test "skips duplicate orders when Notion record exists" do
    order_id = "order-#{SecureRandom.hex(4)}"
    payload = valid_payload("order_id" => order_id)

    mock_service.expect(:find_by_identifier, OpenStruct.new(id: "existing"), [order_id])

    with_square_credentials do
      with_mock_service do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    mock_service.verify
  end

  test "skips processing when Redis lock is already held" do
    order_id = "order-#{SecureRandom.hex(4)}"
    payload = valid_payload("order_id" => order_id)

    # Pre-acquire the lock (simulates DonationProcessor already processing this order)
    Rails.cache.write("donation_lock:#{order_id}", true, expires_in: 5.minutes)

    mock_service.expect(:find_by_identifier, nil, [order_id])
    # No create expectation — should not be called

    with_square_credentials do
      with_mock_service do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    mock_service.verify
  end

  # ==================== ERROR HANDLING ====================

  test "returns 200 on processing error" do
    order_id = "order-#{SecureRandom.hex(4)}"
    payload = valid_payload("order_id" => order_id)

    service = Object.new
    service.define_singleton_method(:find_by_identifier) { |_id| raise StandardError, "Notion is down" }

    with_square_credentials do
      Notion::SupporterOrderService.stub(:new, service) do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end
  end
end
