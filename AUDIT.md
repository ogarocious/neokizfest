# End-to-End Audit — Issue Tracker

## Critical (Must fix before production)

| # | Issue | Status |
|---|-------|--------|
| 1 | **Status update emails never sent** — `status_update_email` mailer exists with templates, but nothing triggers it. When a request is marked "Completed" in Notion, the user never gets an email. Need either a scheduled job polling Notion or an admin action to trigger it. | **Done** — Added `POST /api/refunds/notify-completion` endpoint, protected by bearer token. n8n calls it when Notion status changes to Completed. |
| 2 | **Active Job runs inline** — `deliver_later` runs synchronously. User waits for email to send before seeing confirmation. If SMTP is slow, the request hangs. `solid_queue` is disabled and no other job adapter is installed. | **Done** — Switched to `:async` adapter (in-process thread pool). Also increased Puma threads 3→5 and progress cache TTL 5→15 min. |
| 3 | **Lemon Squeezy not wired up** — Support page donation button is disabled with `href="#"` and "Coming Soon". No webhook endpoint exists to receive payment events. | **Done** — Wired up LS embedded checkout overlay on /support page. Pay-what-you-want donation via `neokizfest.lemonsqueezy.com`. LS JS SDK loaded in layout, overlay reinitializes on Inertia navigation. |
| 4 | **SMTP credentials use ENV, not credentials** — Production mailer reads `ENV["BREVO_SMTP_USER"]` instead of `credentials.yml.enc` like Notion keys. | **Done** — Moved SMTP user/password, host, and from address to Rails encrypted credentials. |

## Important (Should fix)

| # | Issue | Status |
|---|-------|--------|
| 5 | **No rate limiting on API endpoints** — `/api/refunds/validate-email` can be used to enumerate valid emails. No protection against spam submissions. | **Done** — Added `rack-attack` gem. Email validation: 5/min/IP, refund submission: 3/hr/IP, status lookup: 10/min/IP. Returns 429 JSON with Retry-After header. |
| 6 | **Ticket holder link not passed from frontend** — The `notionPageId` from email validation is never sent back in the submission, so refund requests aren't linked to their ticket holder record in Notion. | **Done** — Added `notionPageId` to PassHolder type, `ticketHolderPageId` to RefundRequestData, and included it in `getSubmissionData()`. Rails side already handled it. |
| 7 | **Cache is memory-only** — Progress cache resets on every server restart. Fine for dev, but in production you'd lose it on every deploy. | **Done** — Switched production to `:file_store` (tmp/cache/). Persists across restarts and deploys. |
| 8 | **Progress refresh endpoint open if secret is blank** — If `refund_cache_secret` is missing, the endpoint accepts any request. | **Done** — Code already rejects requests when secret is blank (returns 401). Added boot-time warnings for missing Notion, cache secret, and Brevo credentials. |

## Moderate (Nice to have)

| # | Issue | Status |
|---|-------|--------|
| 9 | **No tests** for any of the Notion services or API controllers. | **Done** — Added 12 integration tests for all 4 API endpoints (validate-email, create, status, notify-completion). Uses minitest stub to force mock mode via `ConfigurationError`. All tests pass. |
| 10 | **Partial refund amount not validated** — could be negative or exceed ticket price. | **Done** — Added server-side validation in controller (rejects negative, zero, or amounts exceeding ticket price). Also fixed the amount being silently dropped: now wired end-to-end from controller → Notion "Refund Amount ..." field → confirmation email. 3 new tests added. |
| 11 | **`VITE_USE_MOCK=true` could ship to production** — no safeguard to prevent mock mode in prod. | **Done** — Gated behind `import.meta.env.DEV`: mock mode is now impossible in production builds. Console warning logged if the env var is detected in prod. |
| 12 | **Email send failures swallowed silently** — user doesn't know if their confirmation email failed. | **Done** — `send_confirmation_email` now returns true/false. Response includes `emailSent` flag. Confirmation page shows a warning banner when email fails: "We couldn't send your confirmation email. Please save your confirmation number." |
