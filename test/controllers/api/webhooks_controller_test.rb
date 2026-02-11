# frozen_string_literal: true

require "test_helper"
require "ostruct"

class Api::WebhooksControllerTest < ActionDispatch::IntegrationTest
  WEBHOOK_SECRET = "test-ls-webhook-secret"

  def valid_payload(overrides = {})
    {
      meta: { event_name: "order_created" },
      data: {
        attributes: {
          user_name: "Jane Donor",
          user_email: "jane@example.com",
          total: 5000,
          created_at: "2025-02-10T12:00:00Z",
          identifier: "LS-ORDER-#{SecureRandom.hex(4)}",
          status: "paid",
          order_number: 12345,
          first_order_item: { product_name: "Festival Donation" }
        }.merge(overrides)
      }
    }
  end

  def sign_payload(body)
    OpenSSL::HMAC.hexdigest("SHA256", WEBHOOK_SECRET, body)
  end

  def post_webhook(payload: nil, body: nil, signature: nil, event: "order_created")
    raw = body || payload&.to_json || valid_payload.to_json
    sig = signature || sign_payload(raw)

    post "/api/webhooks/lemon-squeezy",
      params: raw,
      headers: {
        "Content-Type" => "application/json",
        "X-Signature" => sig,
        "X-Event-Name" => event
      }
  end

  # Stub credentials to provide a known webhook secret
  def with_ls_credentials(&block)
    credentials_stub = Minitest::Mock.new
    Rails.application.credentials.stub(:dig, ->(first, second = nil) {
      if first == :lemon_squeezy && second == :webhook_secret
        WEBHOOK_SECRET
      elsif first == :notion
        # Delegate to real credentials for Notion keys
        Rails.application.credentials.public_send(:[], :notion)&.dig(second)
      else
        nil
      end
    }) do
      block.call
    end
  end

  # Stub the service to avoid real Notion calls
  def mock_service
    @mock_service ||= Minitest::Mock.new
  end

  def with_mock_service(&block)
    Notion::SupporterOrderService.stub(:new, mock_service, &block)
  end

  # ==================== SIGNATURE VERIFICATION ====================

  test "rejects request with missing signature" do
    with_ls_credentials do
      post "/api/webhooks/lemon-squeezy",
        params: valid_payload.to_json,
        headers: {
          "Content-Type" => "application/json",
          "X-Event-Name" => "order_created"
        }

      assert_response :unauthorized
    end
  end

  test "rejects request with invalid signature" do
    with_ls_credentials do
      post_webhook(signature: "bad-signature")
      assert_response :unauthorized
    end
  end

  test "rejects request when webhook secret is not configured" do
    # Without the credentials stub, dig returns nil for lemon_squeezy
    post_webhook
    assert_response :unauthorized
  end

  # ==================== EVENT FILTERING ====================

  test "ignores non-order_created events with 200" do
    with_ls_credentials do
      post_webhook(event: "subscription_created")
      assert_response :ok
    end
  end

  # ==================== SUCCESSFUL ORDER PROCESSING ====================

  test "processes valid order_created event" do
    payload = valid_payload
    identifier = payload[:data][:attributes][:identifier]

    mock_service.expect(:find_by_identifier, nil, [identifier])
    mock_service.expect(:create, { success: true, page_id: "abc-123" }, [Hash])

    with_ls_credentials do
      with_mock_service do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    mock_service.verify
  end

  test "parses amount from cents to dollars" do
    payload = valid_payload(total: 7500) # $75.00
    identifier = payload[:data][:attributes][:identifier]

    captured_params = nil
    service = Object.new
    service.define_singleton_method(:find_by_identifier) { |_id| nil }
    service.define_singleton_method(:create) { |params| captured_params = params; { success: true, page_id: "abc-123" } }

    with_ls_credentials do
      Notion::SupporterOrderService.stub(:new, service) do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    assert_equal 75.0, captured_params[:amount_paid]
  end

  # ==================== DEDUP ====================

  test "skips duplicate orders gracefully" do
    payload = valid_payload
    identifier = payload[:data][:attributes][:identifier]

    # find_by_identifier returns a truthy value (existing record)
    mock_service.expect(:find_by_identifier, OpenStruct.new(id: "existing"), [identifier])

    with_ls_credentials do
      with_mock_service do
        post_webhook(payload: payload)
        assert_response :ok
      end
    end

    mock_service.verify
  end

  # ==================== ERROR HANDLING ====================

  test "returns 200 on malformed JSON" do
    with_ls_credentials do
      body = "not valid json"
      sig = sign_payload(body)

      post "/api/webhooks/lemon-squeezy",
        params: body,
        headers: {
          "Content-Type" => "application/json",
          "X-Signature" => sig,
          "X-Event-Name" => "order_created"
        }

      assert_response :ok
    end
  end
end
