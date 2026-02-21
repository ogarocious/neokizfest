# Zelle Payment Process Guide

## Overview
Log an outbound Zelle refund payment, mark the request as Completed, and queue the
notification email for production. All steps run via Rails runner or rake tasks.

---

## IMPORTANT: Never send notification emails locally

**Always skip or undo the email step when running from a dev machine.**
Notification emails must be triggered on production so that:
- The correct SMTP credentials/environment are used
- "Notification Sent" gets checked by the production server (idempotent guard)
- You can review the Notion record before the email goes out

If you accidentally send via `send_pending_completions!` locally:
1. Uncheck "Notification Sent" on the Notion record immediately (see Step 4 below)
2. Run `send_pending_completions!` on **production** when ready

---

## Step 0: Look Up the Person in Notion

Use `Name` title search — works with first name, last name, or any substring.

```bash
bin/rails runner "
client = Notion::ApiClient.new
db_id = Rails.application.credentials.dig(:notion, :refund_requests_db_id)
results = client.query_database(
  database_id: db_id,
  filter: { property: 'Name', title: { contains: 'SEARCH_TERM' } }
)
results.each do |r|
  conf   = r.properties.dig('Confirmation #', 'unique_id', 'number')
  prefix = r.properties.dig('Confirmation #', 'unique_id', 'prefix') || 'RR'
  name   = r.properties.dig('Name', 'title')&.map { |t| t.dig('plain_text') }&.join
  status = r.properties.dig('Status', 'status', 'name')
  amount = r.properties.dig('Refund Amount Requested', 'number')
  zelle  = r.properties.dig('Zelle Contact', 'rich_text')&.map { |t| t.dig('plain_text') }&.join
  rr_num = conf ? \"#{prefix}-#{conf.to_s.rjust(4, '0')}\" : '(no RR#)'
  puts \"#{rr_num} | #{name} | #{status} | $#{amount} | Zelle: #{zelle} | #{r.id}\"
end
"
```

**Notes:**
- `Confirmation #` is a `unique_id` Notion property type — read via `unique_id.number`, NOT `rich_text`
- Filtering the DB by `Confirmation #` does NOT work (Notion rejects text filter on unique_id)
- Always verify the match by cross-checking `amount` and `Zelle Contact` from the payment screenshot

---

## Step 1 (If RR# is known): Use the Rake Task

If you have the RR number, the rake task handles all steps in one command:

```bash
bin/rails "zelle:record[RR-XXXX,AMOUNT,Full Name,ZELLE_CONTACT,ZELLE_CONF_NUM,/path/to/screenshot.png]"
```

Example:
```bash
bin/rails "zelle:record[RR-0093,104.42,Rachel Coffey,(520) 780-1075,4907533199,/Users/ogarocious/Library/Application Support/CleanShot/media/media_xxx/screenshot.png]"
```

**But the rake task sends the email automatically.** If running locally, comment out Step 5
in `lib/tasks/zelle.rake` or run steps manually instead (see below).

---

## Step 1 (If RR# is unknown): Run Steps Manually via Page ID

When the person is found by name but has no RR number yet:

```bash
bin/rails runner "
page_id    = 'PASTE-PAGE-ID-HERE'
image_path = '/path/to/screenshot.png'
amount     = 104.42
recipient  = 'Rachel Coffey'
contact    = '(520) 780-1075'
zelle_conf = '4907533199'
notes      = 'Payment ID: ABC123'   # optional — from payment receipt

# 1. Upload screenshot to Cloudinary
proof_url = Notion::ZelleTransferService.upload_proof_to_cloudinary(image_path)
puts proof_url ? \"Cloudinary: #{proof_url}\" : 'Upload failed'

# 2. Create Zelle Transfer record in Notion
zelle = Notion::ZelleTransferService.new
result = zelle.create_transfer(
  recipient_name:         recipient,
  amount:                 amount,
  zelle_contact:          contact,
  refund_request_page_id: page_id,
  zelle_confirmation:     zelle_conf,
  proof_url:              proof_url,
  notes:                  notes
)
puts result[:success] ? \"Transfer created: #{result[:page_id]}\" : \"FAILED: #{result[:error]}\"

# 3. Mark refund request as Completed
refund = Notion::RefundRequestService.new
refund.mark_completed(page_id)
puts 'Marked Completed'

# 4. DO NOT send email from local — run on production instead
puts 'Done. Run send_pending_completions! on PRODUCTION to send the notification email.'
"
```

---

## Step 2: Send Notification Email (Production Only)

On the production server, run:

```bash
bin/rails notifications:send_pending
```

Or for a single request by RR number:

```bash
bin/rails "notifications:send_one[RR-0093]"
```

Or via Rails console:
```ruby
Notion::NotificationService.new.send_pending_completions!
```

---

## Step 3: Undo an Accidentally Sent Local Email

If you ran `send_pending_completions!` locally and need production to re-send:

```bash
bin/rails runner "
client = Notion::ApiClient.new
client.update_page(
  page_id: 'PASTE-PAGE-ID-HERE',
  properties: { 'Notification Sent' => { checkbox: false } }
)
puts 'Notification Sent unchecked — safe to re-send on production'
"
```

---

## Payment Details to Collect from Screenshot

| Field              | Where it appears on Zelle receipt |
|--------------------|-----------------------------------|
| Amount             | Large dollar figure at top        |
| Recipient name     | "To:" line                        |
| Zelle contact      | Phone or email on "To:" line      |
| Zelle confirmation | "Confirmation #:" field           |
| Payment ID         | "Payment ID:" field (use as note) |
| Date               | "Sent:" field                     |

---

## Common Gotchas

- `Confirmation #` is `unique_id` type in Notion — **cannot** filter DB by it; search by `Name` instead
- After name search, always verify amount + Zelle contact match the screenshot before proceeding
- The rake task (`zelle:record`) sends the email automatically — avoid on local
- `send_pending_completions!` is idempotent: once "Notification Sent" is checked, it won't re-send
- If `mark_completed` is called twice, no harm done — Notion just overwrites the same status
