/**
 * Player Page Error Component
 */

'use client'

import { Gamepad2, AlertCircle, ArrowLeft } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'

interface PlayerPageErrorProps {
  error: string
  onGoBack?: () => void
}

export function PlayerPageError({ error, onGoBack }: PlayerPageErrorProps) {
  const router = useRouter()

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack()
    } else {
      router.push(ROUTES.game.join)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      <header className="py-6 px-4">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-[var(--brand-primary)]" />
            <span className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              ThinkTogether
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="neutral" onClick={handleGoBack} className="mt-4 gap-2">
          <ArrowLeft className="h-5 w-5" />
          Quay lại
        </Button>
      </main>
    </div>
  )
}

