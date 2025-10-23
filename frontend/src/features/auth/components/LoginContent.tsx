'use client'

import { AuthDivider } from './AuthDivider'
import { AuthSocialButton } from './AuthSocialButton'
import { LoginForm } from './LoginForm'
import { DEFAULT_SOCIAL_PROVIDERS } from './SocialProviders'

export function LoginContent() {
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
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
