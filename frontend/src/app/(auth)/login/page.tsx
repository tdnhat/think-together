'use client'

import { 
  LoginForm, 
  AuthLayout, 
  AuthDivider, 
  AuthSocialButton, 
  DEFAULT_SOCIAL_PROVIDERS 
} from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // NOTE: Integrate Google OAuth login when backend support is ready.
  }

  return (
    <AuthLayout
      title="Chào mừng quay trở lại!"
      switchLabel="Bạn là người mới?"
      switchText="Tạo tài khoản"
      switchHref="/signup"
      badge={AUTH_BRAND_NAME}
    >
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
    </AuthLayout>
  )
}
