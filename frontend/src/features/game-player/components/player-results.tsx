'use client'

import { Trophy, TrendingUp, Award, Target } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { useCountUp } from '@/shared/hooks/use-count-up'
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
  const playerEntry = leaderboard.find(entry => entry.playerId === playerId)
  const playerRank = playerEntry?.rank ?? 0
  const playerPoints = playerEntry?.totalPoints ?? 0
  const correctAnswers = playerEntry?.correctAnswers ?? 0
  const accuracy = playerEntry?.accuracyPercentage ?? 0

  const pointsCount = useCountUp({ end: playerPoints, duration: 1500 })
  const correctCount = useCountUp({ end: correctAnswers, duration: 1500 })
  const accuracyCount = useCountUp({ end: accuracy, duration: 1500, decimals: 0 })

  const topThree = leaderboard.slice(0, 3)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-12 w-12 text-yellow-500" />
      case 2:
        return <Award className="h-12 w-12 text-gray-400" />
      case 3:
        return <Award className="h-12 w-12 text-amber-600" />
      default:
        return <TrendingUp className="h-12 w-12 text-primary" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500'
      case 2:
        return 'text-gray-400'
      case 3:
        return 'text-amber-600'
      default:
        return 'text-primary'
    }
  }

  return (
    <div className={`space-y-6 max-w-2xl mx-auto ${className}`}>
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              {getRankIcon(playerRank)}
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Vị trí của bạn</p>
              <p className={`font-heading text-6xl font-bold ${getRankColor(playerRank)}`}>
                #{playerRank}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Điểm</p>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-primary">
                    {pointsCount.toLocaleString('vi-VN')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="mx-auto h-4 w-4 text-green-600 mb-1" />
                  <p className="text-xs text-muted-foreground mb-1">Đúng</p>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-green-600">
                    {correctCount.toLocaleString('vi-VN')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Chính xác</p>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-blue-600">
                    {accuracyCount.toFixed(0)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-bold">
            Top 3 người chơi
          </h3>
        </div>

        {topThree.map((entry, index) => {
          const isCurrentPlayer = entry.playerId === playerId
          const rank = index + 1

          return (
            <Card 
              key={entry.playerId}
              className={isCurrentPlayer ? 'border-primary' : ''}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getRankColor(rank)}`}>
                      <span className={`font-heading font-bold text-base ${getRankColor(rank)}`}>
                        #{rank}
                      </span>
                    </div>

                    <div>
                      <p className={`font-semibold ${isCurrentPlayer ? 'text-primary' : ''}`}>
                        {entry.nickname}
                        {isCurrentPlayer && (
                          <Badge variant="default" className="ml-2 text-xs">Bạn</Badge>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs">
                          {entry.correctAnswers} đúng
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.accuracyPercentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-heading text-2xl font-bold text-primary">
                      {entry.totalPoints.toLocaleString('vi-VN')}
                    </p>
                    <p className="text-xs text-muted-foreground">điểm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground animate-pulse">
          Chờ câu hỏi tiếp theo...
        </p>
      </div>
    </div>
  )
}
