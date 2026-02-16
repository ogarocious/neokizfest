# frozen_string_literal: true

require "net/http"
require "uri"

module Notion
  # Fetches Zelle payment proof files from Notion for attaching to refund emails.
  # Queries the Zelle Transfers DB by linked refund request, downloads the
  # "Payment Proof" file, and returns it ready for Rails attachments.
  class ZelleTransferService
    ZELLE_TRANSFERS_DB_ID = Rails.application.credentials.dig(:notion, :zelle_transfers_db_id)

    CONNECT_TIMEOUT = 10 # seconds
    READ_TIMEOUT = 15    # seconds
    MAX_FILE_SIZE = 10 * 1024 * 1024 # 10 MB

    def initialize
      @client = Notion::ApiClient.new
    end

    # Returns { filename:, content_type:, data: } or nil.
    # Every failure is rescued gracefully so the email always sends.
    def fetch_payment_proof(refund_request_page_id)
      return nil if ZELLE_TRANSFERS_DB_ID.blank? || refund_request_page_id.blank?

      transfer = find_linked_transfer(refund_request_page_id)
      return nil unless transfer

      file_url, filename = extract_file_info(transfer)
      return nil unless file_url

      download_file(file_url, filename)
    rescue StandardError => e
      Rails.logger.error("[ZelleTransferService] Failed to fetch payment proof: #{e.message}")
      nil
    end

    private

    # Query Zelle Transfers DB for a transfer linked to this refund request
    def find_linked_transfer(refund_request_page_id)
      results = @client.query_database(
        database_id: ZELLE_TRANSFERS_DB_ID,
        filter: {
          property: "Linked Request",
          relation: { contains: refund_request_page_id }
        }
      )

      results.first
    end

    # Extract the file URL and filename from the "Payment Proof" files property.
    # Notion files can be either "file" (Notion-hosted, signed URL) or "external".
    def extract_file_info(transfer)
      files = Array(transfer.properties.dig("Payment Proof", "files"))
      return nil if files.empty?

      file_obj = files.first
      url = case file_obj["type"]
            when "file"
              file_obj.dig("file", "url")
            when "external"
              file_obj.dig("external", "url")
            end

      return nil if url.blank?

      filename = file_obj["name"].presence || derive_filename(url)
      [url, filename]
    end

    # Download the file and return { filename:, content_type:, data: }
    def download_file(url, filename)
      uri = URI.parse(url)
      response = fetch_with_redirects(uri)

      unless response.is_a?(Net::HTTPSuccess)
        Rails.logger.warn("[ZelleTransferService] Download failed: HTTP #{response.code}")
        return nil
      end

      body = response.body
      if body.nil? || body.bytesize == 0
        Rails.logger.warn("[ZelleTransferService] Downloaded file is empty")
        return nil
      end

      if body.bytesize > MAX_FILE_SIZE
        Rails.logger.warn("[ZelleTransferService] File too large (#{body.bytesize} bytes), skipping")
        return nil
      end

      content_type = response["Content-Type"] || mime_from_filename(filename)

      { filename: filename, content_type: content_type, data: body }
    end

    def fetch_with_redirects(uri, limit = 3)
      raise "Too many redirects" if limit == 0

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = (uri.scheme == "https")
      http.open_timeout = CONNECT_TIMEOUT
      http.read_timeout = READ_TIMEOUT

      request = Net::HTTP::Get.new(uri)
      response = http.request(request)

      if response.is_a?(Net::HTTPRedirection) && response["Location"]
        fetch_with_redirects(URI.parse(response["Location"]), limit - 1)
      else
        response
      end
    end

    def derive_filename(url)
      path = URI.parse(url).path
      basename = File.basename(path)
      # Strip query-string artifacts that cling to the basename
      basename = basename.split("?").first
      basename.presence || "payment-proof.png"
    end

    def mime_from_filename(filename)
      ext = File.extname(filename).downcase
      {
        ".png" => "image/png",
        ".jpg" => "image/jpeg",
        ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        ".pdf" => "application/pdf",
        ".webp" => "image/webp",
        ".heic" => "image/heic"
      }[ext] || "application/octet-stream"
    end
  end
end
