'use client'

import {
  LoginForm,
  FloatingStationery
} from '@/features/auth'
import { AuthBackground } from '@/features/auth/components/auth-background'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'
import { UI } from '@/config/constants'

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // NOTE: Integrate Google OAuth login when backend support is ready.
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 overflow-hidden">
      <AuthBackground />

      <FloatingStationery />

      <div className="flex w-full max-w-sm flex-col gap-6 z-10">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <img src={UI.BRAND.ICON_PATH} alt="Logo" className="size-4 invert brightness-0" />
          </div>
          {AUTH_BRAND_NAME}
        </a>
        <LoginForm onGoogleLogin={handleGoogleLogin} />
      </div>
    </div>
  )
}
