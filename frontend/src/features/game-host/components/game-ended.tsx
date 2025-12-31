'use client'

import { Trophy, Clock, Users, Home, RotateCcw, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Leaderboard } from './leaderboard'
import { ROUTES } from '@/config/routes'
import type { GameEndedMessage } from '../types'

interface GameEndedProps {
  result: GameEndedMessage
  onPlayAgain?: () => void
  className?: string
}

export function GameEnded({
  result,
  onPlayAgain,
  className = '',
}: Readonly<GameEndedProps>) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push(ROUTES.dashboard.home)
  }

  const winner = result.finalLeaderboard[0]
  const runnerUp = result.finalLeaderboard[1]
  const thirdPlace = result.finalLeaderboard[2]

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Winner Announcement */}
      {winner && (
        <Card className="overflow-hidden bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Trophy className="mx-auto h-16 w-16 text-yellow-500 animate-bounce" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
              🎉 Người chiến thắng 🎉
            </h2>
            <div className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">
              {winner.nickname}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="default" className="text-lg py-2 px-4">
                {winner.totalPoints.toLocaleString('vi-VN')} điểm
              </Badge>
              <Badge variant="outline" className="text-lg py-2 px-4">
                {winner.correctAnswers}/{result.totalQuestions} đúng
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Podium */}
      {result.finalLeaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-4 h-64">
          {/* 2nd Place */}
          {runnerUp && (
            <div className="flex flex-col items-center">
              <div className="mb-2 text-center">
                <div className="font-medium text-foreground truncate max-w-24">
                  {runnerUp.nickname}
                </div>
                <div className="text-sm text-muted-foreground">
                  {runnerUp.totalPoints.toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="w-24 h-32 bg-gradient-to-t from-gray-300 to-gray-100 rounded-t-lg border-2 border-gray-400 flex items-center justify-center">
                <span className="font-heading text-4xl font-bold text-gray-600">2</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {winner && (
            <div className="flex flex-col items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
              <div className="mb-2 text-center">
                <div className="font-semibold text-foreground truncate max-w-28">
                  {winner.nickname}
                </div>
                <div className="text-sm text-primary font-medium">
                  {winner.totalPoints.toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="w-28 h-44 bg-gradient-to-t from-yellow-400 to-yellow-100 rounded-t-lg border-2 border-yellow-500 flex items-center justify-center">
                <span className="font-heading text-5xl font-bold text-yellow-600">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {thirdPlace && (
            <div className="flex flex-col items-center">
              <div className="mb-2 text-center">
                <div className="font-medium text-foreground truncate max-w-24">
                  {thirdPlace.nickname}
                </div>
                <div className="text-sm text-muted-foreground">
                  {thirdPlace.totalPoints.toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="w-24 h-24 bg-gradient-to-t from-amber-600 to-amber-200 rounded-t-lg border-2 border-amber-700 flex items-center justify-center">
                <span className="font-heading text-4xl font-bold text-amber-700">3</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Game Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="mx-auto h-8 w-8 text-primary mb-2" />
            <div className="font-heading text-2xl font-bold text-foreground">
              {result.totalPlayers}
            </div>
            <div className="text-sm text-muted-foreground">Người chơi</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Badge className="mx-auto mb-2 h-8 w-8 rounded-full p-2" variant="default">
              Q
            </Badge>
            <div className="font-heading text-2xl font-bold text-foreground">
              {result.totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">Câu hỏi</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto h-8 w-8 text-secondary mb-2" />
            <div className="font-heading text-2xl font-bold text-foreground">
              {result.duration}
            </div>
            <div className="text-sm text-muted-foreground">Thời gian</div>
          </CardContent>
        </Card>
      </div>

      {/* Full Leaderboard */}
      <Leaderboard
        entries={result.finalLeaderboard}
        title="Bảng xếp hạng cuối cùng"
        showStats={true}
        maxDisplay={20}
      />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {onPlayAgain && (
          <Button variant="default" size="lg" onClick={onPlayAgain} className="gap-2 w-full sm:w-auto">
            <RotateCcw className="h-5 w-5" />
            Chơi lại
          </Button>
        )}
        
        <Button variant="outline" size="lg" onClick={handleGoHome} className="gap-2 w-full sm:w-auto">
          <Home className="h-5 w-5" />
          Về trang chủ
        </Button>

        <Button variant="outline" size="lg" disabled className="gap-2 w-full sm:w-auto" title="Tính năng sẽ sớm ra mắt">
          <Download className="h-5 w-5" />
          Xuất kết quả
        </Button>
      </div>
    </div>
  )
}

