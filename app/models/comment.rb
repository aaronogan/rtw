class Comment < ActiveRecord::Base
  attr_accessible :content, :name, :url, :location_id
  belongs_to :location
end
