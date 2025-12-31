'use client'

import { Check, X, Users, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { GAME_HOST_CONSTANTS } from '../constants'
import type { QuestionEndedMessage, QuestionStartedMessage } from '../types'

interface QuestionResultProps {
  result: QuestionEndedMessage
  question: QuestionStartedMessage
  className?: string
}

export function QuestionResult({
  result,
  question,
  className = '',
}: Readonly<QuestionResultProps>) {
  const totalAnswers = result.correctAnswerCount + result.wrongAnswerCount
  const correctPercentage = totalAnswers > 0 
    ? Math.round((result.correctAnswerCount / totalAnswers) * 100) 
    : 0

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Check className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <div className="font-heading text-2xl font-bold text-green-600">
              {result.correctAnswerCount}
            </div>
            <div className="text-sm text-muted-foreground">Trả lời đúng</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <X className="mx-auto h-8 w-8 text-destructive mb-2" />
            <div className="font-heading text-2xl font-bold text-destructive">
              {result.wrongAnswerCount}
            </div>
            <div className="text-sm text-muted-foreground">Trả lời sai</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="mx-auto h-8 w-8 text-primary mb-2" />
            <div className="font-heading text-2xl font-bold text-primary">
              {totalAnswers}
            </div>
            <div className="text-sm text-muted-foreground">Tổng số</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-secondary mb-2" />
            <div className="font-heading text-2xl font-bold text-secondary">
              {correctPercentage}%
            </div>
            <div className="text-sm text-muted-foreground">Tỷ lệ đúng</div>
          </CardContent>
        </Card>
      </div>

      {/* Question with Correct Answers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{question.content}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, index) => {
              const isCorrect = result.correctOptionIndexes.includes(option.index)
              const colorScheme = GAME_HOST_CONSTANTS.ANSWER_COLORS[index] || GAME_HOST_CONSTANTS.ANSWER_COLORS[0]

              return (
                <div
                  key={option.index}
                  className={`flex items-center gap-3 rounded-xl border-3 p-4 transition-all ${
                    isCorrect
                      ? 'border-green-600 bg-green-50 dark:bg-green-950/30'
                      : 'border-border bg-muted opacity-60'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colorScheme.bg} ${colorScheme.text} font-bold`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 font-medium text-foreground">
                    {option.content}
                  </span>
                  {isCorrect && (
                    <Badge variant="default" className="bg-green-600 gap-1">
                      <Check className="h-4 w-4" />
                      Đúng
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Players */}
      {result.topPlayers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top người chơi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.topPlayers.slice(0, 5).map((player, index) => (
                <div
                  key={player.playerId}
                  className="flex items-center justify-between rounded-lg border-2 border-border bg-muted p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground">
                      {player.nickname}
                    </span>
                  </div>
                  <span className="font-heading font-bold text-primary">
                    {player.totalPoints.toLocaleString('vi-VN')} điểm
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

