'use client'

import { useEffect, useState, useCallback } from 'react'
import { Timer, CheckCircle, Circle, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import type { QuestionStartedMessage } from '@/features/game-host/types'

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
  const [timeRemaining, setTimeRemaining] = useState(question.timeLimit)

  useEffect(() => {
    setTimeRemaining(question.timeLimit)
  }, [question])

  useEffect(() => {
    if (hasAnswered || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [hasAnswered, timeRemaining])

  const getTimerColor = () => {
    if (timeRemaining <= GAME_PLAYER_CONSTANTS.TIMER.DANGER_THRESHOLD) {
      return 'text-[var(--color-error)] bg-[var(--color-error-light)]'
    }
    if (timeRemaining <= GAME_PLAYER_CONSTANTS.TIMER.WARNING_THRESHOLD) {
      return 'text-[var(--brand-secondary)] bg-[var(--brand-secondary-light)]'
    }
    return 'text-[var(--text-primary)] bg-[var(--bg-surface-secondary)]'
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
          <h2 className="text-xl md:text-2xl font-heading font-bold text-center text-[var(--text-primary)] leading-relaxed">
            {question.content}
          </h2>
          {isMultipleChoice && (
            <p className="mt-2 text-center text-sm text-[var(--text-tertiary)]">
              (Chọn nhiều đáp án)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const colorScheme = GAME_PLAYER_CONSTANTS.ANSWER_COLORS[index] || GAME_PLAYER_CONSTANTS.ANSWER_COLORS[0]
          const isSelected = selectedAnswers.includes(option.index)
          
          return (
            <button
              key={option.index}
              type="button"
              onClick={() => !hasAnswered && onSelectAnswer(option.index)}
              disabled={hasAnswered}
              className={`
                relative flex items-center gap-4 p-5 rounded-xl border-3 transition-all
                ${isSelected 
                  ? `${colorScheme.bg} border-[var(--color-border-main)] ring-4 ${colorScheme.ring} ${colorScheme.text}`
                  : `bg-[var(--bg-surface)] border-[var(--color-border-light)] ${colorScheme.hover} hover:border-[var(--color-border-main)]`
                }
                ${hasAnswered ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
              `}
            >
              {/* Letter indicator */}
              <div className={`
                flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg flex-shrink-0
                ${isSelected ? 'bg-white/30' : colorScheme.bg + ' ' + colorScheme.text}
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              
              {/* Content */}
              <span className={`flex-1 text-left font-medium ${isSelected ? colorScheme.text : 'text-[var(--text-primary)]'}`}>
                {option.content}
              </span>
              
              {/* Selection indicator */}
              <div className="flex-shrink-0">
                {isSelected ? (
                  <CheckCircle className={`h-6 w-6 ${colorScheme.text}`} />
                ) : (
                  <Circle className="h-6 w-6 text-[var(--text-tertiary)]" />
                )}
              </div>
            </button>
          )
        })}
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
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {GAME_PLAYER_CONSTANTS.MESSAGES.WAITING_FOR_RESULT}
          </p>
        </div>
      )}
    </div>
  )
}

