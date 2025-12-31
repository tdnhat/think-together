/**
 * Host Page Loading Component
 */

'use client'

import { Loader2 } from 'lucide-react'
import { GAME_HOST_CONSTANTS } from '../constants'

export function HostPageLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg text-muted-foreground">
        {GAME_HOST_CONSTANTS.MESSAGES.LOADING}
      </p>
    </div>
  )
}

