'use client'

import { useEffect, useState, useCallback } from 'react'
import { Timer, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { GAME_CONSTANTS } from '@/features/game'
import type { QuestionStartedMessage } from '@/features/game-host/types'
import { VideoPlayer } from '@/shared/components/video-player'
import { AudioPlayer } from '@/shared/components/audio-player'
import { QuestionNumberBadge } from '@/shared/components/question-number-badge'
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
  // Calculate remaining time based on endTime for accurate sync across clients
  const calculateRemainingTime = useCallback(() => {
    if (!question.endTime) {
      return question.timeLimit
    }
    const endTimeMs = new Date(question.endTime).getTime()
    return Math.max(0, Math.floor((endTimeMs - Date.now()) / 1000))
  }, [question.endTime, question.timeLimit])

  const [timeRemaining, setTimeRemaining] = useState(calculateRemainingTime)

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(calculateRemainingTime())
  }, [question.gameQuestionId, calculateRemainingTime])

  // Timer countdown using endTime for synchronization
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

  const getTimerColor = () => {
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

  // For Matching/Ordering, validation depends on if we have valid answers
  const canSubmit = selectedAnswers.length > 0 && !hasAnswered && !isSubmitting

  return (
    <div className={`space-y-4 max-w-3xl mx-auto ${className}`}>

      {/* Question Card modeled after QuestionDisplay */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4 bg-muted/20">
          <div className="flex items-start gap-4 justify-between">
            <div className="flex items-start gap-3 flex-1">
              <QuestionNumberBadge number={question.positionInGame + 1} variant="default" />
              <div className="min-w-0 flex-1 pt-1">
                <CardTitle className="text-xl leading-snug font-heading">
                  {question.content}
                </CardTitle>
              </div>
            </div>

            {/* Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm shrink-0 border ${getTimerColor()}`}>
              <Timer className="h-4 w-4" />
              <span className="tabular-nums">{timeRemaining}s</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
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

          {isMultipleChoice && (
            <div className="text-center">
              <Badge variant="outline" className="text-muted-foreground font-normal">
                Chọn nhiều đáp án
              </Badge>
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
        </CardContent>
      </Card>

      {/* Submit Button */}
      {!hasAnswered && (
        <Button
          variant="default"
          size="lg"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all"
        >
          {isSubmitting ? GAME_PLAYER_CONSTANTS.MESSAGES.SUBMITTING : 'Xác nhận câu trả lời'}
        </Button>
      )}

      {/* Answered State */}
      {hasAnswered && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-3">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">Đã gửi câu trả lời</h3>
            <p className="text-muted-foreground">
              {GAME_PLAYER_CONSTANTS.MESSAGES.WAITING_FOR_RESULT}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
