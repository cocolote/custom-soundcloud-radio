# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150329211139) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "radios", force: :cascade do |t|
    t.string   "name",       null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "category",   null: false
  end

  add_index "radios", ["name", "category"], name: "index_radios_on_name_and_category", unique: true, using: :btree

  create_table "user_likes", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "song_id",    null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer  "radio_id",   null: false
  end

  add_index "user_likes", ["user_id", "song_id", "radio_id"], name: "index_user_likes_on_user_id_and_song_id_and_radio_id", unique: true, using: :btree

  create_table "user_radios", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "radio_id",   null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "user_radios", ["user_id", "radio_id"], name: "index_user_radios_on_user_id_and_radio_id", unique: true, using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",      null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

end
