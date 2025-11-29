'use client'

import { Suspense } from 'react'
import { ConfirmEmailForm, AuthLayout } from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

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
          <LoadingSpinner size="lg" />
          <p className="text-center text-foreground/70">Đang tải...</p>
        </div>
      }>
        <ConfirmEmailFormWrapper />
      </Suspense>
    </AuthLayout>
  )
}
