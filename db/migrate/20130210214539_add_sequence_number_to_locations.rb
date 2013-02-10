class AddSequenceNumberToLocations < ActiveRecord::Migration
  def change
    add_column :locations, :sequence, :integer
  end
end
