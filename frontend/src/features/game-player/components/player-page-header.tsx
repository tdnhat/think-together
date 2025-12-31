/**
 * Player Page Header Component
 */

'use client'

import { Gamepad2 } from 'lucide-react'

interface PlayerPageHeaderProps {
  nickname: string | null
}

export function PlayerPageHeader({ nickname }: PlayerPageHeaderProps) {
  return (
    <header className="py-4 px-4 border-b border-border">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground">
            ThinkTogether
          </span>
        </div>
        {nickname && (
          <div className="text-sm text-muted-foreground">
            {nickname}
          </div>
        )}
      </div>
    </header>
  )
}

