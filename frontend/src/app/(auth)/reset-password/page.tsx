'use client'

import { Suspense } from 'react'
import {
  ResetPasswordForm,
  FloatingStationery
} from '@/features/auth'
import { AUTH_BRAND_NAME } from '@/features/auth/constants'
import { UI } from '@/config/constants'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

function ResetPasswordFormWrapper() {
  return <ResetPasswordForm />
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_10%,hsl(var(--primary)/0.1),transparent)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_75%,hsl(var(--secondary)/0.1),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_80%,hsl(var(--primary)/0.1),transparent)] opacity-40" />
      </div>

      <FloatingStationery />

      <div className="flex w-full max-w-sm flex-col gap-6 z-10">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <img src={UI.BRAND.ICON_PATH} alt="Logo" className="size-4 invert brightness-0" />
          </div>
          {AUTH_BRAND_NAME}
        </a>
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center space-y-4 py-8 bg-card rounded-xl border shadow-sm p-6">
            <LoadingSpinner size="lg" />
            <p className="text-center text-foreground/70">Đang tải...</p>
          </div>
        }>
          <ResetPasswordFormWrapper />
        </Suspense>
      </div>
    </div>
  )
}
