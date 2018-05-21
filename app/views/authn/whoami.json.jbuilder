if @user
  json.extract! @user, :id, :provider, :uid, :name, :email
  json.user_roles @roles do |role|
    json.role_name role[0]
    json.resource role[1]  if role[1]
  end
  json.image_url image_url(@user.image_id, format: :json) if !@user.image_id.nil?
  json.content_url image_content_url(@user.image_id) if !@user.image_id.nil?
end
