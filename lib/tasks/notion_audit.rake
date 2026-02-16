# frozen_string_literal: true

namespace :notion do
  desc "Audit all Notion databases and cross-reference refund requests, Zelle transfers, and ticket holders"
  task audit: :environment do
    puts "\n#{'=' * 70}"
    puts "  NOTION DATABASE AUDIT"
    puts "  #{Time.current.strftime('%B %d, %Y at %I:%M %p')}"
    puts "#{'=' * 70}\n\n"

    client = Notion::ApiClient.new

    # ── 1. Fetch all databases ──────────────────────────────────────────
    print "Fetching Refund Requests..."
    refund_requests = client.query_database(
      database_id: Rails.application.credentials.dig(:notion, :refund_requests_db_id),
      sorts: [{ property: "Confirmation #", direction: "ascending" }]
    )
    puts " #{refund_requests.size} records"

    print "Fetching Master Ticket Holders..."
    ticket_holders = client.query_database(
      database_id: Rails.application.credentials.dig(:notion, :master_ticket_holders_db_id)
    )
    puts " #{ticket_holders.size} records"

    print "Fetching Zelle Transfers..."
    zelle_transfers = client.query_database(
      database_id: Rails.application.credentials.dig(:notion, :zelle_transfers_db_id)
    )
    puts " #{zelle_transfers.size} records"

    print "Fetching Supporter Orders..."
    supporter_orders = client.query_database(
      database_id: Rails.application.credentials.dig(:notion, :supporter_orders_db_id)
    )
    puts " #{supporter_orders.size} records"

    # ── 2. Parse Refund Requests ────────────────────────────────────────
    rr_by_page_id = {}
    rr_by_confirmation = {}

    refund_requests.each do |page|
      props = page.properties
      unique_id = props["Confirmation #"]
      prefix = unique_id&.dig("unique_id", "prefix") || "RR"
      number = unique_id&.dig("unique_id", "number")
      confirmation = number ? "#{prefix}-#{number.to_s.rjust(4, '0')}" : "NO-ID"

      title = Array(props.dig("Name", "title")).map { |t| t.dig("plain_text") }.join
      status = props.dig("Status", "status", "name")
      decision = props.dig("Decision", "select", "name")
      email = props.dig("Email", "email")

      # Ticket holder relation
      th_relations = Array(props.dig("Ticket Holder", "relation"))
      th_page_id = th_relations.first&.dig("id")

      entry = {
        page_id: page.id,
        confirmation: confirmation,
        title: title,
        status: status,
        decision: decision,
        email: email,
        ticket_holder_page_id: th_page_id,
        has_zelle_transfer: false
      }

      rr_by_page_id[page.id] = entry
      rr_by_confirmation[confirmation] = entry
    end

    # ── 3. Parse Zelle Transfers ────────────────────────────────────────
    zelle_entries = []
    zelle_linked_rr_ids = Set.new
    zelle_unlinked = []

    zelle_transfers.each do |page|
      props = page.properties
      title = Array(props.dig("Name", "title")).map { |t| t.dig("plain_text") }.join
      amount = props.dig("Amount", "number")
      status = props.dig("Status", "select", "name") || props.dig("Status", "status", "name")

      linked = Array(props.dig("Linked Request", "relation"))
      linked_ids = linked.map { |r| r["id"] }

      has_proof = Array(props.dig("Payment Proof", "files")).any?

      entry = {
        page_id: page.id,
        title: title,
        amount: amount,
        status: status,
        linked_request_ids: linked_ids,
        has_proof: has_proof
      }
      zelle_entries << entry

      if linked_ids.empty?
        zelle_unlinked << entry
      else
        linked_ids.each do |rr_id|
          zelle_linked_rr_ids << rr_id
          rr_by_page_id[rr_id][:has_zelle_transfer] = true if rr_by_page_id[rr_id]
        end
      end
    end

    # ── 4. Parse Ticket Holders ─────────────────────────────────────────
    th_by_page_id = {}
    ticket_holders.each do |page|
      props = page.properties
      name = Array(props.dig("Name", "title")).map { |t| t.dig("plain_text") }.join
      name = Array(props.dig("Ticket Holder", "title")).map { |t| t.dig("plain_text") }.join if name.blank?
      email = props.dig("Email", "email")

      chargeback = case props.dig("Chargeback", "type")
                   when "checkbox" then props.dig("Chargeback", "checkbox") == true
                   when "select"
                     cb_name = props.dig("Chargeback", "select", "name")
                     cb_name.present? && !%w[none no false].include?(cb_name.downcase)
                   else false
                   end

      # Check for Has Refund Request
      has_rr = props.dig("Has Refund Request", "checkbox") == true ||
               props.dig("Has Refund Request", "formula", "boolean") == true

      th_by_page_id[page.id] = {
        page_id: page.id,
        name: name,
        email: email,
        chargeback: chargeback,
        has_refund_request: has_rr
      }
    end

    # ── 5. Cross-reference analysis ─────────────────────────────────────

    # 5a. Refund requests by status
    puts "\n#{'─' * 70}"
    puts "  REFUND REQUESTS BY STATUS"
    puts "#{'─' * 70}"
    status_groups = rr_by_page_id.values.group_by { |r| r[:status] || "nil" }
    status_groups.sort_by { |s, _| s }.each do |status, entries|
      puts "  #{status.ljust(15)} #{entries.size} entries"
    end
    puts "  #{'─' * 30}"
    puts "  TOTAL          #{rr_by_page_id.size} entries"

    # 5b. Zelle Transfers summary
    puts "\n#{'─' * 70}"
    puts "  ZELLE TRANSFERS SUMMARY"
    puts "#{'─' * 70}"
    puts "  Total transfers:     #{zelle_entries.size}"
    puts "  With linked request: #{zelle_entries.count { |z| z[:linked_request_ids].any? }}"
    puts "  WITHOUT linked req:  #{zelle_unlinked.size}"
    puts "  With payment proof:  #{zelle_entries.count { |z| z[:has_proof] }}"

    if zelle_unlinked.any?
      puts "\n  ⚠ UNLINKED ZELLE TRANSFERS (no Linked Request):"
      zelle_unlinked.each do |z|
        amt = z[:amount] ? "$#{z[:amount]}" : "no amount"
        puts "    • #{z[:title].presence || '(untitled)'} — #{amt}"
      end
    end

    # 5c. Zelle transfers linked to non-existent refund requests
    orphaned_zelle = zelle_entries.select do |z|
      z[:linked_request_ids].any? { |id| !rr_by_page_id.key?(id) }
    end

    if orphaned_zelle.any?
      puts "\n  ⚠ ZELLE TRANSFERS LINKED TO UNKNOWN REFUND REQUESTS:"
      orphaned_zelle.each do |z|
        missing_ids = z[:linked_request_ids].reject { |id| rr_by_page_id.key?(id) }
        puts "    • #{z[:title].presence || '(untitled)'} — links to #{missing_ids.size} unknown page(s)"
      end
    end

    # 5d. Completed refund requests without Zelle transfer (expecting payment)
    puts "\n#{'─' * 70}"
    puts "  COMPLETED REFUNDS — PAYMENT STATUS"
    puts "#{'─' * 70}"
    completed = rr_by_page_id.values.select { |r| r[:status]&.downcase == "completed" }
    completed_paid = completed.select { |r| r[:has_zelle_transfer] }
    completed_unpaid = completed.reject { |r| r[:has_zelle_transfer] }

    puts "  Completed total:     #{completed.size}"
    puts "  With Zelle transfer: #{completed_paid.size} ✓"
    puts "  WITHOUT transfer:    #{completed_unpaid.size}"

    if completed_unpaid.any?
      puts "\n  COMPLETED but NO Zelle transfer:"
      completed_unpaid.sort_by { |r| r[:confirmation] }.each do |r|
        puts "    • #{r[:confirmation]}  #{r[:title].truncate(40).ljust(42)} status=#{r[:status]}"
      end
    end

    if completed_paid.any?
      puts "\n  COMPLETED with Zelle transfer (should show Paid badge):"
      completed_paid.sort_by { |r| r[:confirmation] }.each do |r|
        puts "    • #{r[:confirmation]}  #{r[:title].truncate(40).ljust(42)} ✓ Paid"
      end
    end

    # 5e. Non-completed refunds that have Zelle transfers (unexpected)
    paid_but_not_completed = rr_by_page_id.values.select do |r|
      r[:has_zelle_transfer] && r[:status]&.downcase != "completed"
    end

    if paid_but_not_completed.any?
      puts "\n  ⚠ HAVE ZELLE TRANSFER but NOT Completed:"
      paid_but_not_completed.each do |r|
        puts "    • #{r[:confirmation]}  #{r[:title].truncate(40).ljust(42)} status=#{r[:status]}"
      end
    end

    # 5f. Processing/Verified refunds (in progress)
    puts "\n#{'─' * 70}"
    puts "  IN-PROGRESS REFUNDS (Processing/Verified)"
    puts "#{'─' * 70}"
    in_progress = rr_by_page_id.values.select { |r| %w[processing verified].include?(r[:status]&.downcase) }
    in_progress.sort_by { |r| r[:confirmation] }.each do |r|
      paid_flag = r[:has_zelle_transfer] ? " ✓ Paid" : ""
      puts "    • #{r[:confirmation]}  #{r[:title].truncate(40).ljust(42)} #{r[:status]}#{paid_flag}"
    end
    puts "  (none)" if in_progress.empty?

    # 5g. Waived refunds
    puts "\n#{'─' * 70}"
    puts "  WAIVED REFUNDS"
    puts "#{'─' * 70}"
    waived = rr_by_page_id.values.select { |r| r[:status]&.downcase == "waived" }
    waived.sort_by { |r| r[:confirmation] }.each do |r|
      puts "    • #{r[:confirmation]}  #{r[:title].truncate(40)}"
    end
    puts "  Total: #{waived.size}"

    # 5h. Ticket Holders without refund request
    puts "\n#{'─' * 70}"
    puts "  TICKET HOLDER COVERAGE"
    puts "#{'─' * 70}"

    # Build set of ticket holder IDs that are linked from refund requests
    linked_th_ids = rr_by_page_id.values
      .map { |r| r[:ticket_holder_page_id] }
      .compact
      .to_set

    th_with_rr = th_by_page_id.values.select { |th| linked_th_ids.include?(th[:page_id]) }
    th_without_rr = th_by_page_id.values.reject { |th| linked_th_ids.include?(th[:page_id]) }
    th_chargebacks = th_by_page_id.values.select { |th| th[:chargeback] }

    puts "  Total ticket holders:        #{th_by_page_id.size}"
    puts "  Linked to refund request:    #{th_with_rr.size}"
    puts "  NOT linked to any request:   #{th_without_rr.size}"
    puts "  Chargebacks:                 #{th_chargebacks.size}"

    if th_without_rr.any?
      puts "\n  Ticket holders with NO refund request linked:"
      th_without_rr.sort_by { |th| th[:name].to_s }.each do |th|
        cb = th[:chargeback] ? " [CHARGEBACK]" : ""
        puts "    • #{th[:name].to_s.truncate(35).ljust(37)} #{th[:email].to_s.truncate(30)}#{cb}"
      end
    end

    # 5i. Supporter Orders / Donations
    puts "\n#{'─' * 70}"
    puts "  SUPPORTER ORDERS / DONATIONS"
    puts "#{'─' * 70}"
    donations = supporter_orders.select { |p| p.properties.dig("Order Type", "select", "name") == "Donation" }
    other_orders = supporter_orders.reject { |p| p.properties.dig("Order Type", "select", "name") == "Donation" }

    total_donated = donations.sum { |p| p.properties.dig("Amount Paid", "number").to_f }
    waive_donate = donations.count do |p|
      notes = Array(p.properties.dig("Notes", "rich_text")).map { |t| t.dig("plain_text") }.join
      notes.include?("Waived refund")
    end

    puts "  Total orders:          #{supporter_orders.size}"
    puts "  Donations:             #{donations.size}"
    puts "  Other orders:          #{other_orders.size}"
    puts "  Total donated:         $#{total_donated.round(2)}"
    puts "  Waive + donate:        #{waive_donate}"

    # ── 6. Summary & Recommendations ────────────────────────────────────
    puts "\n#{'=' * 70}"
    puts "  FINDINGS & RECOMMENDATIONS"
    puts "#{'=' * 70}"

    findings = []

    if zelle_unlinked.any?
      findings << "#{zelle_unlinked.size} Zelle transfer(s) have NO 'Linked Request' — these won't trigger the Paid badge. Link them to the corresponding refund request in Notion."
    end

    if orphaned_zelle.any?
      findings << "#{orphaned_zelle.size} Zelle transfer(s) link to refund request page(s) that don't exist in the DB. These may be volunteer payments processed outside the refund system."
    end

    if completed_unpaid.any?
      findings << "#{completed_unpaid.size} completed refund(s) have no Zelle transfer linked. If payment was sent, create a Zelle Transfer record and link it."
    end

    if paid_but_not_completed.any?
      findings << "#{paid_but_not_completed.size} refund(s) have a Zelle transfer but status is not 'Completed'. Update their status in Notion if payment is done."
    end

    if findings.empty?
      puts "\n  ✓ Everything looks good! All data is consistent."
    else
      findings.each_with_index do |finding, i|
        puts "\n  #{i + 1}. #{finding}"
      end
    end

    puts "\n  Note: After fixing issues in Notion, bust the progress cache:"
    puts "    POST /progress/refresh with Authorization: Bearer <secret>"
    puts "\n#{'=' * 70}\n\n"
  end
end
