'use client'

import { Suspense } from 'react'
import { ConfirmEmailForm, AuthLayout } from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

function ConfirmEmailFormWrapper() {
  return <ConfirmEmailForm />
}

export default function ConfirmEmailPage() {
  return (
    <AuthLayout
      title="Xác nhận email"
      switchLabel="Không nhận được email?"
      switchText="Gửi lại email xác nhận"
      switchHref="/verify-email"
      badge={AUTH_BRAND_NAME}
    >
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand-primary)] border-t-transparent" />
          <p className="text-center text-foreground/70">Đang tải...</p>
        </div>
      }>
        <ConfirmEmailFormWrapper />
      </Suspense>
    </AuthLayout>
  )
}
