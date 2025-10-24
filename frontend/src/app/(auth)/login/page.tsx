import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginContent } from '@/features/auth/components/LoginContent'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Chào mừng quay trở lại!"
      switchLabel="Bạn là người mới?"
      switchText="Tạo tài khoản"
      switchHref="/signup"
      badge="Think Together"
    >
      <LoginContent />
    </AuthLayout>
  )
}
