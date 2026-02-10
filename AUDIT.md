# End-to-End Audit — Issue Tracker

## Critical (Must fix before production)

| # | Issue | Status |
|---|-------|--------|
| 1 | **Status update emails never sent** — `status_update_email` mailer exists with templates, but nothing triggers it. When a request is marked "Completed" in Notion, the user never gets an email. Need either a scheduled job polling Notion or an admin action to trigger it. | Pending |
| 2 | **Active Job runs inline** — `deliver_later` runs synchronously. User waits for email to send before seeing confirmation. If SMTP is slow, the request hangs. `solid_queue` is disabled and no other job adapter is installed. | Pending |
| 3 | **Lemon Squeezy not wired up** — Support page donation button is disabled with `href="#"` and "Coming Soon". No webhook endpoint exists to receive payment events. | Pending |
| 4 | **SMTP credentials use ENV, not credentials** — Production mailer reads `ENV["BREVO_SMTP_USER"]` instead of `credentials.yml.enc` like Notion keys. | Pending |

## Important (Should fix)

| # | Issue | Status |
|---|-------|--------|
| 5 | **No rate limiting on API endpoints** — `/api/refunds/validate-email` can be used to enumerate valid emails. No protection against spam submissions. | Pending |
| 6 | **Ticket holder link not passed from frontend** — The `notionPageId` from email validation is never sent back in the submission, so refund requests aren't linked to their ticket holder record in Notion. | Pending |
| 7 | **Cache is memory-only** — Progress cache resets on every server restart. Fine for dev, but in production you'd lose it on every deploy. | Pending |
| 8 | **Progress refresh endpoint open if secret is blank** — If `refund_cache_secret` is missing, the endpoint accepts any request. | Pending |

## Moderate (Nice to have)

| # | Issue | Status |
|---|-------|--------|
| 9 | **No tests** for any of the Notion services or API controllers. | Pending |
| 10 | **Partial refund amount not validated** — could be negative or exceed ticket price. | Pending |
| 11 | **`VITE_USE_MOCK=true` could ship to production** — no safeguard to prevent mock mode in prod. | Pending |
| 12 | **Email send failures swallowed silently** — user doesn't know if their confirmation email failed. | Pending |
