'use client'

import { Clock } from 'lucide-react'
import { useChallengeStore, selectRemainingTime } from '@/features/challenge/store/challenge.store'
import { CHALLENGE_CONSTANTS } from '@/features/challenge/constants'

interface TimerDisplayProps {
  className?: string
}

export function TimerDisplay({ className = '' }: TimerDisplayProps) {
  const remainingTimeMs = useChallengeStore(selectRemainingTime)

  const minutes = Math.floor(remainingTimeMs / 60000)
  const seconds = Math.floor((remainingTimeMs % 60000) / 1000)
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  // Determine color based on time remaining
  const isWarning = remainingTimeMs <= CHALLENGE_CONSTANTS.TIMER.WARNING_THRESHOLD
  const isCritical = remainingTimeMs <= CHALLENGE_CONSTANTS.TIMER.CRITICAL_THRESHOLD

  let colorClass = 'text-[var(--text-primary)]'
  if (isCritical) {
    colorClass = 'text-red-500 animate-pulse'
  } else if (isWarning) {
    colorClass = 'text-orange-500'
  }

  return (
    <div className={`flex items-center gap-2 font-mono ${colorClass} ${className}`}>
      <Clock className="h-5 w-5" />
      <span className="text-lg font-semibold">{timeString}</span>
    </div>
  )
}

