require 'spec_helper'

describe "Locations" do

  before do
    @locations = [
      Location.create!(:id => 1, :name => 'Reykjavik', :lat => 64.14, :lon => -21.9, :sequence => 2),
      Location.create!(:id => 2, :name => 'Chicago', :lat => 41.9, :lon => -87.65, :sequence => 1)
    ]

    @locations[0].comments.build(:name => 'Name', :url => 'URL', :content => 'Content', :location_id => 1)
  end

  context "Fetching list of locations" do
    subject do
      get '/locations.json'
      JSON.parse(response.body)
    end

    it "should return a list of locations" do
      subject[0]['name'].should == 'Chicago'
      subject[0]['lat'].should == 41.9
      subject[0]['lon'].should == -87.65

      subject[1]['name'].should == 'Reykjavik'
      subject[1]['lat'].should == 64.14
      subject[1]['lon'].should == -21.9
    end

    it "should return an ordered list of locations" do
      subject[0]['sequence'].should == 1
      subject[1]['sequence'].should == 2
    end

    it "should return locations with comments" do
      subject[0]['comments'].should_not == nil
      #subject[0]['comments']['name'].should == 'Name'
    end
  end
end
