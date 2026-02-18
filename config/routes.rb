Rails.application.routes.draw do
  # Refund System Routes (Primary)
  root 'pages#farewell'
  get 'request', to: 'pages#refund_request'
  get 'confirmation', to: 'pages#confirmation'
  get 'faq', to: 'pages#faq'
  get 'status', to: 'pages#status'
  get 'support', to: 'pages#support'
  get 'behind-the-build', to: 'pages#behind_the_build'
  get 'artist-payments', to: 'pages#artist_payments'
  get 'choosing-myself', to: 'pages#choosing_myself'
  get 'donation-thank-you', to: 'pages#donation_thank_you'

  # Progress Dashboard (with Notion integration)
  get 'progress', to: 'refund_progress#index'
  post 'progress/refresh', to: 'refund_progress#refresh'

  # Flowers Gallery (community testimonials)
  get 'flowers', to: 'flowers#index'
  post 'flowers/refresh', to: 'flowers#refresh'

  # Refund Request API (with Notion integration)
  namespace :api do
    post 'refunds/validate-email', to: 'refund_requests#validate_email'
    post 'refunds', to: 'refund_requests#create'
    post 'refunds/status', to: 'refund_requests#status'
    post 'refunds/notify-completion', to: 'refund_requests#notify_completion'
    post 'refunds/send-pending-notifications', to: 'refund_requests#send_pending_notifications'

    # Square donation checkout
    post 'donations/checkout', to: 'donations#checkout'

    # Community messages
    post 'community-messages', to: 'community_messages#create'

    # Flowers submissions
    post 'flowers', to: 'flowers#create'

    # Page view stats (Plausible proxy)
    get 'stats/page-views', to: 'stats#page_views'

    # Square webhook (supporter donations)
    post 'webhooks/square', to: 'webhooks#square'
  end

  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check
end