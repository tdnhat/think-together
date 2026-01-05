'use client'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Flag } from 'lucide-react'
import { AudioPlayer, VideoPlayer, QuestionNumberBadge } from '@/shared/components'
import { useChallengeStore, selectCurrentQuestion, selectCurrentQuestionIndex } from '@/features/challenge/store/challenge.store'
import { ChoiceQuestion } from './question-types/choice-question'
import { TrueFalseQuestion } from './question-types/true-false-question'
import { MatchingQuestion } from './question-types/matching-question'
import { OrderingQuestion } from './question-types/ordering-question'

interface QuestionDisplayProps {
  onAnswerChange?: (
    answer:
      | number[]
      | Array<[number, number]>
      | Array<[string, number]>
      | Array<{ leftContent: string; rightContent: string }>
      | Array<{ content: string; position: number }>
  ) => void
  className?: string
}

export function QuestionDisplay({ onAnswerChange, className = '' }: Readonly<QuestionDisplayProps>) {
  const question = useChallengeStore(selectCurrentQuestion)
  const currentQuestionIndex = useChallengeStore(selectCurrentQuestionIndex)
  const toggleFlagQuestion = useChallengeStore((s) => s.toggleFlagQuestion)
  const isFlagged = useChallengeStore((s) => (question ? s.isFlagged(question.id) : false))
  const currentAttempt = useChallengeStore((s) => s.currentAttempt)
  const isCompleted = currentAttempt?.status === 'Completed'

  if (!question) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Không có câu hỏi để hiển thị</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex items-start gap-3">
          <QuestionNumberBadge number={currentQuestionIndex + 1} variant="compact" />
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base leading-snug">{question.content}</CardTitle>
          </div>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10"
              onClick={() => toggleFlagQuestion(question.id)}
              disabled={isCompleted}
              aria-pressed={isFlagged}
              title={isFlagged ? 'Bỏ đánh dấu' : 'Đánh dấu'}
            >
              <Flag className={isFlagged ? 'text-orange-600' : ''} />
            </Button>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        {/* Video display for Video questions */}
        {question.type === 'Video' && question.videoUrl && (
          <div className="mb-6">
            <VideoPlayer
              url={question.videoUrl}
              startTime={question.videoTimestamp || 0}
            />
          </div>
        )}

        {/* Audio display for Audio questions */}
        {question.type === 'Audio' && question.audioUrl && (
          <div className="mb-6">
            <AudioPlayer
              src={question.audioUrl}
              startTime={question.audioTimestamp || 0}
            />
          </div>
        )}

        {question.type === 'SingleChoice' || question.type === 'MultipleChoice' || question.type === 'Video' || question.type === 'Audio' ? (
          <ChoiceQuestion key={question.id} question={question} onAnswerChange={onAnswerChange as (answer: number[]) => void} />
        ) : question.type === 'TrueFalse' ? (
          <TrueFalseQuestion key={question.id} question={question} onAnswerChange={onAnswerChange as (answer: number[]) => void} />
        ) : question.type === 'Matching' ? (
          <MatchingQuestion key={question.id} question={question} onAnswerChange={onAnswerChange as (answer: Array<{ leftContent: string; rightContent: string }>) => void} />
        ) : question.type === 'Ordering' ? (
          <OrderingQuestion key={question.id} question={question} onAnswerChange={onAnswerChange as (answer: Array<{ content: string; position: number }>) => void} />
        ) : null}
      </CardContent>
    </Card>
  )
}
