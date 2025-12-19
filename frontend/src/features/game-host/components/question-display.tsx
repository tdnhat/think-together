'use client'

import { useEffect, useState, useCallback } from 'react'
import { Timer, Users, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { GAME_HOST_CONSTANTS } from '../constants'
import type { GameQuestion, QuestionStartedMessage } from '../types'

interface QuestionDisplayProps {
  question: GameQuestion | QuestionStartedMessage
  totalQuestions: number
  answeredCount?: number
  totalPlayers?: number
  onTimeEnd?: () => void
  showTimer?: boolean
  showOptions?: boolean
  className?: string
}

export function QuestionDisplay({
  question,
  totalQuestions,
  answeredCount = 0,
  totalPlayers = 0,
  onTimeEnd,
  showTimer = true,
  showOptions = true,
  className = '',
}: Readonly<QuestionDisplayProps>) {
  // Calculate remaining time based on endTime for accurate sync
  const calculateRemainingTime = useCallback(() => {
    // Check if question has endTime (QuestionStartedMessage)
    if ('endTime' in question && question.endTime) {
      const endTimeMs = new Date(question.endTime).getTime()
      return Math.max(0, Math.floor((endTimeMs - Date.now()) / 1000))
    }
    return question.timeLimit
  }, [question])

  const [timeRemaining, setTimeRemaining] = useState(calculateRemainingTime)
  const [timerActive, setTimerActive] = useState(true)

  const handleTimeEnd = useCallback(() => {
    setTimerActive(false)
    onTimeEnd?.()
  }, [onTimeEnd])

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(calculateRemainingTime())
    setTimerActive(true)
  }, [question, calculateRemainingTime])

  // Timer countdown using endTime for synchronization
  useEffect(() => {
    if (!showTimer || !timerActive || timeRemaining <= 0) {
      if (timeRemaining <= 0 && timerActive) {
        handleTimeEnd()
      }
      return
    }

    const interval = setInterval(() => {
      const remaining = calculateRemainingTime()
      setTimeRemaining(remaining)

      if (remaining <= 0) {
        handleTimeEnd()
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [showTimer, timerActive, calculateRemainingTime, handleTimeEnd, timeRemaining])

  const getTimerColor = () => {
    if (timeRemaining <= GAME_HOST_CONSTANTS.TIMER.DANGER_THRESHOLD) {
      return 'text-[var(--color-error)]'
    }
    if (timeRemaining <= GAME_HOST_CONSTANTS.TIMER.WARNING_THRESHOLD) {
      return 'text-[var(--brand-secondary)]'
    }
    return 'text-[var(--text-primary)]'
  }

  const questionPosition = 'positionInGame' in question ? question.positionInGame + 1 : 1
  const options = question.options || []

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="default" className="text-sm gap-1">
          <HelpCircle className="h-4 w-4" />
          Câu {questionPosition}/{totalQuestions}
        </Badge>

        <div className="flex items-center gap-4">
          {totalPlayers > 0 && (
            <Badge variant="neutral" className="gap-1">
              <Users className="h-4 w-4" />
              {answeredCount}/{totalPlayers}
            </Badge>
          )}

          {showTimer && (
            <Badge variant="neutral" className={`gap-1 text-lg font-bold ${getTimerColor()}`}>
              <Timer className="h-5 w-5" />
              {timeRemaining}s
            </Badge>
          )}
        </div>
      </div>

      {/* Question Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-[var(--text-primary)] leading-relaxed">
            {question.content}
          </h2>
        </CardContent>
      </Card>

      {/* Options Grid */}
      {showOptions && options.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => {
            const colorScheme = GAME_HOST_CONSTANTS.ANSWER_COLORS[index] || GAME_HOST_CONSTANTS.ANSWER_COLORS[0]
            
            return (
              <Card
                key={option.index}
                className={`${colorScheme.bg} border-0 overflow-hidden transition-transform hover:scale-[1.02]`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 font-bold text-lg">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className={`text-lg font-medium ${colorScheme.text}`}>
                      {option.content}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

