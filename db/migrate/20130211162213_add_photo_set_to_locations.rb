class AddPhotoSetToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :photoset, :string
  end
end
