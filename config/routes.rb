Rails.application.routes.draw do
  root 'home#index'
  get 'home/index'
  get 'home/private'

  devise_for :users
  devise_for :installs

  resources :users, only: [:show, :update, :destroy]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
