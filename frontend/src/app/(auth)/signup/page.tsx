'use client'

import { GalleryVerticalEnd } from "lucide-react"
import {
  SignupForm,
  FloatingStationery
} from '@/features/auth'
import { AuthBackground } from '@/features/auth/components/auth-background'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'
import { UI } from '@/config/constants'

export default function SignupPage() {
  const handleGoogleSignup = () => {
    // NOTE: Integrate Google OAuth signup when backend support is ready.
    console.log("Google signup clicked")
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
        <SignupForm onGoogleSignup={handleGoogleSignup} />
      </div>
    </div>
  )
}
