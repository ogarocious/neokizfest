require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "should get home" do
    get pages_home_url
    assert_response :success
  end

  test "should get lineup" do
    get pages_lineup_url
    assert_response :success
  end

  test "should get videos" do
    get pages_videos_url
    assert_response :success
  end

  test "should get testimonials" do
    get pages_testimonials_url
    assert_response :success
  end
end
