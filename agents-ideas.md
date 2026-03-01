# NeoKizFest — Claude Agent Ideas

Potential Claude-powered automations for the refund process and community operations.

---

## ✅ Implemented

### Daily Post Draft Agent
**Service:** `app/services/post_drafting_service.rb`
**Trigger:** n8n scheduled workflow — fires daily at 8am, POSTs to `POST /api/post-draft/generate`
**What it does:** Fetches live stats from Notion, reads `social-posts-log.md` for post history and baseline numbers, then calls Claude Sonnet to draft a paste-ready Facebook caption (daily or Sunday weekly format). Emails the draft with a stats snapshot to charles@neokizomba.com.
**Formats supported:** Daily (weekdays) with +N deltas vs. last post; Sunday weekly check-in with 7-day X → Y arc.

---

## 💡 Ideas

### Community Message Moderation
**Status:** Not implemented
**What it would do:** Read all pending unapproved community messages from both the Refund Requests and Supporter Orders Notion databases. Run each through Claude to evaluate for spam, harmful content, or off-topic submissions. Auto-approve messages that pass, flag borderline ones with a Notion comment for manual review.
**Time saved:** Manual Notion review of every message submission.
**Trigger:** Rake task or n8n on a schedule (e.g. twice daily).

---

### Refund Request Triage / Auto-Verification
**Status:** Not implemented
**What it would do:** Read all requests with Status = "Submitted." Cross-reference each against the Master Ticket Holders database (name + email match, amount alignment). Auto-promote clean matches to "Verified" status in Notion. Flag anomalies (name mismatch, no ticket holder found) for manual review with a Notion comment explaining the issue.
**Time saved:** The manual verification step between submission and processing.
**Trigger:** Rake task or n8n on a schedule.

---

### No-Filer Outreach Draft
**Status:** Not implemented
**What it would do:** Pull the list of ticket holders with no associated refund request. For each, draft a personalized DM message (Facebook or email) using their name and any context from the Flowers gallery or community data. Output a list of draft messages ready to send.
**Time saved:** Writing individual outreach messages for the ~50+ holders who haven't filed.
**Trigger:** Manual rake task — run when preparing a batch of outreach DMs.

---

### Zelle Resume Notification
**Status:** Not implemented
**What it would do:** Monitor the date against the Zelle resume date (~March 22). When Zelle resumes: send Charles an email summary of the queued requests ready to pay, draft a Facebook post announcing that payments are resuming, and flip `ZELLE_PAUSED` in the post drafting service. Could also be a simple n8n date-based trigger.
**Time saved:** Manual tracking of the resume date and drafting a resume announcement.
**Trigger:** n8n date trigger set to March 22, 2026.

---

### Flowers Gallery Moderation
**Status:** Not implemented
**What it would do:** Read newly submitted Flowers entries (text, image descriptions, audio/video transcripts) and evaluate for appropriateness. Auto-approve clean submissions, flag ones that need review. Similar pattern to community message moderation.
**Time saved:** Manual moderation of every Flowers gallery submission.
**Trigger:** Rake task or n8n webhook on new Flower submission.

---

### Weekly Financial Forecast Updater
**Status:** Not implemented
**What it would do:** Read current Notion stats (completed, waived, processing, total collected, paid out) and update `financial-forecast.md` with fresh numbers. Flag when key thresholds are crossed (e.g., 80% resolved, $10K paid out).
**Time saved:** Manually updating the forecast document with each status check.
**Trigger:** Weekly rake task or Sunday n8n trigger (runs before the weekly check-in post draft).

---

### Refund System Recap Updater
**Status:** Not implemented
**What it would do:** Read current stats from Notion and update the narrative numbers in `refund-system-recap.md` — the community story document intended for the final post when the process is complete. Meant to be run at ~80–100% completion.
**Time saved:** Manually syncing the recap document with live numbers before the final post.
**Trigger:** Manual rake task run once near the end of the process.
