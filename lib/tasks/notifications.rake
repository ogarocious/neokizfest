# frozen_string_literal: true

namespace :notifications do
  desc "Send pending completion emails — shows list and prompts for selection"
  task send_pending: :environment do
    puts "\n#{'=' * 70}"
    puts "  SEND PENDING NOTIFICATION EMAILS"
    puts "  #{Time.current.strftime('%B %d, %Y at %I:%M %p')}"
    puts "#{'=' * 70}\n\n"

    service = Notion::NotificationService.new
    pending = service.fetch_pending

    if pending.empty?
      puts "  No pending notifications found. All caught up!\n\n"
      puts "#{'=' * 70}\n\n"
      next
    end

    puts "  Pending (#{pending.size}):\n\n"
    pending.each_with_index do |r, i|
      amount = r[:refund_amount] ? "$#{r[:refund_amount].to_i}" : "n/a"
      puts "    [#{i + 1}] #{r[:confirmation_number]}  #{r[:name]}  #{amount}  #{r[:status]}  <#{r[:email]}>"
    end

    puts "\n  Send to: enter numbers (e.g. 1,3), a range (1-3), or 'all'  [blank = abort]: "
    input = $stdin.gets&.strip

    if input.blank?
      puts "\n  Aborted — nothing sent.\n\n"
      puts "#{'=' * 70}\n\n"
      next
    end

    selected =
      if input.downcase == "all"
        pending
      else
        indices = input.split(",").flat_map do |part|
          if part.include?("-")
            a, b = part.split("-").map(&:to_i)
            (a..b).to_a
          else
            [part.to_i]
          end
        end.uniq.sort

        invalid = indices.select { |i| i < 1 || i > pending.size }
        if invalid.any?
          puts "\n  Invalid selection(s): #{invalid.join(', ')} — valid range is 1–#{pending.size}. Aborted.\n\n"
          puts "#{'=' * 70}\n\n"
          next
        end

        indices.map { |i| pending[i - 1] }
      end

    puts "\n  Sending to #{selected.size} recipient(s)...\n\n"

    results = { sent: [], errors: [] }
    selected.each do |r|
      result = service.send_for_confirmation!(r[:confirmation_number])
      results[result[:status]] << result
      if result[:status] == :sent
        puts "    [sent]  #{result[:confirmation_number]}  #{result[:name]} -> #{result[:email]} (#{result[:email_status]})"
      else
        puts "    [error] #{result[:confirmation_number]}: #{result[:message]}"
      end
    end

    puts "\n  Summary: #{results[:sent].size} sent, #{results[:errors].size} errors"
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
