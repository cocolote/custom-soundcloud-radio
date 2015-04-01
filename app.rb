require 'sinatra'
require 'sinatra/activerecord'
#this is dedicated to Spencer, great EE who show us the power of pry!
require 'pry'
# to make the models available in the app
require 'dotenv'
Dotenv.load
require_relative './models/user'
require_relative './models/radio'
require_relative './models/user_radio'
require_relative './models/user_like'

# enable session
use Rack::Session::Cookie, {
  secret: ENV["SESSION_SECRET"]
}

###########
# HELPERS #
###########

helpers do
  def current_user
    session[:user_id]
  end

  def user_signed_in?
    !current_user.nil?
  end
end


###############
# CONTROLLERS #
#  & ROUTES   #
###############

get '/' do
  redirect '/log_in'
end

get '/log_in' do
  if user_signed_in?
    @user = User.find(current_user)
    erb :player
  else
    erb :log_in
  end
end

get '/log_out' do
  session[:user_id] = nil
  redirect '/'
end

get '/get_user' do
  if User.exists?(email: params[:email])
    @user = User.find_by(email: params[:email])
    session[:user_id] = @user.id
    erb :player
  else
    @user = User.new(email: params[:email])
    if @user.save
      session[:user_id] = @user.id
      erb :player
    else
      erb :log_in
    end
  end
end

post '/new_radio' do
  @user = User.find(current_user)
  @radio = Radio.new(params[:new_radio])
  @radio = Radio.find_by(params[:new_radio]) unless @radio.save
  @user_radio = UserRadio.new(user: @user, radio: @radio)
  @user_radio.save
  redirect '/'
end

get '/delete_radio/:id' do
  @user_radio = UserRadio.find_by(user_id: current_user, radio_id: params[:id])
  @user_radio.delete
  redirect '/'
end
