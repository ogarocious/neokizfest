# frozen_string_literal: true

# Drafts daily or weekly Sunday Facebook posts for the NeoKizFest refund process.
# Reads live stats from ProgressService and post history from social-posts-log.md,
# then calls the Claude API to generate a paste-ready caption.
#
# Usage (rake):
#   bin/rails post:draft           # auto-detects daily vs. Sunday weekly
#   bin/rails "post:draft[weekly]" # force weekly format
#   bin/rails "post:draft[daily]"  # force daily format
#
# Credentials required:
#   Rails credentials: anthropic_api_key
#
# Zelle status:
#   Update ZELLE_PAUSED / ZELLE_RESUME_DATE below when the payment situation changes.
class PostDraftingService
  # Day 1 of the refund process = Feb 14, 2026 → subtract Feb 13 as the epoch
  LAUNCH_EPOCH = Date.new(2026, 2, 13)

  SOCIAL_LOG_PATH = Rails.root.join("social-posts-log.md")

  # ── Update these when Zelle resumes ──────────────────────────────────────────
  ZELLE_PAUSED = true
  ZELLE_RESUME_DATE = "late March 2026 (~March 22)"
  # ─────────────────────────────────────────────────────────────────────────────

  def initialize(force_type: nil)
    # force_type: :daily, :weekly, or nil (auto-detect from day of week)
    @force_type = force_type&.to_sym
  end

  # Returns { type:, day:, week:, draft:, stats:, donation_stats: } or raises on configuration error
  def draft!
    progress    = Notion::ProgressService.new.fetch
    log_content = File.read(SOCIAL_LOG_PATH)

    day  = day_number
    week = week_number(day)
    type = resolved_post_type

    system_prompt = build_system_prompt
    user_prompt   = build_user_prompt(progress, log_content, type, day, week)

    draft = call_anthropic(system_prompt, user_prompt)

    {
      type:           type,
      day:            day,
      week:           week,
      draft:          draft,
      stats:          progress[:stats],
      donation_stats: progress[:donation_stats]
    }
  end

  private

  def day_number
    (Date.today - LAUNCH_EPOCH).to_i
  end

  def week_number(day)
    ((day - 1) / 7) + 1
  end

  def resolved_post_type
    return @force_type if @force_type
    Date.today.sunday? ? :weekly : :daily
  end

  # ── Prompts ──────────────────────────────────────────────────────────────────

  def build_system_prompt
    zelle_note = if ZELLE_PAUSED
      "PAUSED — Zelle hit its monthly transfer limit. Resumes #{ZELLE_RESUME_DATE}. " \
      "Wise (international) is still active. " \
      "Do NOT imply payments are actively going out or reference specific payment timelines. " \
      "Focus messaging on getting remaining pass holders to file."
    else
      "ACTIVE — payments are going out normally. It is fine to reference that refunds are being paid."
    end

    <<~PROMPT
      You are drafting a Facebook post for Charles Ogarocious (NeoKizombaFest) about the refund process for the cancelled Neo Kizomba Festival.

      ── VOICE (non-negotiable) ──────────────────────────────────────────────────
      Use "I" when referring to Charles's individual labor: reviewing requests, processing payments, sending DMs, doing admin work, making personal commitments.
      Use "we" only for the community collectively: the shared story, what attendees have done together, the journey as a whole.
      NEVER use "we" as a vague authority. If Charles is doing it, say "I."

      ── CONTENT RULES (non-negotiable) ─────────────────────────────────────────
      NEVER mention chargebacks, chargeback counts, or bank disputes by name or count in any form.
      "Progress %" and "Resolved" use the public dashboard formula: (completed + waived + chargebacks) ÷ total_ticket_holders.
      This matches what the progress page shows. Do not call out chargebacks separately — just use the resolved total.
      Stats are provided from the live dashboard — use them exactly as given.

      ── PAYMENT STATUS ─────────────────────────────────────────────────────────
      Zelle: #{zelle_note}

      ── DAILY POST FORMAT ──────────────────────────────────────────────────────
      - Headline: "Day X update — NeoKizFest Refund Process" (short variation fine)
      - One punchy opening line — not "Here's where things stand"
      - Bullet stats using emojis (see EMOJIS section below), with +N deltas vs. the last post
      - One paragraph of genuine reflection — pick the most emotionally resonant number and let it land
      - Word-of-mouth ask: ask people to share with anyone who was at NeoKizFest and hasn't filed yet
      - Brief CTA: neokizfest.com links (Request Refund / Status / progress page)
      - Short closing line, then "neokizfest.com" on its own line

      ── SUNDAY WEEKLY CHECK-IN FORMAT ─────────────────────────────────────────
      - Headline: "Day X — Week Y check-in"
      - One-line opener on the week as a whole
      - Stats showing the 7-day arc in "X → Y" format (not +N deltas), using same emoji bullets
      - Week reflection paragraph — zoom out from day-to-day, tell the community story
      - Word-of-mouth ask
      - CTA
      - "neokizfest.com" on its own line

      ── TONE ───────────────────────────────────────────────────────────────────
      Honest. Transparent. Accountable. Grateful without being performative.
      These posts read like Charles talking directly to his community — no PR polish, no corporate language.
      When something meaningful happens (a milestone waiver count, a threshold crossed), name it directly and let it land. Don't soften it.

      ── EMOJIS ─────────────────────────────────────────────────────────────────
      Use emojis to give the post visual rhythm — not decoration, but punctuation that emphasizes meaning.
      One emoji per bullet point maximum. Do not emoji every paragraph — let the reflection text breathe.

      Stat bullet emojis (use these consistently):
      - ✅  completed refunds
      - 🤲🏾  waived (open hands — fits the "letting go" narrative)
      - ⏳  processing / in queue
      - 📋  total requests filed
      - 💛  donations / donors
      - ⏸️  inline when referencing Zelle being paused

      At the word-of-mouth ask: end the line with 🙏🏾
      At the closing sign-off ("Still going." or equivalent): end with ✊🏾

      Skin tone rule: for ANY hand or person emoji, always use the medium-dark modifier 🏾
      (the tone right before the darkest — e.g., 🤲🏾, 🙏🏾, ✊🏾, not 🤲🏿).

      ── OUTPUT ─────────────────────────────────────────────────────────────────
      Return ONLY the plain-text Facebook caption. No preamble, no notes, no explanation after.
      No markdown formatting (no **, no ##).
      The output must be ready to copy-paste directly into Facebook.
    PROMPT
  end

  def build_user_prompt(progress, log_content, type, day, week)
    s           = progress[:stats] || {}
    d           = progress[:donation_stats] || {}

    completed   = s[:completed].to_i
    waived      = s[:waived].to_i
    chargebacks = s[:chargebacks].to_i
    processing  = s[:processing].to_i
    submitted   = s[:submitted].to_i
    total_req   = s[:total_requests].to_i
    total_hold  = s[:total_ticket_holders].to_i
    donated_amt = d[:total_donated].to_f
    donor_count = d[:donor_count].to_i
    wd_count    = d[:waive_and_donate_count].to_i

    # Match the progress page formula: completed + waived + chargebacks = fully resolved.
    # Chargebacks are resolved obligations (handled by the bank) — they count toward overall
    # progress even though we never call out the chargeback count by name in posts.
    resolved    = completed + waived + chargebacks
    pct         = total_hold > 0 ? ((resolved.to_f / total_hold) * 100).round(1) : 0

    format_label = type == :weekly ? "SUNDAY WEEKLY CHECK-IN" : "DAILY UPDATE"

    <<~PROMPT
      Draft a #{format_label} post for today.

      TODAY: #{Date.today.strftime("%B %d, %Y")} — Day #{day}, Week #{week} of the refund process
      POST TYPE: #{type == :weekly ? "Sunday weekly check-in (7-day arc, X → Y format)" : "Daily update (+N deltas vs. last post)"}

      ── CURRENT LIVE STATS (use these exactly) ─────────────────────────────────
      Total pass holders:          #{total_hold}
      Refund requests filed:       #{total_req}
      Completed refunds:           #{completed}
      Waived:                      #{waived}
      Processing / in queue:       #{processing}
      Submitted (awaiting review): #{submitted}
      Resolved (completed+waived): #{resolved} of #{total_hold} (#{pct}%)
      Donations:                   $#{"%.2f" % donated_amt} from #{donor_count} supporters
      Waived + donated:            #{wd_count}
      Zelle status:                #{ZELLE_PAUSED ? "PAUSED (resumes #{ZELLE_RESUME_DATE})" : "ACTIVE"}

      ── POST HISTORY (use to calculate deltas and match tone) ──────────────────
      #{log_content}

      ── INSTRUCTIONS ───────────────────────────────────────────────────────────
      #{type == :weekly ?
        "Use the snapshot from the previous Sunday's post (7 days ago) as the baseline for the X → Y arc. If no Sunday post exists, use the earliest post in the log as the starting point." :
        "Use the most recent post's snapshot numbers to calculate the +N deltas for this post."
      }

      Write the post now.
    PROMPT
  end

  # ── Claude API call ──────────────────────────────────────────────────────────

  def call_anthropic(system_prompt, user_prompt)
    api_key = Rails.application.credentials.anthropic_api_key
    raise "anthropic_api_key not configured in Rails credentials" if api_key.blank?

    conn = Faraday.new(url: "https://api.anthropic.com") do |f|
      f.request :json
      f.response :json
      f.adapter Faraday.default_adapter
    end

    response = conn.post("/v1/messages") do |req|
      req.headers["x-api-key"]          = api_key
      req.headers["anthropic-version"]  = "2023-06-01"
      req.body = {
        model:      "claude-sonnet-4-6",
        max_tokens: 2048,
        system:     system_prompt,
        messages:   [{ role: "user", content: user_prompt }]
      }
    end

    unless response.status == 200
      raise "Anthropic API error (HTTP #{response.status}): #{response.body}"
    end

    text = response.body.dig("content", 0, "text")
    raise "Unexpected Anthropic response structure: #{response.body.inspect}" if text.nil?

    text
  end
end
