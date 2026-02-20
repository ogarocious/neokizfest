# frozen_string_literal: true

namespace :zelle do
  desc <<~DESC
    Record a Zelle payment and mark the refund request as Completed.

    Usage:
      bin/rails "zelle:record[RR-0042,120.00,John Smith,john@example.com]"
      bin/rails "zelle:record[RR-0042,120.00,John Smith,john@example.com,ZELLE-REF123]"
      bin/rails "zelle:record[RR-0042,120.00,John Smith,john@example.com,ZELLE-REF123,/path/to/screenshot.png]"

    Arguments (in order):
      1. confirmation_number   — e.g. RR-0042 (required)
      2. amount                — e.g. 120.00 (required)
      3. recipient_name        — e.g. "John Smith" (required)
      4. zelle_contact         — email or phone used for Zelle (required)
      5. zelle_confirmation    — Zelle reference number (optional, use "" to skip)
      6. image_path            — local path to payment screenshot (optional)

    Steps performed:
      1. Look up refund request by confirmation number
      2. Upload screenshot to Cloudinary (if image_path provided)
      3. Create Zelle Transfer record in Notion
      4. Mark refund request as Completed + set Date Processed = today
      5. Send notification email to the recipient
  DESC
  task :record,
       [:confirmation_number, :amount, :recipient_name, :zelle_contact,
        :zelle_confirmation, :image_path] => :environment do |_t, args|

    puts "\n#{'=' * 70}"
    puts "  RECORD ZELLE PAYMENT"
    puts "  #{Time.current.strftime('%B %d, %Y at %I:%M %p')}"
    puts "#{'=' * 70}\n\n"

    # ── Validate required args ──────────────────────────────────────────────
    confirmation = args[:confirmation_number].presence
    amount_str   = args[:amount].presence
    recipient    = args[:recipient_name].presence
    contact      = args[:zelle_contact].presence

    missing = []
    missing << "confirmation_number" unless confirmation
    missing << "amount"              unless amount_str
    missing << "recipient_name"      unless recipient
    missing << "zelle_contact"       unless contact

    if missing.any?
      puts "  ERROR: Missing required arguments: #{missing.join(', ')}"
      puts "  Run `bin/rails zelle:record` to see usage.\n\n"
      exit 1
    end

    amount             = amount_str.to_f
    zelle_confirmation = args[:zelle_confirmation].presence
    image_path         = args[:image_path].presence

    puts "  Confirmation #:    #{confirmation}"
    puts "  Amount:            $#{'%.2f' % amount}"
    puts "  Recipient:         #{recipient}"
    puts "  Zelle contact:     #{contact}"
    puts "  Zelle ref:         #{zelle_confirmation || '(none)'}"
    puts "  Proof image:       #{image_path || '(none)'}"
    puts ""

    refund_service  = Notion::RefundRequestService.new
    zelle_service   = Notion::ZelleTransferService.new
    notification    = Notion::NotificationService.new

    # ── Step 1: Look up refund request ─────────────────────────────────────
    print "  [1/5] Looking up #{confirmation}... "
    result = refund_service.find_by_confirmation(confirmation)

    unless result[:success]
      puts "FAILED"
      puts "  ERROR: #{result[:error]} — #{result[:message]}"
      exit 1
    end

    request = result[:request]
    puts "found (#{request[:name]})"
    puts "        Status: #{request[:status]}, Decision: #{request[:decision]}"

    if request[:status] == "Completed"
      puts "\n  WARNING: This request is already marked Completed. Proceeding anyway."
    end

    # ── Step 2: Upload image to Cloudinary ─────────────────────────────────
    proof_url = nil

    if image_path
      print "  [2/5] Uploading #{File.basename(image_path)} to Cloudinary... "

      unless File.exist?(image_path)
        puts "FAILED"
        puts "  ERROR: File not found: #{image_path}"
        exit 1
      end

      proof_url = Notion::ZelleTransferService.upload_proof_to_cloudinary(image_path)

      if proof_url
        puts "done"
        puts "        URL: #{proof_url}"
      else
        puts "FAILED (continuing without proof — check logs)"
      end
    else
      puts "  [2/5] No image provided, skipping Cloudinary upload."
    end

    # ── Step 3: Create Zelle Transfer in Notion ────────────────────────────
    print "  [3/5] Creating Zelle Transfer record in Notion... "

    transfer_result = zelle_service.create_transfer(
      recipient_name:         recipient,
      amount:                 amount,
      zelle_contact:          contact,
      refund_request_page_id: request[:id],
      zelle_confirmation:     zelle_confirmation,
      proof_url:              proof_url,
      notes:                  "Recorded via rake task on #{Date.today}"
    )

    if transfer_result[:success]
      puts "done (#{transfer_result[:page_id]})"
    else
      puts "FAILED"
      puts "  ERROR: #{transfer_result[:error]}"
      exit 1
    end

    # ── Step 4: Mark refund request as Completed ───────────────────────────
    print "  [4/5] Marking #{confirmation} as Completed... "
    refund_service.mark_completed(request[:id])
    puts "done"

    # ── Step 5: Send notification email ────────────────────────────────────
    print "  [5/5] Sending notification email... "

    notif_result = notification.send_for_confirmation!(confirmation)

    if notif_result[:status] == :sent
      puts "sent to #{notif_result[:email]}"
    else
      puts "FAILED (#{notif_result[:message]}) — run notifications:send_one[#{confirmation}] to retry"
    end

    puts "\n  Done! #{confirmation} — #{recipient} — $#{'%.2f' % amount} — Completed"
    puts "#{'=' * 70}\n\n"
  end
end
