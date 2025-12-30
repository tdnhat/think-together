'use client'

import { Trophy, TrendingUp, Award } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { LeaderboardEntry } from '@/features/game-host/types'

interface PlayerResultsProps {
  playerId: string;
  leaderboard: LeaderboardEntry[];
  className?: string;
}

export function PlayerResults({
  playerId,
  leaderboard,
  className = '',
}: Readonly<PlayerResultsProps>) {
  // Find player's current stats
  const playerEntry = leaderboard.find(entry => entry.playerId === playerId)
  const playerRank = playerEntry?.rank ?? 0
  const playerPoints = playerEntry?.totalPoints ?? 0
  const correctAnswers = playerEntry?.correctAnswers ?? 0
  const accuracy = playerEntry?.accuracyPercentage ?? 0

  // Get top 3 for display
  const topThree = leaderboard.slice(0, 3)

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-amber-600'
      default:
        return 'text-[var(--brand-primary)]'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-12 w-12 text-yellow-500" />
      case 2:
        return <Award className="h-12 w-12 text-gray-400" />
      case 3:
        return <Award className="h-12 w-12 text-amber-600" />
      default:
        return <TrendingUp className="h-12 w-12 text-[var(--brand-primary)]" />
    }
  }

  const getRankBgColor = (rank: number): string => {
    if (rank === 1) return 'bg-yellow-100';
    if (rank === 2) return 'bg-gray-100';
    return 'bg-amber-100';
  };

  return (
    <div className={`space-y-6 max-w-2xl mx-auto ${className}`}>
      {/* Player's Stats */}
      <Card className="bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-secondary)]/5 border-2 border-[var(--brand-primary)]">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Rank Icon */}
            <div className="flex justify-center">
              {getRankIcon(playerRank)}
            </div>

            {/* Rank */}
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Vị trí của bạn</p>
              <p className={`font-heading text-5xl font-bold ${getRankColor(playerRank)}`}>
                #{playerRank}
              </p>
            </div>

            {/* Points */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[var(--color-border-light)]">
              <div>
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Điểm</p>
                <p className="font-heading text-2xl font-bold text-[var(--brand-primary)]">
                  {playerPoints.toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Đúng</p>
                <p className="font-heading text-2xl font-bold text-green-600">
                  {correctAnswers}
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-tertiary)] mb-1">Độ chính xác</p>
                <p className="font-heading text-2xl font-bold text-blue-600">
                  {accuracy.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Leaderboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-[var(--brand-primary)]" />
          <h3 className="font-heading text-lg font-bold text-[var(--text-primary)]">
            Top 3 người chơi
          </h3>
        </div>

        {topThree.map((entry, index) => {
          const isCurrentPlayer = entry.playerId === playerId
          const rank = index + 1

          return (
            <Card 
              key={entry.playerId}
              className={`transition-all ${
                isCurrentPlayer 
                  ? 'bg-[var(--brand-primary)]/10 border-2 border-[var(--brand-primary)]' 
                  : 'bg-[var(--bg-surface-secondary)]'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankBgColor(rank)}`}>
                      <span className={`font-bold ${getRankColor(rank)}`}>
                        #{rank}
                      </span>
                    </div>

                    {/* Player Info */}
                    <div>
                      <p className={`font-semibold ${
                        isCurrentPlayer ? 'text-[var(--brand-primary)]' : 'text-[var(--text-primary)]'
                      }`}>
                        {entry.nickname}
                        {isCurrentPlayer && (
                          <Badge variant="default" className="ml-2 text-xs">Bạn</Badge>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {entry.correctAnswers} đúng
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.accuracyPercentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="font-heading text-2xl font-bold text-[var(--brand-primary)]">
                      {entry.totalPoints.toLocaleString('vi-VN')}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">điểm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Waiting message */}
      <div className="text-center pt-4">
        <p className="text-sm text-[var(--text-secondary)] animate-pulse">
          Chờ câu hỏi tiếp theo...
        </p>
      </div>
    </div>
  )
}
