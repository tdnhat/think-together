'use client'

import { AuthDivider } from './AuthDivider'
import { AuthSocialButton } from './AuthSocialButton'
import { SignupForm } from './SignupForm'
import { DEFAULT_SOCIAL_PROVIDERS } from './SocialProviders'

export function SignupContent() {
  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth signup
  }

  return (
    <div className="space-y-6">
      <AuthSocialButton
        iconSrc={DEFAULT_SOCIAL_PROVIDERS.google.iconPath}
        label={`Đăng ký với ${DEFAULT_SOCIAL_PROVIDERS.google.label}`}
        description="Kết nối với tài khoản trường học của bạn"
        onClick={handleGoogleSignup}
      />

      <AuthDivider />

      <SignupForm />
    </div>
  )
}
