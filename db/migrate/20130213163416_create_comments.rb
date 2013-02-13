class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string :name
      t.string :url
      t.string :content

      t.timestamps
    end
  end
end
