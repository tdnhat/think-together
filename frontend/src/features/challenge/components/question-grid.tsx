// filepath: /home/nhat/Documents/Work/Projects/think-together/frontend/src/features/challenge/components/question-grid.tsx
'use client'

import { CheckCircle, Circle, Flag } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { useChallengeStore, selectCurrentQuestionIndex, selectTotalQuestions } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'

interface QuestionGridProps {
  questions: ChallengeQuestionDto[]
  onQuestionClick: (index: number) => void
  onSubmit?: () => void
  isSubmitting?: boolean
  submitDisabled?: boolean
  className?: string
}

export function QuestionGrid({
  questions,
  onQuestionClick,
  onSubmit,
  isSubmitting = false,
  submitDisabled = false,
  className = '',
}: QuestionGridProps) {
  const currentIndex = useChallengeStore(selectCurrentQuestionIndex)
  const totalQuestions = useChallengeStore(selectTotalQuestions)
  const answers = useChallengeStore((s) => s.answers)
  const flaggedQuestions = useChallengeStore((s) => s.flaggedQuestionIds)

  const getQuestionStatus = (question: ChallengeQuestionDto, index: number) => {
    const isAnswered = !!answers[question.id]
    const isFlagged = flaggedQuestions instanceof Set ? flaggedQuestions.has(question.id) : false
    const isCurrent = index === currentIndex

    return { isAnswered, isFlagged, isCurrent }
  }

  // Group questions into rows of 5
  const questionRows = []
  for (let i = 0; i < questions.length; i += 5) {
    questionRows.push(questions.slice(i, i + 5))
  }

  const answeredCount = Object.keys(answers).length

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-semibold text-[var(--text-primary)]">
          Tổng quan câu hỏi
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {questionRows.map((row, rowIndex) =>
            row.map((question, colIndex) => {
              const questionIndex = rowIndex * 5 + colIndex
              const { isAnswered, isFlagged, isCurrent } = getQuestionStatus(question, questionIndex)

              const variant = isCurrent ? 'default' : 'neutral'
              const stateClass = isFlagged
                ? 'bg-[var(--brand-secondary-light)]'
                : isAnswered
                  ? 'bg-[var(--bg-surface-secondary)]'
                  : ''

              return (
                <Button
                  key={question.id}
                  type="button"
                  size="icon"
                  variant={variant}
                  className={`h-10 w-10 ${stateClass}`}
                  onClick={() => onQuestionClick(questionIndex)}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  {questionIndex + 1}
                </Button>
              )
            })
          )}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-[var(--text-primary)]">Bảng chỉ dẫn:</div>
          <div className="space-y-2 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="w-6 justify-center px-0"> </Badge>
              <span>Câu hỏi hiện tại</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Đã trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>Chưa trả lời</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-orange-600" />
              <span>Đánh dấu</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-4 space-y-1 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center justify-between">
            <span>Tổng số câu hỏi:</span>
            <span className="font-medium text-[var(--text-primary)]">{totalQuestions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Đã trả lời:</span>
            <span className="font-medium text-[var(--text-primary)]">{answeredCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Đánh dấu:</span>
            <span className="font-medium text-[var(--text-primary)]">
              {flaggedQuestions instanceof Set ? flaggedQuestions.size : 0}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Còn lại:</span>
            <span className="font-medium text-[var(--text-primary)]">
              {Math.max(0, totalQuestions - answeredCount)}
            </span>
          </div>
        </div>

        {onSubmit && (
          <Button
            variant="default"
            className="w-full"
            onClick={onSubmit}
            disabled={submitDisabled || isSubmitting}
          >
            {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
