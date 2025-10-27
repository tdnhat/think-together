import { ResetPasswordContent } from "@/features/auth/components/content/ResetPasswordContent";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      switchLabel="Đã nhớ mật khẩu?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge="Think Together"
    >
      <ResetPasswordContent />
    </AuthLayout>
  )
}
