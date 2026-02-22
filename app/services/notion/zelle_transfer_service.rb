# frozen_string_literal: true

require "net/http"
require "uri"

module Notion
  # Creates and fetches Zelle transfer records in Notion.
  # Used for recording outbound refund payments and attaching payment proof to emails.
  class ZelleTransferService
    ZELLE_TRANSFERS_DB_ID = Rails.application.credentials.dig(:notion, :zelle_transfers_db_id)

    CONNECT_TIMEOUT = 10 # seconds
    READ_TIMEOUT = 15    # seconds
    MAX_FILE_SIZE = 10 * 1024 * 1024 # 10 MB

    def initialize
      @client = Notion::ApiClient.new
    end

    # Create a new Zelle transfer record in Notion.
    #
    # Required params:
    #   :recipient_name         — who was paid (page title)
    #   :amount                 — numeric payment amount
    #   :zelle_contact          — recipient's Zelle email or phone
    #   :refund_request_page_id — Notion page ID of the linked Refund Request
    #
    # Optional params:
    #   :date              — payment date (Date/String, defaults to today)
    #   :zelle_confirmation — Zelle reference/confirmation number
    #   :proof_url          — externally hosted image URL (e.g. Cloudinary)
    #   :notes             — admin notes
    #
    # Returns { success: true, page_id: "..." } or { success: false, error: "..." }
    def create_transfer(params)
      raise ArgumentError, "recipient_name is required" if params[:recipient_name].blank?
      raise ArgumentError, "amount is required" if params[:amount].blank?
      raise ArgumentError, "zelle_contact is required" if params[:zelle_contact].blank?
      raise ArgumentError, "refund_request_page_id is required" if params[:refund_request_page_id].blank?

      properties = build_transfer_properties(params)
      page = @client.create_page(database_id: ZELLE_TRANSFERS_DB_ID, properties: properties)

      Rails.logger.info("[ZelleTransferService] Created transfer #{page.id} for #{params[:recipient_name]}")
      { success: true, page_id: page.id }
    rescue ArgumentError => e
      { success: false, error: e.message }
    rescue Notion::ApiClient::NotionError => e
      Rails.logger.error("[ZelleTransferService] Create failed: #{e.message}")
      { success: false, error: e.message }
    end

    # Upload a local image file to Cloudinary and return the secure URL.
    # Uses unsigned upload with the configured upload_preset (no API secret needed).
    # Returns nil if upload fails.
    def self.upload_proof_to_cloudinary(file_path)
      unless File.exist?(file_path)
        Rails.logger.error("[ZelleTransferService] File not found: #{file_path}")
        return nil
      end

      upload_preset = Rails.application.credentials.dig(:cloudinary, :upload_preset)

      result = Cloudinary::Uploader.unsigned_upload(
        file_path,
        upload_preset,
        folder: "zelle-proofs",
        resource_type: "image"
      )

      url = result["secure_url"]
      Rails.logger.info("[ZelleTransferService] Uploaded proof to Cloudinary: #{url}")
      url
    rescue StandardError => e
      Rails.logger.error("[ZelleTransferService] Cloudinary upload failed: #{e.message}")
      nil
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

    def build_transfer_properties(params)
      date = params[:date] || Date.today
      date_str = date.to_s
      method_label = params[:payment_method].presence || "Zelle"
      # Title format: "Zelle — John Smith — 2026-02-20" (or "Wise — ...")
      title = "#{method_label} — #{params[:recipient_name]} — #{date_str}"

      props = {
        "Recipient" => { title: [{ text: { content: title } }] },
        "Amount"    => { number: params[:amount].to_f },
        "Date"      => { date: { start: date_str } },
        "Zelle Contact" => { rich_text: [{ text: { content: params[:zelle_contact].to_s } }] },
        "Linked Request" => { relation: [{ id: params[:refund_request_page_id].to_s }] }
      }

      if params[:zelle_confirmation].present?
        props["Zelle Confirmation"] = { rich_text: [{ text: { content: params[:zelle_confirmation].to_s } }] }
      end

      if params[:notes].present?
        props["Notes"] = { rich_text: [{ text: { content: params[:notes].to_s } }] }
      end

      # "Refund Image" is a URL property — stores the Cloudinary link to the payment screenshot.
      if params[:proof_url].present?
        props["Refund Image"] = { url: params[:proof_url].to_s }
      end

      props
    end

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

    # Extract the image URL and filename from the "Refund Image" URL property.
    def extract_file_info(transfer)
      url = transfer.properties.dig("Refund Image", "url")
      return nil if url.blank?

      filename = derive_filename(url)
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
