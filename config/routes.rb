Rails.application.routes.draw do
  root 'pages#home'
  get 'lineup', to: 'pages#lineup'
  get 'videos', to: 'pages#videos'
  get 'testimonials', to: 'pages#testimonials'
  get 'inertia-example', to: 'pages#inertia_example'
  get 'test', to: 'pages#test'

  
  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check
end