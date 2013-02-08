class StaticPagesController < ApplicationController
  def home
    @google_api = ENV['GOOGLE_API']
  end
end
