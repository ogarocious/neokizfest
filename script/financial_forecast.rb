# frozen_string_literal: true
# Financial Forecast — compact summary view with deltas vs. financial-forecast.md
# Run with: bin/rails runner script/financial_forecast.rb

require "set"

TICKET_HOLDERS_DB_ID   = Rails.application.credentials.dig(:notion, :master_ticket_holders_db_id)
REFUND_REQUESTS_DB_ID  = Rails.application.credentials.dig(:notion, :refund_requests_db_id)
SUPPORTER_ORDERS_DB_ID = Rails.application.credentials.dig(:notion, :supporter_orders_db_id)
ZELLE_TRANSFERS_DB_ID  = Rails.application.credentials.dig(:notion, :zelle_transfers_db_id)

TOTAL_COLLECTED = 34_041.33  # gross ticket sales (from Stripe)

# Last snapshot for deltas — update these after each financial-forecast.md update
PREV_SNAPSHOT = {
  label:         "Day 62, Apr 16",
  paid_out:      14_780.34,
  transfers:     90,
  completed:     93,
  waived:        81,
  waived_amt:    9_041.08,
  non_filers:    9,
  pending:       12,
  donors:        38,
  donated:       2_925.00,
  pardon_total:  11_002.35,
}

def fmt(n)
  "$#{format('%.2f', n.round(2)).reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse}"
end

def extract_status(prop)   = prop&.dig("status", "name")
def extract_select(prop)   = prop&.dig("select", "name")
def extract_title(prop)    = Array(prop&.[]("title")).map { |t| t.dig("plain_text") }.join.presence

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

def delta(now, prev, money: false)
  d = now - prev
  return "" if d == 0
  sign = d > 0 ? "+" : ""
  money ? " (#{sign}#{fmt(d)})" : " (#{sign}#{d})"
end

puts "\nFetching data from Notion…"

client    = Notion::ApiClient.new
holders   = client.query_database(database_id: TICKET_HOLDERS_DB_ID)
requests  = client.query_database(database_id: REFUND_REQUESTS_DB_ID)
supporters = client.query_database(database_id: SUPPORTER_ORDERS_DB_ID)
transfers = client.query_database(database_id: ZELLE_TRANSFERS_DB_ID)

puts "  ✓ #{holders.count} ticket holders / #{requests.count} requests / #{transfers.count} transfers\n\n"

# ── Holder maps ───────────────────────────────────────────────────────────────
holder_amount  = {}
chargeback_ids = Set.new
filed_ids      = Set.new

holders.each do |h|
  holder_amount[h.id] = h.properties.dig("Amount Paid", "number").to_f
  chargeback_ids << h.id if chargeback?(h)
end
requests.each { |r| holder_ids_from_relation(r).each { |id| filed_ids << id } }

chargeback_holders = holders.select { |h| chargeback_ids.include?(h.id) }
chargeback_amount  = chargeback_holders.sum { |h| holder_amount[h.id] }
non_filer_holders  = holders.reject { |h| filed_ids.include?(h.id) || chargeback_ids.include?(h.id) }
non_filer_amount   = non_filer_holders.sum { |h| holder_amount[h.id] }

# ── Categorize requests ───────────────────────────────────────────────────────
waived_reqs    = []
completed_reqs = []
pending_reqs   = []

requests.each do |r|
  case extract_status(r.properties["Status"])&.downcase
  when "waived"                              then waived_reqs    << r
  when "completed"                           then completed_reqs << r
  when "submitted", "verified", "processing" then pending_reqs   << r
  end
end

waived_amount = waived_reqs.sum do |r|
  id = holder_ids_from_relation(r).first
  id ? holder_amount[id].to_f : 0.0
end

# ── Partial gaps ──────────────────────────────────────────────────────────────
partial_gap           = 0.0
private_lesson_amount = 0.0
pending_partial_gap   = 0.0
partial_count         = 0
private_lesson_count  = 0

requests.each do |r|
  dec = extract_select(r.properties["Decision"])&.downcase || ""
  next unless dec.include?("partial") || dec.include?("private") || dec.include?("lesson")

  refund_amt = r.properties.dig("Refund Amount Requested", "number").to_f
  id         = holder_ids_from_relation(r).first
  original   = id ? holder_amount[id].to_f : 0.0
  gap        = original > 0.01 ? original - refund_amt : 0.0
  status     = extract_status(r.properties["Status"])&.downcase || ""
  is_lesson  = dec.include?("private") || dec.include?("lesson")

  if is_lesson && status == "completed" && gap > 0.01
    private_lesson_count  += 1
    private_lesson_amount += gap
  elsif !is_lesson && status == "completed" && original > 0.01 && gap > 0.01
    partial_count += 1
    partial_gap   += gap
  elsif status != "completed" && gap > 0.01
    pending_partial_gap += gap
  end
end

# ── Donations ─────────────────────────────────────────────────────────────────
donation_orders = supporters.select { |p| p.properties.dig("Order Type", "select", "name") == "Donation" }
total_donated   = donation_orders.sum { |p| p.properties.dig("Amount Paid", "number").to_f }

# ── Transfers ─────────────────────────────────────────────────────────────────
total_paid_out  = transfers.sum { |t| t.properties.dig("Amount", "number").to_f }
transfer_count  = transfers.count

# ── Pending amount ────────────────────────────────────────────────────────────
pending_amount = pending_reqs.sum do |r|
  amt = r.properties.dig("Refund Amount Requested", "number").to_f
  id  = holder_ids_from_relation(r).first
  amt > 0 ? amt : (id ? holder_amount[id].to_f : 0.0)
end

# ── Totals ────────────────────────────────────────────────────────────────────
total_resolved = completed_reqs.count + waived_reqs.count
pardon_total   = waived_amount + partial_gap + private_lesson_amount
net_owed       = TOTAL_COLLECTED - chargeback_amount - waived_amount - partial_gap - private_lesson_amount - total_paid_out
waive_rate_all = (waived_reqs.count.to_f / requests.count * 100).round(1)
waive_rate_res = (waived_reqs.count.to_f / total_resolved * 100).round(1)
progress_pct   = ((completed_reqs.count + waived_reqs.count + chargeback_holders.count).to_f / holders.count * 100).round(1)
today          = Date.today
launch         = Date.new(2026, 2, 13)
day_num        = (today - launch).to_i

# ── Output ────────────────────────────────────────────────────────────────────
puts "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
puts "  FINANCIAL FORECAST  ·  Day #{day_num}  ·  #{today.strftime('%b %-d, %Y')}"
puts "  (vs. #{PREV_SNAPSHOT[:label]})"
puts "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"

puts "TICKET HOLDERS"
puts "- Total: #{holders.count} | Filed: #{filed_ids.count} | Never filed: #{non_filer_holders.count} (#{fmt(non_filer_amount)})#{delta(non_filer_holders.count, PREV_SNAPSHOT[:non_filers])} | Chargebacks: #{chargeback_holders.count} (#{fmt(chargeback_amount)})"
puts ""

puts "COMMUNITY GOODWILL"
puts "- Waived: #{waived_reqs.count} passes — #{fmt(waived_amount)}#{delta(waived_reqs.count, PREV_SNAPSHOT[:waived])}"
puts "- Partial gaps pardoned: #{partial_count} — #{fmt(partial_gap)}"
puts "- Private lesson settlements: #{private_lesson_count} — #{fmt(private_lesson_amount)}"
puts "- Donations: #{donation_orders.count} donors — #{fmt(total_donated)}#{delta(total_donated, PREV_SNAPSHOT[:donated], money: true)}"
puts "- Pardon total: #{fmt(pardon_total)}#{delta(pardon_total, PREV_SNAPSHOT[:pardon_total], money: true)}"
puts "- Pardon + donations: #{fmt(pardon_total + total_donated)}"
puts "- Waive rate: #{waive_rate_all}% of all filers / #{waive_rate_res}% of resolved"
puts ""

puts "PAYMENT ACCOUNTING"
col_w = 28
puts "-" * 42
puts "#{"Total collected (gross)".ljust(col_w)} #{fmt(TOTAL_COLLECTED).rjust(12)}"
puts "#{"Chargebacks".ljust(col_w)} #{("-" + fmt(chargeback_amount)).rjust(12)}"
puts "#{"Waived".ljust(col_w)} #{("-" + fmt(waived_amount)).rjust(12)}"
puts "#{"Partial gaps".ljust(col_w)} #{("-" + fmt(partial_gap)).rjust(12)}"
puts "#{"Paid out (Zelle/Wise/Check)".ljust(col_w)} #{("-" + fmt(total_paid_out)).rjust(12)}#{delta(total_paid_out, PREV_SNAPSHOT[:paid_out], money: true)}"
puts "-" * 42
puts "#{"Net still owed".ljust(col_w)} #{fmt(net_owed).rjust(12)}"
puts "  └─ Pending filers (#{pending_reqs.count} requests):#{delta(pending_reqs.count, PREV_SNAPSHOT[:pending])} #{fmt(pending_amount)}"
puts "  └─ Non-filer pool (#{non_filer_holders.count} holders): #{fmt(non_filer_amount)}"
puts ""

puts "STATUS"
puts "- Completed: #{completed_reqs.count}#{delta(completed_reqs.count, PREV_SNAPSHOT[:completed])} | Waived: #{waived_reqs.count}#{delta(waived_reqs.count, PREV_SNAPSHOT[:waived])} | Verified: #{pending_reqs.count { |r| extract_status(r.properties["Status"])&.downcase == "verified" }} | Processing: #{pending_reqs.count { |r| extract_status(r.properties["Status"])&.downcase == "processing" }}"
puts "- Total resolved: #{total_resolved}/#{requests.count} | Progress: #{progress_pct}% of all 206 holders"
puts ""

if pending_partial_gap > 0.01
  puts "Pending partial gaps (#{pending_reqs.count { |r| (extract_select(r.properties["Decision"])&.downcase || "").include?("partial") }} verified, if approved): #{fmt(pending_partial_gap)} additional to pardon"
  puts ""
end

puts "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
