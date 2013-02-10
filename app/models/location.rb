class Location < ActiveRecord::Base
  attr_accessible :lat, :lon, :name, :sequence
end
