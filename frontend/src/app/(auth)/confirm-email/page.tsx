'use client'

import { ConfirmEmailForm, AuthLayout } from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

export default function ConfirmEmailPage() {
  return (
    <AuthLayout
      title="Xác nhận email"
      switchLabel="Không nhận được email?"
      switchText="Gửi lại email xác nhận"
      switchHref="/verify-email"
      badge={AUTH_BRAND_NAME}
    >
      <ConfirmEmailForm />
    </AuthLayout>
  )
}
