import { ForgotPasswordContent } from "@/features/auth/components/content/ForgotPasswordContent";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Quên mật khẩu?"
      switchLabel="Đã nhớ mật khẩu?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge="Think Together"
    >
      <ForgotPasswordContent />
    </AuthLayout>
  )
}
