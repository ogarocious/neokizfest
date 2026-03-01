# frozen_string_literal: true

namespace :post do
  desc "Draft a Facebook post using live progress stats + post history. " \
       "Args: [type,email] — type is 'daily' or 'weekly' (default: auto-detect). " \
       "Pass 'email' as second arg to also send the draft to charles@neokizomba.com. " \
       "Examples:\n" \
       "  bin/rails post:draft\n" \
       "  bin/rails \"post:draft[weekly]\"\n" \
       "  bin/rails \"post:draft[,email]\"\n" \
       "  bin/rails \"post:draft[weekly,email]\""
  task :draft, [:type, :send_email] => :environment do |_t, args|
    type       = args[:type]&.strip&.downcase&.to_sym
    send_email = args[:send_email]&.strip&.downcase == "email"

    puts "\n#{'=' * 70}"
    puts "  DRAFT SOCIAL POST"
    puts "  #{Time.current.strftime('%B %d, %Y at %I:%M %p')}"
    puts "#{'=' * 70}\n\n"

    if type && !%i[daily weekly].include?(type)
      puts "  Unknown type '#{type}'. Valid options: daily, weekly\n\n"
      puts "#{'=' * 70}\n\n"
      next
    end

    puts "  Fetching live stats from Notion + generating draft via Claude..."

    service = PostDraftingService.new(force_type: type)
    result  = service.draft!

    puts "  Done.\n\n"
    puts "  Post type : #{result[:type].to_s.upcase}"
    puts "  Day       : #{result[:day]}"
    puts "  Week      : #{result[:week]}"
    puts "\n#{'─' * 70}\n\n"

    puts result[:draft]

    puts "\n#{'─' * 70}"
    puts "\n  Caption above is plain text — paste directly into Facebook."
    puts "  After posting, record the snapshot in social-posts-log.md.\n\n"

    if send_email
      puts "  Sending draft to charles@neokizomba.com..."
      AdminMailer.post_draft(
        draft:          result[:draft],
        type:           result[:type],
        day:            result[:day],
        week:           result[:week],
        stats:          result[:stats],
        donation_stats: result[:donation_stats]
      ).deliver_now
      puts "  Email sent. ✓\n\n"
    end

    puts "#{'=' * 70}\n\n"
  rescue => e
    puts "\n  ERROR: #{e.message}\n\n"
    puts "#{'=' * 70}\n\n"
    raise
  end
end
