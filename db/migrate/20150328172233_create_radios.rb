class CreateRadios < ActiveRecord::Migration
  def change
    create_table :radios do |t|
      t.string :type, null: false
      t.string :name, null: false

      t.timestamps null: false
    end
  end
end
