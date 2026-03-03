class AdminController < ApplicationController
  http_basic_authenticate_with name: ENV.fetch("ADMIN_USER", "admin"),
                                password: ENV.fetch("ADMIN_PASSWORD", "changeme")

  def index
    @pending = Notion::NotificationService.new.fetch_pending
  end

  def send_notifications
    service = Notion::NotificationService.new
    results = service.send_pending_completions!

    @sent = results[:sent]
    @errors = results[:errors]
    @ran = true
    @pending = service.fetch_pending

    render :index
  end

  def send_one
    service = Notion::NotificationService.new
    result = service.send_for_confirmation!(params[:confirmation_number])

    if result[:status] == :sent
      @sent = [result]
      @errors = []
    else
      @sent = []
      @errors = [result]
    end

    @ran = true
    @pending = service.fetch_pending

    render :index
  end
end
