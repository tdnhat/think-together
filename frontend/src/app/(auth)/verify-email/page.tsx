import { VerifyEmailContent } from "@/features/auth/components/content/VerifyEmailContent";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Xác nhận email"
      switchLabel="Đã xác nhận email?"
      switchText="Đăng nhập"
      switchHref="/login"
      badge="Think Together"
    >
      <VerifyEmailContent />
    </AuthLayout>
  )
}
