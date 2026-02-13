# frozen_string_literal: true

# Orchestrates donation processing when a donor lands on the thank-you page.
# Handles: dedup check, cache read, Square verification, Notion record, emails.
class DonationProcessor
  def process(order_id)
    return { success: false, error: "missing_order_id" } if order_id.blank?

    # 1. Check dedup — if already processed, return early
    existing = supporter_order_service.find_by_identifier(order_id)
    if existing
      cached = read_cached_details(order_id)
      return {
        success: true,
        already_processed: true,
        name: cached&.dig(:name),
        amount: cached&.dig(:amount)
      }
    end

    # 2. Read cached donation details from checkout
    cached = read_cached_details(order_id)

    # 3. Verify payment completed via Square API
    verification = Square::OrderVerificationService.new.verify(order_id)
    unless verification[:success] && verification[:completed]
      Rails.logger.warn("[DonationProcessor] Order #{order_id} not completed: #{verification.inspect}")
      return { success: false, error: "payment_not_completed" }
    end

    # Determine amount: prefer Square verification, fall back to cache
    amount = (verification[:amount_cents] / 100.0).round(2)
    name = cached&.dig(:name) || "Supporter"
    email = cached&.dig(:email)
    waived_refund = cached&.dig(:waived_refund) == true

    # 4. Create Notion supporter order
    notes = waived_refund ? "Waived refund + donated" : "Processed via thank-you page landing"
    supporter_order_service.create(
      name: name,
      email: email,
      amount_paid: amount,
      date_received: Time.current.iso8601,
      identifier: order_id,
      status: "Payment Received",
      notes: notes
    )

    # 5. Send emails (with waived context for special language)
    if email.present?
      send_donation_confirmation(name: name, email: email, amount: amount, identifier: order_id, waived_refund: waived_refund)
    end
    send_admin_notification(name: name, email: email, amount: amount, identifier: order_id, waived_refund: waived_refund)

    {
      success: true,
      already_processed: false,
      name: name,
      amount: amount
    }
  rescue StandardError => e
    Rails.logger.error("[DonationProcessor] Failed to process order #{order_id}: #{e.message}")
    { success: false, error: "processing_failed", message: e.message }
  end

  private

  def read_cached_details(order_id)
    cached = Rails.cache.read("sq_order:#{order_id}")
    return cached if cached.is_a?(Hash)
    # Backward compat: old cache stored just the name string
    cached.present? ? { name: cached } : nil
  end

  def send_donation_confirmation(email:, name:, amount:, identifier:, waived_refund: false)
    DonationMailer.confirmation_email(
      email: email,
      name: name,
      amount: amount,
      identifier: identifier,
      waived_refund: waived_refund
    ).deliver_later
  rescue StandardError => e
    Rails.logger.error("[DonationProcessor] Donation email failed: #{e.message}")
  end

  def send_admin_notification(name:, email:, amount:, identifier:, waived_refund: false)
    AdminMailer.new_donation(
      name: name,
      email: email || "unknown",
      amount: amount,
      identifier: identifier,
      waived_refund: waived_refund
    ).deliver_later
  rescue StandardError => e
    Rails.logger.error("[DonationProcessor] Admin notification failed: #{e.message}")
  end

  def supporter_order_service
    @supporter_order_service ||= Notion::SupporterOrderService.new
  end
end
