class AddSomeModifications < ActiveRecord::Migration
  def change
    remove_column :radios, :type
    add_column :radios, :category, :string, null: false

    add_column :user_likes, :radio_id, :integer, null: false
    add_index :user_likes, [:user_id, :song_id, :radio_id], unique: true

    add_index :user_radios, [:user_id, :radio_id], unique: true
  end
end
