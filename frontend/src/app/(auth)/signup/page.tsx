'use client'

import { 
  SignupForm, 
  AuthLayout, 
  AuthDivider, 
  AuthSocialButton, 
  DEFAULT_SOCIAL_PROVIDERS 
} from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

export default function SignupPage() {
  const handleGoogleSignup = () => {
    // NOTE: Integrate Google OAuth signup when backend support is ready.
  }

  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      switchLabel="Đã có tài khoản?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge={AUTH_BRAND_NAME}
    >
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
    </AuthLayout>
  )
}
