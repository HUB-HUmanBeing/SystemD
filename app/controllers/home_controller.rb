class HomeController < ApplicationController
  def index
    flash[:success] = "vous etes sur l'index du site"
  end

  def private
  end
end
