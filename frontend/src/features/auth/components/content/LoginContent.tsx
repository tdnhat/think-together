'use client'

import { LoginForm } from "../forms/LoginForm"
import { AuthDivider } from "../shared/AuthDivider"
import { AuthSocialButton } from "../shared/AuthSocialButton"
import { DEFAULT_SOCIAL_PROVIDERS } from "../shared/SocialProviders"


export function LoginContent() {
  const handleGoogleLogin = () => {
    // NOTE: Integrate Google OAuth login when backend support is ready.
  }

  return (
    <div className="space-y-6">
      <AuthSocialButton
        iconSrc={DEFAULT_SOCIAL_PROVIDERS.google.iconPath}
        label={`Tiếp tục với ${DEFAULT_SOCIAL_PROVIDERS.google.label}`}
        description="Đăng nhập bằng email trường học của bạn"
        onClick={handleGoogleLogin}
      />

      <AuthDivider />

      <LoginForm />
    </div>
  )
}
