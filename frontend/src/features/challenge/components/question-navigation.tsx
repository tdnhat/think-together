'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { useChallengeStore, selectCurrentQuestionIndex, selectTotalQuestions, selectFlaggedQuestions } from '@/features/challenge/store/challenge.store'

interface QuestionNavigationProps {
  onPrevious?: () => void
  onNext?: () => void
  className?: string
}

export function QuestionNavigation({ onPrevious, onNext, className = '' }: QuestionNavigationProps) {
  const currentIndex = useChallengeStore(selectCurrentQuestionIndex)
  const totalQuestions = useChallengeStore(selectTotalQuestions)
  const flaggedQuestions = useChallengeStore(selectFlaggedQuestions)
  const goToPreviousQuestion = useChallengeStore((s) => s.goToPreviousQuestion)
  const goToNextQuestion = useChallengeStore((s) => s.goToNextQuestion)

  const canGoPrevious = currentIndex > 0
  const canGoNext = currentIndex < totalQuestions - 1

  const handlePrevious = () => {
    onPrevious?.()
    goToPreviousQuestion()
  }

  const handleNext = () => {
    onNext?.()
    goToNextQuestion()
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Flagged questions indicator */}
      {flaggedQuestions.size > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            {flaggedQuestions.size} câu được đánh dấu
          </Badge>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Câu trước</span>
        </Button>

        <div className="flex-1 text-center">
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={!canGoNext}
          className="flex-1"
        >
          <span className="mr-1 hidden sm:inline">Câu sau</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

