'use client'

import { Flag } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { useChallengeStore, selectCurrentQuestion } from '@/features/challenge/store/challenge.store'
import { useFlagQuestion } from '@/features/challenge/hooks'

interface FlagButtonProps {
  attemptId: string
  className?: string
}

export function FlagButton({ attemptId, className = '' }: FlagButtonProps) {
  const question = useChallengeStore(selectCurrentQuestion)
  const isFlagged = useChallengeStore((s) => question ? s.isFlagged(question.id) : false)
  const { mutate: flagQuestion, isPending } = useFlagQuestion()

  if (!question) return null

  const handleToggleFlag = () => {
    flagQuestion({
      attemptId,
      questionId: question.id,
      isFlagged: !isFlagged,
    })
  }

  return (
    <Button
      variant={isFlagged ? 'default' : 'neutral'}
      size="sm"
      onClick={handleToggleFlag}
      disabled={isPending}
      title={isFlagged ? 'Bỏ đánh dấu câu này' : 'Đánh dấu để xem lại sau'}
      className={className}
    >
      <Flag className={`h-4 w-4 ${isFlagged ? 'fill-current' : ''}`} />
      <span className="ml-1 hidden sm:inline">
        {isFlagged ? 'Đã đánh dấu' : 'Đánh dấu'}
      </span>
    </Button>
  )
}

