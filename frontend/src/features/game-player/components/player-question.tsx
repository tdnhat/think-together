'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { GAME_CONSTANTS } from '@/features/game'
import type { QuestionStartedMessage } from '@/features/game-host/types'
import { VideoPlayer } from '@/shared/components/video-player'
import { AudioPlayer } from '@/shared/components/audio-player'
import { QuestionCardWrapper } from '@/shared/components/question/question-card-wrapper'
import { OrderingAnswer } from './ordering-answer'
import { MatchingAnswer } from './matching-answer'
import { ChoiceAnswer } from './choice-answer'

interface PlayerQuestionProps {
  question: QuestionStartedMessage
  selectedAnswers: number[]
  hasAnswered: boolean
  onSelectAnswer: (index: number) => void
  onSetSelectedAnswers: (indices: number[]) => void
  onSubmit: () => void
  isSubmitting?: boolean
  className?: string
}

export function PlayerQuestion({
  question,
  selectedAnswers,
  hasAnswered,
  onSelectAnswer,
  onSetSelectedAnswers,
  onSubmit,
  isSubmitting = false,
  className = '',
}: Readonly<PlayerQuestionProps>) {
  // Calculate remaining time
  const calculateRemainingTime = useCallback(() => {
    if (!question.endTime) {
      return question.timeLimit
    }
    const endTimeMs = new Date(question.endTime).getTime()
    return Math.max(0, Math.floor((endTimeMs - Date.now()) / 1000))
  }, [question.endTime, question.timeLimit])

  const [timeRemaining, setTimeRemaining] = useState(calculateRemainingTime)

  useEffect(() => {
    setTimeRemaining(calculateRemainingTime())
  }, [question.gameQuestionId, calculateRemainingTime])

  useEffect(() => {
    if (hasAnswered || timeRemaining <= 0) return

    const interval = setInterval(() => {
      const remaining = calculateRemainingTime()
      setTimeRemaining(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [hasAnswered, calculateRemainingTime, timeRemaining])

  const getTimerColorClass = () => {
    if (timeRemaining <= GAME_CONSTANTS.TIMER.DANGER_THRESHOLD) {
      return 'text-destructive bg-red-50 dark:bg-red-950/30'
    }
    if (timeRemaining <= GAME_CONSTANTS.TIMER.WARNING_THRESHOLD) {
      return 'text-secondary bg-secondary/10'
    }
    return 'text-foreground bg-muted'
  }

  const isMultipleChoice = question.questionType === '2' || question.questionType === 'MultipleChoice'
  const isMatching = question.questionType === '4' || question.questionType === 'Matching'
  const isOrdering = question.questionType === '5' || question.questionType === 'Ordering'

  const canSubmit = selectedAnswers.length > 0 && !hasAnswered && !isSubmitting

  return (
    <div className={`space-y-4 max-w-3xl mx-auto ${className}`}>

      <QuestionCardWrapper
        questionNumber={question.positionInGame + 1}
        content={question.content}
        timerValue={timeRemaining}
        timerColorClass={getTimerColorClass()}
      >
        {/* Media */}
        {question.videoUrl && (
          <div className="rounded-lg overflow-hidden border bg-black aspect-video max-w-2xl mx-auto shadow-sm">
            <VideoPlayer
              url={question.videoUrl}
              autoPlay={true}
              startTime={question.videoTimestamp || 0}
            />
          </div>
        )}

        {question.audioUrl && (
          <div className="max-w-xl mx-auto p-4 bg-muted/30 rounded-lg border">
            <AudioPlayer
              src={question.audioUrl}
              autoPlay={true}
              startTime={question.audioTimestamp || 0}
            />
          </div>
        )}

        {/* Answer Components */}
        <div className="mt-4">
          {isMatching ? (
            <MatchingAnswer
              leftItems={question.matchingLeft || []}
              rightItems={question.matchingRight || []}
              hasAnswered={hasAnswered}
              onAnswersChange={onSetSelectedAnswers}
            />
          ) : isOrdering ? (
            <OrderingAnswer
              items={question.orderingItems || []}
              hasAnswered={hasAnswered}
              onAnswersChange={onSetSelectedAnswers}
            />
          ) : (
            <ChoiceAnswer
              options={question.options || []}
              selectedIndexes={selectedAnswers}
              isMultiple={isMultipleChoice}
              hasAnswered={hasAnswered}
              onAnswerChange={onSelectAnswer}
            />
          )}
        </div>
      </QuestionCardWrapper>

      {!hasAnswered && (
        <Button
          variant="default"
          size="lg"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full"
        >
          {isSubmitting ? GAME_PLAYER_CONSTANTS.MESSAGES.SUBMITTING : 'Xác nhận câu trả lời'}
        </Button>
      )}

      {hasAnswered && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-1">Đã gửi câu trả lời</h3>
            <p className="text-sm text-muted-foreground">
              {GAME_PLAYER_CONSTANTS.MESSAGES.WAITING_FOR_RESULT}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
