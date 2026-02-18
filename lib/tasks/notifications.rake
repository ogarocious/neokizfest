# frozen_string_literal: true

namespace :notifications do
  desc "Send pending completion emails for all Completed/Waived refund requests"
  task send_pending: :environment do
    puts "\n#{'=' * 70}"
    puts "  SEND PENDING NOTIFICATION EMAILS"
    puts "  #{Time.current.strftime('%B %d, %Y at %I:%M %p')}"
    puts "#{'=' * 70}\n\n"

    service = Notion::NotificationService.new
    results = service.send_pending_completions!

    if results[:sent].any?
      puts "  SENT (#{results[:sent].size}):"
      results[:sent].each do |r|
        puts "    #{r[:confirmation_number]}  #{r[:name]} -> #{r[:email]} (#{r[:email_status]})"
      end
    end

    if results[:errors].any?
      puts "\n  ERRORS (#{results[:errors].size}):"
      results[:errors].each do |r|
        puts "    #{r[:confirmation_number]}: #{r[:message]}"
      end
    end

    total = results[:sent].size + results[:errors].size
    if total == 0
      puts "  No pending notifications found. All caught up!"
    else
      puts "\n  Summary: #{results[:sent].size} sent, #{results[:errors].size} errors"
    end

    puts "\n#{'=' * 70}\n\n"
  end

  desc "Send notification email for a specific confirmation number (e.g., RR-0061)"
  task :send_one, [:confirmation_number] => :environment do |_t, args|
    confirmation = args[:confirmation_number]

    if confirmation.blank?
      puts "\n  Usage: bin/rails notifications:send_one[RR-0061]\n\n"
      next
    end

    puts "\n#{'=' * 70}"
    puts "  SEND NOTIFICATION FOR #{confirmation}"
    puts "  #{Time.current.strftime('%B %d, %Y at %I:%M %p')}"
    puts "#{'=' * 70}\n\n"

    service = Notion::NotificationService.new
    result = service.send_for_confirmation!(confirmation)

    case result[:status]
    when :sent
      puts "  Sent #{result[:email_status]} email to #{result[:email]} (#{result[:name]})"
    when :error
      puts "  Error: #{result[:message]}"
    end

    puts "\n#{'=' * 70}\n\n"
  end
end
