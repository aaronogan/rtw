class Location < ActiveRecord::Base
  attr_accessible :lat, :lon, :name, :sequence, :photoset
  has_many :comments
end
