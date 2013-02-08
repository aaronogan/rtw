require 'spec_helper'

describe "StaticPages" do
  describe "GET /static_pages" do
    it "should have the content 'Backpack of Memories'" do
      visit '/static_pages/home'
      page.should have_content('Backpack of Memories')
    end
  end
end
