# frozen_string_literal: true

module Api
  class StatsController < ApplicationController
    # GET /api/stats/page-views?page=/choosing-myself
    def page_views
      page_path = params[:page].to_s
      return render json: { views: 0 }, status: :bad_request if page_path.blank?

      cache_key = "plausible:page_views:#{page_path}"
      views = Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
        fetch_plausible_views(page_path)
      end

      render json: { views: views }
    end

    private

    def fetch_plausible_views(page_path)
      api_key = Rails.application.credentials.dig(:plausible, :api_key)
      return 0 unless api_key.present?

      uri = URI("https://plausible.io/api/v1/stats/aggregate")
      uri.query = URI.encode_www_form(
        site_id: "neokizfest.com",
        period: "custom",
        date: "2020-01-01,#{Date.today}",
        metrics: "pageviews",
        filters: "event:page==#{page_path}"
      )

      response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        request = Net::HTTP::Get.new(uri)
        request["Authorization"] = "Bearer #{api_key}"
        http.request(request)
      end

      if response.is_a?(Net::HTTPSuccess)
        data = JSON.parse(response.body)
        data.dig("results", "pageviews", "value") || 0
      else
        Rails.logger.warn("[StatsController] Plausible API error: #{response.code} #{response.body}")
        0
      end
    rescue StandardError => e
      Rails.logger.error("[StatsController] Failed to fetch Plausible stats: #{e.message}")
      0
    end
  end
end
