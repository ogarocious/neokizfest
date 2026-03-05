# frozen_string_literal: true

# Appends a new auto-logged entry to social-posts-log.md after each draft is generated.
# Called from Api::PostDraftController's background thread.
class PostLogService
  SOCIAL_LOG_PATH = Rails.root.join("social-posts-log.md")
  LAUNCH_EPOCH    = Date.new(2026, 2, 13)

  def initialize(result)
    @result = result
  end

  def append!
    entry = build_entry
    File.open(SOCIAL_LOG_PATH, "a") { |f| f.write(entry) }
    Rails.logger.info("[PostLogService] Appended Day #{@result[:day]} (Post ##{next_post_number}) to social-posts-log.md")
  rescue => e
    Rails.logger.error("[PostLogService] Failed to append log entry: #{e.message}")
  end

  private

  def build_entry
    s  = @result[:stats] || {}
    d  = @result[:donation_stats] || {}
    day  = @result[:day]
    type = @result[:type]

    completed   = s[:completed].to_i
    waived      = s[:waived].to_i
    chargebacks = s[:chargebacks].to_i
    processing  = s[:processing].to_i
    total_req   = s[:total_requests].to_i
    total_hold  = s[:total_ticket_holders].to_i
    donated_amt = d[:total_donated].to_f
    donor_count = d[:donor_count].to_i
    wd_count    = d[:waive_and_donate_count].to_i

    resolved = completed + waived + chargebacks
    pct      = total_hold > 0 ? ((resolved.to_f / total_hold) * 100).round(1) : 0
    type_label = type == :weekly ? "Sunday weekly check-in" : "Daily update"
    date_str   = Date.today.strftime("%b %-d, %Y")

    <<~ENTRY

      ## Post ##{next_post_number} — #{date_str} (Day #{day})

      **Platform:** Facebook
      **Posted by:** Charles Neokiz Ogarocious
      **Status:** Draft (auto-logged)
      **Type:** #{type_label}

      **Snapshot:**
      - Overall Progress: #{pct}% (#{resolved} of #{total_hold} resolved)
      - Total Requests: #{total_req}
      - Completed: #{completed}
      - Waived: #{waived}
      - Processing: #{processing}
      - Donated: $#{"%.2f" % donated_amt} from #{donor_count} supporters
      - Waived + Donated: #{wd_count}

      **Caption:**

      #{@result[:draft]}

      ---
    ENTRY
  end

  def next_post_number
    @next_post_number ||= begin
      log = File.read(SOCIAL_LOG_PATH)
      numbers = log.scan(/^## Post #(\d+)/).flatten.map(&:to_i)
      numbers.empty? ? 1 : numbers.max + 1
    end
  end
end
