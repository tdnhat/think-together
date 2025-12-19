'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Gamepad2 } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { PageLayout, PageHeader, PageMain, PageFooter } from '@/shared/components'
import { JoinForm, useJoinGame } from '@/features/game-player'

function JoinPageContent() {
  const searchParams = useSearchParams()
  const initialPin = searchParams.get('pin') || ''
  
  const { isLoading, error, joinGame } = useJoinGame()

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader>
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-[var(--brand-primary)]" />
          <span className="font-heading text-2xl font-bold text-[var(--text-primary)]">
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
        <p>© 2024 ThinkTogether. Học cùng nhau, vui hơn gấp bội!</p>
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
