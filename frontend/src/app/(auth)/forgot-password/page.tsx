'use client'

import { ForgotPasswordForm, AuthLayout } from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Quên mật khẩu?"
      switchLabel="Đã nhớ mật khẩu?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge={AUTH_BRAND_NAME}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
