# frozen_string_literal: true

require "test_helper"

class Api::RefundRequestsControllerTest < ActionDispatch::IntegrationTest
  # Force mock mode by making Notion API unavailable.
  # The controller rescues ConfigurationError and returns mock data.
  private def with_mock_notion(&block)
    raiser = ->(*) { raise Notion::ApiClient::ConfigurationError, "Test: Notion not configured" }
    Notion::ApiClient.stub(:new, raiser, &block)
  end

  # ==================== VALIDATE EMAIL ====================

  test "validate email returns pass holder for known email" do
    with_mock_notion do
      post "/api/refunds/validate-email",
        params: { email: "john@example.com" },
        as: :json

      assert_response :success
      json = JSON.parse(response.body)
      assert json["success"]
      assert_equal "John Smith", json["passHolder"]["name"]
      assert_equal "full_pass", json["passHolder"]["passType"]
      assert_equal 250, json["passHolder"]["amountPaid"]
    end
  end

  test "validate email returns not found for unknown email" do
    with_mock_notion do
      post "/api/refunds/validate-email",
        params: { email: "nobody@example.com" },
        as: :json

      assert_response :success
      json = JSON.parse(response.body)
      assert_not json["success"]
      assert_equal "not_found", json["error"]
    end
  end

  test "validate email returns chargeback error" do
    with_mock_notion do
      post "/api/refunds/validate-email",
        params: { email: "chargeback@example.com" },
        as: :json

      assert_response :success
      json = JSON.parse(response.body)
      assert_not json["success"]
      assert_equal "chargeback", json["error"]
    end
  end

  test "validate email rejects blank email" do
    post "/api/refunds/validate-email",
      params: { email: "" },
      as: :json

    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_not json["success"]
    assert_equal "invalid_email", json["error"]
  end

  # ==================== CREATE REFUND ====================

  test "create refund returns confirmation number" do
    with_mock_notion do
      post "/api/refunds",
        params: {
          email: "john@example.com",
          decision: "full",
          passType: "full_pass"
        },
        as: :json

      assert_response :created
      json = JSON.parse(response.body)
      assert json["success"]
      assert_match(/^RR-\d{4}$/, json["confirmationNumber"])
    end
  end

  test "create partial refund rejects negative amount" do
    with_mock_notion do
      post "/api/refunds",
        params: {
          email: "john@example.com",
          decision: "partial",
          passType: "full_pass",
          refundAmount: -50,
          amountPaid: 250
        },
        as: :json

      assert_response :unprocessable_entity
      json = JSON.parse(response.body)
      assert_equal "validation_error", json["error"]
      assert_match(/greater than zero/, json["errorMessage"])
    end
  end

  test "create partial refund rejects amount exceeding ticket price" do
    with_mock_notion do
      post "/api/refunds",
        params: {
          email: "john@example.com",
          decision: "partial",
          passType: "full_pass",
          refundAmount: 500,
          amountPaid: 250
        },
        as: :json

      assert_response :unprocessable_entity
      json = JSON.parse(response.body)
      assert_equal "validation_error", json["error"]
      assert_match(/cannot exceed/, json["errorMessage"])
    end
  end

  test "create partial refund rejects missing amount" do
    with_mock_notion do
      post "/api/refunds",
        params: {
          email: "john@example.com",
          decision: "partial",
          passType: "full_pass"
        },
        as: :json

      assert_response :unprocessable_entity
      json = JSON.parse(response.body)
      assert_equal "validation_error", json["error"]
      assert_match(/required for partial/, json["errorMessage"])
    end
  end

  # ==================== STATUS LOOKUP ====================

  test "status lookup returns result for valid email and confirmation" do
    with_mock_notion do
      post "/api/refunds/status",
        params: {
          email: "john@example.com",
          confirmationNumber: "RR-0001"
        },
        as: :json

      assert_response :success
      json = JSON.parse(response.body)
      assert json["success"]
      assert_equal "RR-0001", json["request"]["confirmationNumber"]
      assert_equal "completed", json["request"]["status"]
      assert_equal "full", json["request"]["decision"]
    end
  end

  test "status lookup returns not found for wrong confirmation number" do
    with_mock_notion do
      post "/api/refunds/status",
        params: {
          email: "john@example.com",
          confirmationNumber: "RR-9999"
        },
        as: :json

      assert_response :success
      json = JSON.parse(response.body)
      assert_not json["success"]
      assert_equal "not_found", json["error"]
    end
  end

  test "status lookup returns not found for unknown email" do
    with_mock_notion do
      post "/api/refunds/status",
        params: {
          email: "nobody@example.com",
          confirmationNumber: "RR-0001"
        },
        as: :json

      assert_response :success
      json = JSON.parse(response.body)
      assert_not json["success"]
      assert_equal "not_found", json["error"]
    end
  end

  test "status lookup rejects missing fields" do
    post "/api/refunds/status",
      params: { email: "" },
      as: :json

    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert_equal "validation_error", json["error"]
  end

  # ==================== NOTIFY COMPLETION ====================

  test "notify completion rejects request without auth token" do
    post "/api/refunds/notify-completion",
      params: { confirmationNumber: "RR-0001" },
      as: :json

    assert_response :unauthorized
  end

  test "notify completion rejects request with wrong auth token" do
    post "/api/refunds/notify-completion",
      params: { confirmationNumber: "RR-0001" },
      headers: { "Authorization" => "Bearer wrong-token" },
      as: :json

    assert_response :unauthorized
  end

  test "notify completion rejects request without confirmation number" do
    # Use minitest stub to provide a valid token for this test
    Rails.application.credentials.stub(:refund_cache_secret, "test-secret") do
      post "/api/refunds/notify-completion",
        params: {},
        headers: { "Authorization" => "Bearer test-secret" },
        as: :json

      assert_response :unprocessable_entity
      json = JSON.parse(response.body)
      assert_equal "validation_error", json["error"]
    end
  end
end
