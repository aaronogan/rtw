class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :name
      t.string :url
      t.string :content
      t.integer :location_id

      t.timestamps
    end
    add_index :comments, [:location_id, :created_at]
  end
end
