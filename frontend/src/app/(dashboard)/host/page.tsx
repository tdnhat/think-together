'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { CreatorRouteGuard } from '@/shared/components/creator-route-guard'
import {
  HostLobby,
  HostGameScreen,
  HostPageLoading,
  HostPageError,
  HostPageResumeOption,
  HostPageNoQuiz,
  useHostGame,
  getStoredHostSession,
} from '@/features/game-host'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'

function HostPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams.get('quizId')
  const sessionIdParam = searchParams.get('sessionId')

  const {
    session,
    phase,
    isLoading,
    error,
    createSession,
    resumeSession,
    abandonSession,
    startGame,
  } = useHostGame({ quizId: quizId ?? undefined, sessionId: sessionIdParam ?? undefined })

  // Check for stored session
  const storedSession = typeof window !== 'undefined' ? getStoredHostSession() : null
  const showResumeOption = !session && storedSession && (
    !quizId || storedSession.quizSetId === quizId
  )

  // Auto-create session if quizId is provided and no session exists
  // The module-level guard in createSession prevents duplicate calls
  useEffect(() => {
    if (quizId && !session && !isLoading && !showResumeOption && !error) {
      createSession()
    }
  }, [quizId, session, isLoading, showResumeOption, error, createSession])

  const handleGoBack = () => {
    router.push(ROUTES.quiz.list)
  }

  const handleStartFresh = async () => {
    await abandonSession()
    if (quizId) {
      await createSession()
    }
  }


  // Loading state
  if (isLoading) {
    return <HostPageLoading />
  }

  // Show resume option
  if (showResumeOption && storedSession) {
    return (
      <HostPageResumeOption
        storedSession={storedSession}
        isLoading={isLoading}
        error={error}
        onResume={() => resumeSession(storedSession.sessionId)}
        onStartFresh={handleStartFresh}
      />
    )
  }

  // Error state (no active session)
  if (error && !session) {
    return (
      <HostPageError
        error={error}
        quizId={quizId}
        onRetry={handleStartFresh}
      />
    )
  }

  // No quiz selected - show options
  if (!quizId && !session) {
    return (
      <HostPageNoQuiz
        error={error}
        onRejoinByPin={async (pin: string) => {
          // Get session by pin and resume
          const { gameSessionService } = await import('@/features/game-host')
          const response = await gameSessionService.getSessionByPin(pin)
          if (response.success && response.data) {
            resumeSession(response.data.id)
          }
        }}
      />
    )
  }

  // Session not ready
  if (!session) {
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Render based on phase
  if (phase === 'lobby' || phase === 'idle') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Phòng chờ
          </h1>
        </div>

        <HostLobby session={session} />
      </div>
    )
  }

  // Game in progress or ended
  return (
    <div className="space-y-6">
      <HostGameScreen session={session} />
    </div>
  )
}

export default function HostPage() {
  return (
    <DashboardLayout>
      <CreatorRouteGuard>
        <Suspense fallback={
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        }>
          <HostPageContent />
        </Suspense>
      </CreatorRouteGuard>
    </DashboardLayout>
  )
}
