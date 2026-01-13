'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Gamepad2 } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { PageLayout, PageHeader, PageMain, PageFooter } from '@/shared/components'
import { JoinForm, useJoinGame } from '@/features/game-player'
import { ROUTES } from '@/config/routes'

function JoinPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialPin = searchParams.get('pin') || ''

  const { isLoading, error, joinGame, tryReconnect } = useJoinGame()
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Check for stored session on mount
  useEffect(() => {
    const checkStoredSession = async () => {
      if (!initialPin) {
        setIsCheckingSession(false)
        return
      }

      try {
        const storedSession = await tryReconnect(initialPin)
        if (storedSession) {
          // Found valid stored session - redirect to play page
          router.push(ROUTES.game.playWithPin(initialPin))
          return
        }
      } catch {
        // Failed to reconnect, continue to join form
      }

      setIsCheckingSession(false)
    }

    checkStoredSession()
  }, [initialPin, tryReconnect, router])

  // Show loading while checking stored session
  if (isCheckingSession) {
    return (
      <PageLayout>
        <PageMain centered>
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Đang kiểm tra phiên...</p>
          </div>
        </PageMain>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader>
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="font-heading text-2xl font-bold text-foreground">
            ThinkTogether
          </span>
        </div>
      </PageHeader>

      {/* Main Content */}
      <PageMain centered>
        <JoinForm
          initialPin={initialPin}
          onJoin={joinGame}
          isLoading={isLoading}
          error={error}
        />
      </PageMain>

      {/* Footer */}
      <PageFooter>
        <p>© 2025 ThinkTogether. Học cùng nhau, vui hơn gấp bội!</p>
      </PageFooter>
    </PageLayout>
  )
}

export default function JoinPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <JoinPageContent />
    </Suspense>
  )
}
