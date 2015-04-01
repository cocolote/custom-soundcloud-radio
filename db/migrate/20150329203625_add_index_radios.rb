class AddIndexRadios < ActiveRecord::Migration
  def change
    add_index :radios, [:name, :category], unique: true
  end
end
