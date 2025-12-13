'use client'

import { useChallengeStore, selectCurrentQuestionIndex, selectTotalQuestions } from '@/features/challenge/store/challenge.store'

interface ChallengeProgressProps {
  className?: string
}

export function ChallengeProgress({ className = '' }: ChallengeProgressProps) {
  const currentIndex = useChallengeStore(selectCurrentQuestionIndex)
  const totalQuestions = useChallengeStore(selectTotalQuestions)

  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-[var(--bg-surface-secondary)] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question counter */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--text-primary)]">
          Câu {currentIndex + 1} / {totalQuestions}
        </span>
        <span className="text-[var(--text-secondary)]">
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

