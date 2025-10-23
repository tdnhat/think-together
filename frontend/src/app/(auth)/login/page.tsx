import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginContent } from '@/features/auth/components/LoginContent'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Chào mừng quay trở lại!"
      subtitle="Quay lại các phiên học tập cộng tác với cộng đồng của bạn."
      switchLabel="Bạn là người mới?"
      switchText="Tạo tài khoản"
      switchHref="/signup"
      badge="Think Together"
    >
      <LoginContent />
    </AuthLayout>
  )
}
