class UserLike < ActiveRecord::Base
  belongs_to :user
  belongs_to :radio

  validates :user,
    presence: true

  validates :song_id,
    presence: true

  validates :radio,
    presence: true
end
