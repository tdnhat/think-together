'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Gamepad2 } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { JoinForm, useJoinGame } from '@/features/game-player'

function JoinPageContent() {
  const searchParams = useSearchParams()
  const initialPin = searchParams.get('pin') || ''
  
  const { isLoading, error, joinGame } = useJoinGame()

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <JoinForm
          initialPin={initialPin}
          onJoin={joinGame}
          isLoading={isLoading}
          error={error}
        />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-[var(--text-tertiary)]">
        <p>© 2024 ThinkTogether. Học cùng nhau, vui hơn gấp bội!</p>
      </footer>
    </div>
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
