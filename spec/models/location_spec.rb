require 'spec_helper'

describe Location do
  before do
    @location = Location.create!(:id => 1, :name => 'Reykjavik', :lat => 64.14, :lon => -21.9, :sequence => 1)
  end

  subject { @location }

  it { should respond_to(:name) }
  it { should respond_to(:lat) }
  it { should respond_to(:lon) }
  it { should respond_to(:sequence) }
  it { should respond_to(:comments) }
end
