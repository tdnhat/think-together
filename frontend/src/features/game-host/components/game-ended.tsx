'use client'

import { Trophy, Clock, Users, Home, RotateCcw, Download, Medal, Award } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/shared/ui/card'
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
      {winner && (
        <Card>
          <CardContent className="p-8 md:p-10 text-center">
            <div className="mb-6">
              <Trophy className="mx-auto h-16 w-16 text-yellow-500" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">
              Người chiến thắng
            </h2>
            <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">
              {winner.nickname}
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="default" className="text-base py-2 px-4">
                {winner.totalPoints.toLocaleString('vi-VN')} điểm
              </Badge>
              <Badge variant="outline" className="text-base py-2 px-4">
                {winner.correctAnswers}/{result.totalQuestions} đúng
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {result.finalLeaderboard.length >= 3 && (
        <div className="flex items-end justify-center gap-4 md:gap-6 h-64 md:h-72">
          {runnerUp && (
            <div className="flex flex-col items-center">
              <div className="mb-3 text-center">
                <Medal className="mx-auto h-5 w-5 text-gray-400 mb-1" />
                <div className="font-semibold truncate max-w-24 md:max-w-28 text-sm">
                  {runnerUp.nickname}
                </div>
                <div className="text-sm font-bold text-muted-foreground mt-1">
                  {runnerUp.totalPoints.toLocaleString('vi-VN')}
                </div>
              </div>
              <Card className="w-24 md:w-28 h-32 md:h-36 rounded-t-xl">
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <span className="font-heading text-4xl md:text-5xl font-bold">2</span>
                </CardContent>
              </Card>
            </div>
          )}

          {winner && (
            <div className="flex flex-col items-center">
              <Trophy className="h-8 w-8 md:h-10 md:w-10 text-yellow-500 mb-2" />
              <div className="mb-3 text-center">
                <div className="font-bold truncate max-w-28 md:max-w-32 text-base">
                  {winner.nickname}
                </div>
                <div className="text-base text-primary font-bold mt-1">
                  {winner.totalPoints.toLocaleString('vi-VN')}
                </div>
              </div>
              <Card className="w-28 md:w-32 h-40 md:h-48 rounded-t-xl border-yellow-500">
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <span className="font-heading text-5xl md:text-6xl font-bold text-yellow-600">1</span>
                </CardContent>
              </Card>
            </div>
          )}

          {thirdPlace && (
            <div className="flex flex-col items-center">
              <div className="mb-3 text-center">
                <Medal className="mx-auto h-5 w-5 text-amber-600 mb-1" />
                <div className="font-semibold truncate max-w-24 md:max-w-28 text-sm">
                  {thirdPlace.nickname}
                </div>
                <div className="text-sm font-bold text-muted-foreground mt-1">
                  {thirdPlace.totalPoints.toLocaleString('vi-VN')}
                </div>
              </div>
              <Card className="w-24 md:w-28 h-24 md:h-28 rounded-t-xl">
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <span className="font-heading text-4xl md:text-5xl font-bold">3</span>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="mx-auto h-8 w-8 text-primary mb-3" />
            <div className="font-heading text-3xl font-bold mb-1">
              {result.totalPlayers}
            </div>
            <div className="text-sm text-muted-foreground">Người chơi</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Award className="mx-auto h-8 w-8 text-primary mb-3" />
            <div className="font-heading text-3xl font-bold mb-1">
              {result.totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">Câu hỏi</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="mx-auto h-8 w-8 text-primary mb-3" />
            <div className="font-heading text-3xl font-bold mb-1">
              {result.duration}
            </div>
            <div className="text-sm text-muted-foreground">Thời gian</div>
          </CardContent>
        </Card>
      </div>

      <Leaderboard
        entries={result.finalLeaderboard}
        title="Bảng xếp hạng cuối cùng"
        showStats={true}
        maxDisplay={20}
      />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {onPlayAgain && (
          <Button variant="default" size="lg" onClick={onPlayAgain} className="gap-2 w-full sm:w-auto">
            <RotateCcw />
            Chơi lại
          </Button>
        )}
        
        <Button variant="outline" size="lg" onClick={handleGoHome} className="gap-2 w-full sm:w-auto">
          <Home />
          Về trang chủ
        </Button>

        <Button variant="outline" size="lg" disabled className="gap-2 w-full sm:w-auto" title="Tính năng sẽ sớm ra mắt">
          <Download />
          Xuất kết quả
        </Button>
      </div>
    </div>
  )
}

