Rails.application.routes.draw do
  # Refund System Routes (Primary)
  root 'pages#farewell'
  get 'request', to: 'pages#refund_request'
  get 'confirmation', to: 'pages#confirmation'
  get 'faq', to: 'pages#faq'
  get 'status', to: 'pages#status'
  get 'support', to: 'pages#support'
  get 'behind-the-build', to: 'pages#behind_the_build'
  get 'donation-thank-you', to: 'pages#donation_thank_you'

  # Progress Dashboard (with Notion integration)
  get 'progress', to: 'refund_progress#index'
  post 'progress/refresh', to: 'refund_progress#refresh'

  # Refund Request API (with Notion integration)
  namespace :api do
    post 'refunds/validate-email', to: 'refund_requests#validate_email'
    post 'refunds', to: 'refund_requests#create'
    post 'refunds/status', to: 'refund_requests#status'
    post 'refunds/notify-completion', to: 'refund_requests#notify_completion'

    # Lemon Squeezy donation checkout
    post 'donations/checkout', to: 'donations#checkout'

    # Lemon Squeezy webhook (supporter donations)
    post 'webhooks/lemon-squeezy', to: 'webhooks#lemon_squeezy'
  end

  # Legacy Festival Routes (kept for reference)
  get 'home', to: 'pages#home'
  get 'lineup', to: 'pages#lineup'
  get 'videos', to: 'pages#videos'
  get 'testimonials', to: 'pages#testimonials'
  get 'inertia-example', to: 'pages#inertia_example'
  get 'test', to: 'pages#test'

  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check
end