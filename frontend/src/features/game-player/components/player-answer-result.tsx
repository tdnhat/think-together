'use client'

import { Check, X, TrendingUp, Zap, Clock } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { AnswerResult } from '@/features/game-host/types'
import { GAME_PLAYER_CONSTANTS } from '../constants'

interface PlayerAnswerResultProps {
  result: AnswerResult
  className?: string
}

export function PlayerAnswerResult({
  result,
  className = '',
}: Readonly<PlayerAnswerResultProps>) {
  const isCorrect = result.isCorrect

  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] ${className}`}>
      <Card className="max-w-md w-full overflow-hidden">
        {/* Result Header */}
        <div className={`p-8 text-center ${
          isCorrect 
            ? 'bg-gradient-to-br from-green-400 to-green-600' 
            : 'bg-gradient-to-br from-red-400 to-red-600'
        }`}>
          <div className="mb-4">
            {isCorrect ? (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <Check className="h-12 w-12 text-white" />
              </div>
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                <X className="h-12 w-12 text-white" />
              </div>
            )}
          </div>
          <h2 className="font-heading text-3xl font-bold text-white">
            {isCorrect 
              ? GAME_PLAYER_CONSTANTS.MESSAGES.CORRECT_ANSWER 
              : GAME_PLAYER_CONSTANTS.MESSAGES.WRONG_ANSWER}
          </h2>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Points Earned */}
          <div className="text-center py-4 border-b border-[var(--color-border-light)]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-6 w-6 text-[var(--brand-secondary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Điểm nhận được</span>
            </div>
            <span className={`font-heading text-4xl font-bold ${
              isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--text-tertiary)]'
            }`}>
              +{result.pointsEarned.toLocaleString('vi-VN')}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Total Points */}
            <div className="text-center p-4 bg-[var(--bg-surface-secondary)] rounded-xl">
              <TrendingUp className="h-5 w-5 mx-auto text-[var(--brand-primary)] mb-1" />
              <div className="text-sm text-[var(--text-secondary)]">Tổng điểm</div>
              <div className="font-heading text-xl font-bold text-[var(--text-primary)]">
                {result.totalPoints.toLocaleString('vi-VN')}
              </div>
            </div>

            {/* Current Rank */}
            <div className="text-center p-4 bg-[var(--bg-surface-secondary)] rounded-xl">
              <Badge variant="default" className="mb-1 mx-auto">
                #{result.currentRank}
              </Badge>
              <div className="text-sm text-[var(--text-secondary)]">Xếp hạng</div>
              <div className="font-heading text-xl font-bold text-[var(--text-primary)]">
                Hạng {result.currentRank}
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Clock className="h-4 w-4" />
            <span>Thời gian trả lời: {(result.responseTimeMs / 1000).toFixed(1)}s</span>
          </div>

          {/* Waiting Message */}
          <div className="text-center pt-4 border-t border-[var(--color-border-light)]">
            <p className="text-[var(--text-secondary)]">
              {GAME_PLAYER_CONSTANTS.MESSAGES.WAITING_FOR_NEXT}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

