'use client'

import { SignupForm } from '../forms/SignupForm'
import { AuthDivider } from '../shared/AuthDivider'
import { AuthSocialButton } from '../shared/AuthSocialButton'
import { DEFAULT_SOCIAL_PROVIDERS } from '../shared/SocialProviders'

export function SignupContent() {
  const handleGoogleSignup = () => {
    // NOTE: Integrate Google OAuth signup when backend support is ready.
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
