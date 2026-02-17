# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy.
# See the Securing Rails Applications Guide for more information:
# https://guides.rubyonrails.org/security.html#content-security-policy-header

Rails.application.configure do
  config.content_security_policy do |policy|
    policy.default_src :self
    policy.font_src    :self, :data, "https://fonts.gstatic.com"
    policy.img_src     :self, :data, :https
    policy.object_src  :none
    policy.script_src  :self, "https://plausible.io"
    policy.style_src   :self, :unsafe_inline
    policy.connect_src :self, "https://plausible.io", "https://api.cloudinary.com"
    policy.media_src   :self, "https://res.cloudinary.com"
    policy.frame_src   :self

    # Allow Vite dev server in development
    if Rails.env.development?
      policy.script_src *policy.script_src, :unsafe_eval, "http://#{ViteRuby.config.host_with_port}"
      policy.connect_src *policy.connect_src, "ws://#{ViteRuby.config.host_with_port}", "http://#{ViteRuby.config.host_with_port}"
    end

    # Allow blob: in test for Selenium
    policy.script_src *policy.script_src, :blob if Rails.env.test?
  end

  # Report violations without enforcing (safe rollout — switch to enforcing once stable)
  config.content_security_policy_report_only = true
end
