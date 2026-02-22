# frozen_string_literal: true

namespace :wise do
  desc <<~DESC
    Record a Wise payment and mark the refund request as Completed.

    Usage:
      bin/rails "wise:record[RR-0092,104.42,Julia Dick,julia@example.com]"
      bin/rails "wise:record[RR-0092,104.42,Julia Dick,julia@example.com,/path/to/screenshot.png]"

    Arguments (in order):
      1. confirmation_number   — e.g. RR-0092 (required)
      2. amount                — USD amount e.g. 104.42 (required)
      3. recipient_name        — e.g. "Julia Dick" (required)
      4. wise_email            — recipient's Wise email (required)
      5. image_path            — local path to payment screenshot (optional)

    Steps performed:
      1. Look up refund request by confirmation number
      2. Upload screenshot to Cloudinary (if image_path provided)
      3. Create Wise Transfer record in Notion (Zelle Transfers DB)
      4. Mark refund request as Completed + set Date Processed = today

    NOTE: Does NOT send the notification email. Run notifications:send_pending
    on production after recording payments.
  DESC
  task :record,
       [:confirmation_number, :amount, :recipient_name, :wise_email,
        :image_path] => :environment do |_t, args|

    puts "\n#{'=' * 70}"
    puts "  RECORD WISE PAYMENT"
    puts "  #{Time.current.strftime('%B %d, %Y at %I:%M %p')}"
    puts "#{'=' * 70}\n\n"

    # ── Validate required args ──────────────────────────────────────────────
    confirmation = args[:confirmation_number].presence
    amount_str   = args[:amount].presence
    recipient    = args[:recipient_name].presence
    wise_email   = args[:wise_email].presence

    missing = []
    missing << "confirmation_number" unless confirmation
    missing << "amount"              unless amount_str
    missing << "recipient_name"      unless recipient
    missing << "wise_email"          unless wise_email

    if missing.any?
      puts "  ERROR: Missing required arguments: #{missing.join(', ')}"
      puts "  Run `bin/rails wise:record` to see usage.\n\n"
      exit 1
    end

    amount     = amount_str.to_f
    image_path = args[:image_path].presence

    puts "  Confirmation #:    #{confirmation}"
    puts "  Amount:            $#{'%.2f' % amount} USD"
    puts "  Recipient:         #{recipient}"
    puts "  Wise email:        #{wise_email}"
    puts "  Proof image:       #{image_path || '(none)'}"
    puts ""

    refund_service  = Notion::RefundRequestService.new
    zelle_service   = Notion::ZelleTransferService.new

    # ── Step 1: Look up refund request ─────────────────────────────────────
    print "  [1/4] Looking up #{confirmation}... "
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
      print "  [2/4] Uploading #{File.basename(image_path)} to Cloudinary... "

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
      puts "  [2/4] No image provided, skipping Cloudinary upload."
    end

    # ── Step 3: Create Wise Transfer record in Notion ──────────────────────
    print "  [3/4] Creating Wise Transfer record in Notion... "

    transfer_result = zelle_service.create_transfer(
      recipient_name:         recipient,
      amount:                 amount,
      zelle_contact:          wise_email,
      refund_request_page_id: request[:id],
      proof_url:              proof_url,
      payment_method:         "Wise",
      notes:                  "Wise transfer (M2E). Recorded via rake task on #{Date.today}"
    )

    if transfer_result[:success]
      puts "done (#{transfer_result[:page_id]})"
    else
      puts "FAILED"
      puts "  ERROR: #{transfer_result[:error]}"
      exit 1
    end

    # ── Step 4: Mark refund request as Completed ───────────────────────────
    print "  [4/4] Marking #{confirmation} as Completed... "
    refund_service.mark_completed(request[:id])
    puts "done"

    puts "\n  Done! #{confirmation} — #{recipient} — $#{'%.2f' % amount} USD (Wise) — Completed"
    puts "  Next: run notifications:send_pending on production to send the email."
    puts "#{'=' * 70}\n\n"
  end
end
