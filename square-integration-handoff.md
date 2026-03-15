# Square Payments — Integration Handoff

> Extracted from NeoKizFest (Rails 8). Use this as a blueprint for any project that needs Square Payment Links — e.g., VidHive lifetime deal checkout.

---

## How It Works (High Level)

```
User fills form → POST /api/donations/checkout
  → Square::CheckoutService creates a Payment Link
  → Frontend redirects user to Square-hosted checkout
  → User pays on Square
  → Square redirects user back to /donation-thank-you?orderId=XYZ
  → DonationProcessor verifies payment, creates DB record, sends emails
  → Square also fires a webhook → /api/webhooks/square (backup path, same dedup logic)
```

Two paths process the same order (thank-you page + webhook). A distributed lock + dedup check ensures only one runs.

---

## Gem

```ruby
# Gemfile
gem "square.rb", "~> 44.0"
```

---

## Credentials

Store in Rails encrypted credentials (`rails credentials:edit`):

```yaml
square:
  access_token: sq0atp-...
  location_id: LXXXXXXXXXXXXXXXXX
  webhook_signature_key: ...
```

- **access_token** — from Square Developer Dashboard → your app → Production Access Token
- **location_id** — from Square Dashboard → Locations (every business has at least one)
- **webhook_signature_key** — from Square Developer Dashboard → Webhooks → your endpoint → Signature key

For VidHive you'll likely want a **separate Square account** (or at minimum a separate app + location) to keep funds and reporting clean.

---

## Service 1: CheckoutService

`app/services/square/checkout_service.rb`

Creates a Square Payment Link and caches the order metadata.

**Key params for `create_checkout`:**

| Param | Type | Notes |
|---|---|---|
| `name` | String | Buyer name (pre-fills Square form) |
| `email` | String | Buyer email (pre-fills Square form) |
| `amount_cents` | Integer | Amount in cents (e.g., `19900` = $199.00) |
| `success_url` | String | Where Square redirects after payment |

**What it does:**
1. Checks cache for an existing active checkout (same email + amount) — prevents duplicate sessions on double-click
2. Calls `client.checkout.payment_links.create` with `quick_pay` (no product catalog needed)
3. Caches order metadata under `sq_order:{order_id}` (24hr TTL) — used on the thank-you page
4. Caches the checkout URL under `active_checkout:{email}:{amount_cents}` (30min TTL)
5. Returns `{ success: true, checkout_url: "https://checkout.square.site/..." }`

**For VidHive:** Change `name:` in `quick_pay` to your product name (e.g., `"VidHive Lifetime Deal"`).

---

## Service 2: OrderVerificationService

`app/services/square/order_verification_service.rb`

Verifies a completed order via the Square Orders API.

```ruby
result = Square::OrderVerificationService.new.verify(order_id)
# => { success: true, status: "COMPLETED", completed: true, amount_cents: 19900, currency: "USD" }
```

**Completion check:** `order.tenders.any? && order.net_amount_due_money.amount == 0`
(means: payment was applied AND nothing left to collect)

---

## Controller: DonationsController

`app/controllers/api/donations_controller.rb`

Route: `POST /api/donations/checkout`

Accepts: `{ name, email, amount }` (amount in dollars, e.g., `"199.00"`)

Validates email + amount, converts to cents, calls `CheckoutService`, returns `{ checkoutUrl }` to redirect the frontend.

---

## Processor: DonationProcessor

`app/services/donation_processor.rb`

Called when the user lands on the thank-you page (`/donation-thank-you?orderId=XYZ`).

**Steps:**
1. **Dedup** — check if order already exists in your DB by `identifier` (Square order_id)
2. **Lock** — acquire a 5-minute distributed lock (`donation_lock:{order_id}`) to prevent race with webhook
3. **Read cache** — fetch `sq_order:{order_id}` for name/email (set during checkout creation)
4. **Verify** — call `OrderVerificationService#verify` — bail if not completed
5. **Write to DB** — create your record (in NeoKizFest this was Notion; for VidHive, use your SQL DB or Stripe-equivalent)
6. **Send emails** — confirmation to buyer, notification to admin

---

## Webhook Handler

`app/controllers/api/webhooks_controller.rb`

Route: `POST /api/webhooks/square`

**Signature verification** (HMAC-SHA256):
```ruby
payload = "#{request.original_url}#{raw_body}"
expected = Base64.strict_encode64(OpenSSL::HMAC.digest("SHA256", signature_key, payload))
ActiveSupport::SecurityUtils.secure_compare(expected, signature)
```

**Events handled:** `payment.created`, `payment.updated` — only processes `status == "COMPLETED"`.

Same dedup + lock logic as `DonationProcessor` — whichever path (thank-you page vs. webhook) arrives first wins.

**Configure in Square Dashboard:** Webhooks → Add endpoint → `https://yourdomain.com/api/webhooks/square` → subscribe to `payment.created` + `payment.updated`.

---

## Cache Keys

| Key | TTL | Contents |
|---|---|---|
| `sq_order:{order_id}` | 24hr | `{ name:, email:, amount: }` |
| `active_checkout:{email}:{amount_cents}` | 30min | checkout URL string |
| `donation_lock:{order_id}` | 5min | `true` (distributed lock) |

---

## Frontend Flow (React/Inertia)

```tsx
// 1. User submits form → POST /api/donations/checkout
const res = await fetch("/api/donations/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, amount })
})
const { checkoutUrl } = await res.json()

// 2. Redirect to Square-hosted checkout
window.location.href = checkoutUrl

// 3. Square redirects back to success_url?orderId=XYZ
// 4. Thank-you page calls backend with orderId to process
```

---

## Square Dashboard Setup Checklist

- [ ] Create Square account (or new app under existing account)
- [ ] Create a Location (required for Payment Links)
- [ ] Generate Production Access Token
- [ ] Add webhook endpoint (`/api/webhooks/square`) + subscribe to `payment.created`, `payment.updated`
- [ ] Copy Webhook Signature Key into credentials
- [ ] Enable "Payment Links" capability on your Square app

---

## VidHive Adaptation Notes

1. **Separate Square account** — recommended to keep funds isolated from NeoKizFest
2. **Product name** — change `"Donation to Neo Kizomba Festival"` to `"VidHive Lifetime Deal"` in `CheckoutService`
3. **Fixed price** — for a lifetime deal, hardcode `amount_cents` rather than accepting it from the form (prevents tampering)
4. **DB record** — swap `Notion::SupporterOrderService` for your own ActiveRecord model (e.g., `Purchase`)
5. **Idempotency** — keep the dedup + lock pattern; it's essential for payment flows
6. **Test mode** — Square has a Sandbox environment; use `::Square::Environment::SANDBOX` + sandbox credentials during development
