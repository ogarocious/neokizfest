# frozen_string_literal: true
# Pardon Report — pulls live data from Notion and formats it for Charles's private reference.
# Run with: bin/rails runner script/pardon_report.rb

require "set"

TICKET_HOLDERS_DB_ID  = Rails.application.credentials.dig(:notion, :master_ticket_holders_db_id)
REFUND_REQUESTS_DB_ID = Rails.application.credentials.dig(:notion, :refund_requests_db_id)
SUPPORTER_ORDERS_DB_ID = Rails.application.credentials.dig(:notion, :supporter_orders_db_id)
ZELLE_TRANSFERS_DB_ID  = Rails.application.credentials.dig(:notion, :zelle_transfers_db_id)

TOTAL_COLLECTED = 33_599.65  # gross ticket sales (from Stripe); reduced by $441.68 in Stripe refunds (Sheila Wang $112.42 + Sarah Litty $112.42 + Joe Greene $104.42 + Anna Baumann $112.42 — Apr 23, 2026)

def fmt(n)
  "$#{format('%.2f', n.round(2)).reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse}"
end

def extract_number(prop, key = "number")
  prop&.dig(key).to_f
end

def extract_select(prop)
  prop&.dig("select", "name")
end

def extract_status(prop)
  prop&.dig("status", "name")
end

def extract_title(prop)
  Array(prop&.[]("title")).map { |t| t.dig("plain_text") }.join.presence
end

def extract_rich_text(prop)
  Array(prop&.[]("rich_text")).map { |t| t.dig("plain_text") }.join.presence
end

def chargeback?(page)
  prop = page.properties["Chargeback"]
  return false unless prop
  case prop["type"]
  when "checkbox" then prop["checkbox"] == true
  when "select"
    name = prop.dig("select", "name")
    name.present? && !%w[none no false].include?(name.downcase)
  else false
  end
end

def holder_ids_from_relation(req)
  Array(req.properties.dig("Ticket Holder", "relation")).map { |r| r["id"] }
end

puts "\nFetching data from Notion…"

client = Notion::ApiClient.new

holders   = client.query_database(database_id: TICKET_HOLDERS_DB_ID)
requests  = client.query_database(database_id: REFUND_REQUESTS_DB_ID)
supporters = client.query_database(database_id: SUPPORTER_ORDERS_DB_ID)
transfers = client.query_database(database_id: ZELLE_TRANSFERS_DB_ID)

puts "  ✓ #{holders.count} ticket holders"
puts "  ✓ #{requests.count} refund requests"
puts "  ✓ #{supporters.count} supporter orders"
puts "  ✓ #{transfers.count} Zelle transfers\n\n"

# ── Holder lookup maps ─────────────────────────────────────────────────────────
holder_amount  = {}
holder_name    = {}
chargeback_ids = Set.new

holders.each do |h|
  holder_amount[h.id] = h.properties.dig("Amount Paid", "number").to_f
  holder_name[h.id]   = extract_title(h.properties["Name"])
  chargeback_ids << h.id if chargeback?(h)
end

# ── Filed holder IDs ───────────────────────────────────────────────────────────
filed_ids = Set.new
requests.each { |r| holder_ids_from_relation(r).each { |id| filed_ids << id } }

# ── Ticket holder breakdown ────────────────────────────────────────────────────
chargeback_holders = holders.select { |h| chargeback_ids.include?(h.id) }
chargeback_amount  = chargeback_holders.sum { |h| holder_amount[h.id].to_f }

non_filer_holders = holders.reject { |h| filed_ids.include?(h.id) || chargeback_ids.include?(h.id) }
non_filer_amount  = non_filer_holders.sum { |h| holder_amount[h.id].to_f }

# ── Categorise refund requests ─────────────────────────────────────────────────
waived_reqs    = []
completed_reqs = []
pending_reqs   = []   # submitted / verified / processing

requests.each do |r|
  status = extract_status(r.properties["Status"])&.downcase
  case status
  when "waived"    then waived_reqs    << r
  when "completed" then completed_reqs << r
  when "submitted", "verified", "processing" then pending_reqs << r
  end
end

# ── Waived amounts (use ticket holder Amount Paid, not Refund Amount Requested) ─
waived_amount = waived_reqs.sum do |r|
  id = holder_ids_from_relation(r).first
  id ? holder_amount[id].to_f : 0.0
end

pure_waived_count  = waived_reqs.count
pure_waived_amount = waived_amount

# ── Partial refund surpluses and private lesson settlements ─────────────────────
# Pardoned gap = completed partials only. Pending gap = everything else.
# Private lessons: Decision = "Private Lesson" → separate line item.
# Build a per-record breakdown table for ALL Decision = "Partial Refund" requests.
partial_count         = 0
partial_gap           = 0.0
private_lesson_count  = 0
private_lesson_amount = 0.0
pending_partial_gap   = 0.0
partial_rows          = []  # for the per-record breakdown table

all_partial_and_lesson_reqs = requests.select do |r|
  dec = extract_select(r.properties["Decision"])&.downcase || ""
  dec.include?("partial") || dec.include?("private") || dec.include?("lesson")
end

all_partial_and_lesson_reqs.each do |r|
  refund_amt = r.properties.dig("Refund Amount Requested", "number").to_f
  id         = holder_ids_from_relation(r).first
  original   = id ? holder_amount[id].to_f : 0.0
  gap        = original > 0.01 ? original - refund_amt : 0.0
  decision   = extract_select(r.properties["Decision"]) || ""
  status     = extract_status(r.properties["Status"]) || ""
  conf       = r.properties.dig("Confirmation #", "unique_id")
  conf_str   = conf ? "RR-#{conf["number"].to_s.rjust(4, '0')}" : "—"
  name       = extract_title(r.properties["Name"])

  is_private_lesson = decision.downcase.include?("private") || decision.downcase.include?("lesson")

  partial_rows << {
    conf: conf_str, status: status, original: original,
    requested: refund_amt, gap: gap, name: name, private_lesson: is_private_lesson
  }

  if is_private_lesson
    if status.downcase == "completed" && gap > 0.01
      private_lesson_count  += 1
      private_lesson_amount += gap
    end
  elsif status.downcase == "completed"
    if original > 0.01 && gap > 0.01
      partial_count += 1
      partial_gap   += gap
    end
  else
    pending_partial_gap += gap if gap > 0.01
  end
end

# Sort: completed first, then by conf number
partial_rows.sort_by! { |r| [r[:status].downcase == "completed" ? 0 : 1, r[:conf]] }

# ── Donations ──────────────────────────────────────────────────────────────────
donation_orders = supporters.select do |p|
  p.properties.dig("Order Type", "select", "name") == "Donation"
end
total_donated = donation_orders.sum { |p| p.properties.dig("Amount Paid", "number").to_f }

# ── Paid out (Zelle transfers sum) ────────────────────────────────────────────
total_paid_out = transfers.sum { |t| t.properties.dig("Amount", "number").to_f }

# ── Pending filer amount ───────────────────────────────────────────────────────
pending_amount = pending_reqs.sum do |r|
  refund_amt = r.properties.dig("Refund Amount Requested", "number").to_f
  id = holder_ids_from_relation(r).first
  if refund_amt > 0
    refund_amt
  elsif id
    holder_amount[id].to_f
  else
    0.0
  end
end

# ── Totals ─────────────────────────────────────────────────────────────────────
total_requests  = requests.count
total_resolved  = completed_reqs.count + waived_reqs.count
pardon_total = waived_amount + partial_gap + private_lesson_amount

pardon_plus_donations = pardon_total + total_donated

waive_rate_all      = total_requests > 0 ? (waived_reqs.count.to_f / total_requests * 100).round(1) : 0
waive_rate_resolved = total_resolved > 0 ? (waived_reqs.count.to_f / total_resolved * 100).round(1) : 0

net_still_owed = TOTAL_COLLECTED - chargeback_amount - waived_amount - partial_gap - private_lesson_amount - total_paid_out

# ── Report ─────────────────────────────────────────────────────────────────────
puts "─── TICKET HOLDER BREAKDOWN ───────────────────────────"
puts "Total ticket holders:  #{holders.count}"
puts "Filed a request:       #{filed_ids.count}"
puts "Never filed (pool):    #{non_filer_holders.count} — #{fmt(non_filer_amount)}"
puts "Chargebacks:           #{chargeback_holders.count} — #{fmt(chargeback_amount)} (already clawed back by Stripe)"
puts ""
puts "─── COMMUNITY GOODWILL ────────────────────────────────"
puts "Waived: #{pure_waived_count} passes — #{fmt(pure_waived_amount)}"
puts "Partial refunds: #{partial_count} — #{fmt(partial_gap)} gap (pardoned portion)"
puts "Private lesson settlements: #{private_lesson_count} — #{fmt(private_lesson_amount)} (fully forgiven)"
puts "Donations: #{donation_orders.count} donors — #{fmt(total_donated)}"
puts ""
puts "Pardon total (waivers + partials + private lessons): #{fmt(pardon_total)}"
puts "Pardon + donations: #{fmt(pardon_plus_donations)}"
puts ""
puts "Waive rate — of all filers (#{waived_reqs.count}/#{total_requests}): #{waive_rate_all}%"
puts "Waive rate — of resolved only (#{waived_reqs.count}/#{total_resolved}): #{waive_rate_resolved}%"
puts ""
puts "─── PAYMENT ACCOUNTING ────────────────────────────────"
puts "Total collected (gross):               #{fmt(TOTAL_COLLECTED)}"
puts "Chargebacks (excluded):               -#{fmt(chargeback_amount)}"
puts "Waived (forgiven):                    -#{fmt(waived_amount)}"
puts "Partial gaps (forgiven):              -#{fmt(partial_gap)}"
puts "Already paid out (Zelle):             -#{fmt(total_paid_out)}"
puts "                                       ────────────────"
puts "Net still owed:                        #{fmt(net_still_owed)}"
puts "  └─ To open filers (pending):         #{fmt(pending_amount)} (#{pending_reqs.count} requests)"
puts "  └─ Non-filer pool:                   #{fmt(non_filer_amount)} (#{non_filer_holders.count} holders)"
puts ""
puts "─── RATIOS ─────────────────────────────────────────────"
puts "Pardon vs. total collected: #{(pardon_total / TOTAL_COLLECTED * 100).round(1)}%"
puts "Pardon vs. total paid out:  #{total_paid_out > 0 ? "#{(pardon_total / total_paid_out * 100).round(1)}%" : "N/A"}"
puts ""

# ── Partial refund delta breakdown (all statuses, vs. Master Ticket Holders) ────
puts "─── PARTIAL REFUND DELTA (orig paid → requested → gap) ─"
puts "#{"Conf".ljust(10)} #{"Status".ljust(12)} #{"Orig Paid".rjust(10)} #{"Requested".rjust(10)} #{"Gap".rjust(10)}  Note"
puts "-" * 90
partial_rows.each do |r|
  note = r[:private_lesson] ? "private lesson" : ""
  gap_str = r[:gap] > 0.01 ? fmt(r[:gap]) : "—"
  puts "#{r[:conf].ljust(10)} #{r[:status].ljust(12)} #{fmt(r[:original]).rjust(10)} #{fmt(r[:requested]).rjust(10)} #{gap_str.rjust(10)}  #{r[:name]}#{note.present? ? " [#{note}]" : ""}"
end
puts "-" * 90
total_requested_partial = partial_rows.sum { |r| r[:requested] }
total_gap_all           = partial_rows.sum { |r| r[:gap] > 0.01 ? r[:gap] : 0.0 }
puts "#{"TOTAL".ljust(23)} #{fmt(total_requested_partial).rjust(10)} #{fmt(total_gap_all).rjust(10)}"
puts "  Pardoned (completed only): #{fmt(partial_gap + private_lesson_amount)}"
puts "  Pending gap (if all approved): #{fmt(pending_partial_gap)}"
puts ""

# ── Decision value distribution (for debugging/discovery) ─────────────────────
puts "─── DECISION BREAKDOWN (all requests) ─────────────────"
decision_dist = Hash.new(0)
requests.each { |r| decision_dist[extract_select(r.properties["Decision"]) || "(none)"] += 1 }
decision_dist.sort_by { |_, v| -v }.each { |dec, count| puts "  #{dec.ljust(35)} #{count}" }
puts ""

# ── Status distribution ───────────────────────────────────────────────────────
puts "─── STATUS BREAKDOWN ───────────────────────────────────"
status_dist = Hash.new(0)
requests.each { |r| status_dist[extract_status(r.properties["Status"]) || "(none)"] += 1 }
status_dist.sort_by { |_, v| -v }.each { |s, count| puts "  #{s.ljust(35)} #{count}" }
