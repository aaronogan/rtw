require 'spec_helper'

describe "Locations" do

  before do
    @locations = [
      Location.create!(:name => 'Chicago', :lat => 41.9, :lon => -87.65),
      Location.create!(:name => 'Reykjavik', :lat => 64.14, :lon => -21.9)
    ]
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
  end
end
