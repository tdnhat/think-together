import { ResetPasswordForm, AuthLayout } from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      switchLabel="Đã nhớ mật khẩu?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge={AUTH_BRAND_NAME}
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
