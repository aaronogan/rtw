require 'spec_helper'

describe Comment do
  let (:location) { Location.create!(:id => 1, :name => 'Reykjavik', :lat => 64.14, :lon => -21.9, :sequence => 1) }
  before do
    @comment = location.comments.build(name: "Name", url: "URL", content: "Content")
  end

  subject { @comment }

  it { should respond_to(:content) }
  it { should respond_to(:location_id) }

  it { should be_valid }

  describe "when location_id is not present" do
    before { @comment.location_id = nil }
    it { should_not be_valid }
  end
end
