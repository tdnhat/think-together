'use client'

/**
 * Challenge Timer Display
 * Wrapper around shared TimerDisplay component that connects to challenge store
 * @deprecated Use shared TimerDisplay component with your own state management
 */

import { TimerDisplay as SharedTimerDisplay } from '@/shared/components'
import { useChallengeStore, selectRemainingTime } from '@/features/challenge/store/challenge.store'

interface TimerDisplayProps {
  className?: string
}

/**
 * Legacy challenge timer display component
 * This is now a wrapper around the shared TimerDisplay component
 */
export function TimerDisplay({ className = '' }: TimerDisplayProps) {
  const remainingTimeMs = useChallengeStore(selectRemainingTime)

  return <SharedTimerDisplay remainingTimeMs={remainingTimeMs} className={className} />
}

