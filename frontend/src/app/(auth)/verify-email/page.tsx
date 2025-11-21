'use client'

import { VerifyEmailForm, AuthLayout } from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Xác nhận email"
      switchLabel="Đã xác nhận email?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge={AUTH_BRAND_NAME}
    >
      <VerifyEmailForm />
    </AuthLayout>
  )
}
