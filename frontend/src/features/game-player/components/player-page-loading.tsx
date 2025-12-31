/**
 * Player Page Loading Component
 */

'use client'

import { Gamepad2 } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

export function PlayerPageLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="py-6 px-4">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="font-heading text-2xl font-bold text-foreground">
              ThinkTogether
            </span>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </main>
    </div>
  )
}

