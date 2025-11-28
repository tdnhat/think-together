import { Suspense } from 'react'
import { ResetPasswordForm, AuthLayout } from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

function ResetPasswordFormWrapper() {
  return <ResetPasswordForm />
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      switchLabel="Đã nhớ mật khẩu?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge={AUTH_BRAND_NAME}
    >
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--brand-primary)] border-t-transparent" />
          <p className="text-center text-foreground/70">Đang tải...</p>
        </div>
      }>
        <ResetPasswordFormWrapper />
      </Suspense>
    </AuthLayout>
  )
}
