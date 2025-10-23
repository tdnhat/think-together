import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { SignupContent } from '@/features/auth/components/SignupContent'

export default function SignupPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      switchLabel="Đã có tài khoản?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge="Think Together"
    >
      <SignupContent />
    </AuthLayout>
  )
}
