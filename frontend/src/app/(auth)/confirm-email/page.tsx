import { ConfirmEmailContent } from "@/features/auth/components/content/ConfirmEmailContent";
import { AuthLayout } from "@/features/auth/components/layout/AuthLayout";

export default function ConfirmEmailPage() {
  return (
    <AuthLayout
      title="Xác nhận email"
      switchLabel="Không nhận được email?"
      switchText="Gửi lại email xác nhận"
      switchHref="/verify-email"
      badge="Think Together"
    >
      <ConfirmEmailContent />
    </AuthLayout>
  )
}
