'use client'

import { useEffect, useState, useCallback } from 'react'
import { Timer, CheckCircle, Circle, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { GAME_CONSTANTS } from '@/features/game'
import type { QuestionStartedMessage } from '@/features/game-host/types'
import { AnswerOption } from './answer-option'

interface PlayerQuestionProps {
  question: QuestionStartedMessage
  selectedAnswers: number[]
  hasAnswered: boolean
  onSelectAnswer: (index: number) => void
  onSubmit: () => void
  isSubmitting?: boolean
  className?: string
}

export function PlayerQuestion({
  question,
  selectedAnswers,
  hasAnswered,
  onSelectAnswer,
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
  const canSubmit = selectedAnswers.length > 0 && !hasAnswered && !isSubmitting

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Timer and Question Number */}
      <div className="flex items-center justify-between">
        <Badge variant="default" className="gap-1">
          <HelpCircle className="h-4 w-4" />
          Câu {question.positionInGame + 1}/{question.totalQuestions}
        </Badge>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${getTimerColor()}`}>
          <Timer className="h-5 w-5" />
          <span className="text-xl tabular-nums">{timeRemaining}s</span>
        </div>
      </div>

      {/* Question Content */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-center text-foreground leading-relaxed">
            {question.content}
          </h2>
          {isMultipleChoice && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              (Chọn nhiều đáp án)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <AnswerOption
            key={option.index}
            index={index}
            content={option.content}
            isSelected={selectedAnswers.includes(option.index)}
            hasAnswered={hasAnswered}
            onSelect={() => !hasAnswered && onSelectAnswer(option.index)}
          />
        ))}
      </div>

      {/* Submit Button */}
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

      {/* Answered State */}
      {hasAnswered && (
        <div className="text-center py-4">
          <Badge variant="default" className="text-lg py-2 px-4 gap-2">
            <CheckCircle className="h-5 w-5" />
            Đã gửi câu trả lời
          </Badge>
          <p className="mt-2 text-sm text-muted-foreground">
            {GAME_PLAYER_CONSTANTS.MESSAGES.WAITING_FOR_RESULT}
          </p>
        </div>
      )}
    </div>
  )
}

