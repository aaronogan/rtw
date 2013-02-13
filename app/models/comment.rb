class Comment < ActiveRecord::Base
  attr_accessible :content, :name, :url
  validates :location_id, presence: true
  belongs_to :location
end
