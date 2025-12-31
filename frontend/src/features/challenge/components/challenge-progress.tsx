'use client'

import { useChallengeStore, selectTotalQuestions } from '@/features/challenge/store/challenge.store'

interface ChallengeProgressProps {
  className?: string
}

export function ChallengeProgress({ className = '' }: ChallengeProgressProps) {
  const totalQuestions = useChallengeStore(selectTotalQuestions)
  const answers = useChallengeStore((s) => s.answers)

  const answeredCount = Object.keys(answers).length
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Progress: <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
        </span>
        <span className="text-muted-foreground">
          <span className="font-medium text-foreground">{answeredCount}</span> of{' '}
          <span className="font-medium text-foreground">{totalQuestions}</span>
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

