'use client'

import { useRouter } from 'next/navigation'
import { Trophy, Medal, Home, RotateCcw, Share2, Target, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { useCountUp } from '@/shared/hooks/use-count-up'
import { Leaderboard } from '@/features/game-host'
import type { LeaderboardEntry } from '@/features/game-host/types'
import { ROUTES } from '@/config/routes'
import { toastSuccess, toastError } from '@/lib/utils/toast'

interface PlayerFinalResultProps {
  playerId: string
  nickname: string
  leaderboard: LeaderboardEntry[]
  totalQuestions: number
  className?: string
}

export function PlayerFinalResult({
  playerId,
  nickname,
  leaderboard,
  totalQuestions,
  className = '',
}: Readonly<PlayerFinalResultProps>) {
  const router = useRouter()

  const myResult = leaderboard.find(entry => entry.playerId === playerId)
  const myRank = myResult?.rank || leaderboard.length + 1
  const accuracy = myResult?.accuracyPercentage ?? 0
  const incorrectAnswers = totalQuestions - (myResult?.correctAnswers ?? 0)

  const pointsCount = useCountUp({ end: myResult?.totalPoints ?? 0, duration: 1500 })
  const correctCount = useCountUp({ end: myResult?.correctAnswers ?? 0, duration: 1500 })
  const incorrectCount = useCountUp({ end: incorrectAnswers, duration: 1500 })
  const accuracyCount = useCountUp({ end: accuracy, duration: 1500, decimals: 0 })

  const handlePlayAgain = () => {
    router.push(ROUTES.game.join)
  }

  const handleGoHome = () => {
    router.push(ROUTES.public.home)
  }

  const handleShare = async () => {
    const isWinner = myRank === 1
    const shareText = isWinner
      ? `Tôi đã giành chiến thắng với ${myResult?.totalPoints.toLocaleString('vi-VN')} điểm trên ThinkTogether!`
      : `Tôi đạt hạng ${myRank} với ${myResult?.totalPoints.toLocaleString('vi-VN')} điểm trên ThinkTogether!`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Kết quả trò chơi ThinkTogether',
          text: shareText,
          url: window.location.origin,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        toastSuccess('Đã sao chép kết quả!')
      }
    } catch {
      toastError('Không thể chia sẻ')
    }
  }

  const getRankIcon = () => {
    switch (myRank) {
      case 1:
        return <Trophy className="h-16 w-16 text-yellow-500" />
      case 2:
        return <Medal className="h-16 w-16 text-gray-400" />
      case 3:
        return <Medal className="h-16 w-16 text-amber-600" />
      default:
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="font-heading text-3xl font-bold text-primary">
              #{myRank}
            </span>
          </div>
        )
    }
  }

  const formatDuration = (ms: number | undefined | null) => {
    if (ms == null || Number.isNaN(ms)) {
      return '0s'
    }
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) {
      return `${seconds}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardContent className="p-8 md:p-10 text-center">
          <div className="mb-6 flex justify-center">
            {getRankIcon()}
          </div>

          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">
            Kết quả của bạn
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            {nickname}
          </p>

          {myResult && (
            <div className="mb-8">
              <div className="text-5xl md:text-6xl font-heading font-bold text-primary mb-2">
                {pointsCount.toLocaleString('vi-VN')}
              </div>
              <p className="text-sm text-muted-foreground">Tổng điểm</p>
            </div>
          )}

          {myResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="mx-auto h-6 w-6 text-green-600 mb-2" />
                  <div className="text-2xl font-heading font-bold text-green-600">
                    {correctCount.toLocaleString('vi-VN')}
                  </div>
                  <p className="text-xs text-muted-foreground">Đúng</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="mx-auto h-6 w-6 text-red-600 mb-2" />
                  <div className="text-2xl font-heading font-bold text-red-600">
                    {incorrectCount.toLocaleString('vi-VN')}
                  </div>
                  <p className="text-xs text-muted-foreground">Sai</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-heading font-bold text-blue-600">
                    {accuracyCount.toFixed(0)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Chính xác</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="mx-auto h-6 w-6 text-purple-600 mb-2" />
                  <div className="text-lg font-heading font-bold text-purple-600">
                    {myResult.totalTimeSpentMs != null ? formatDuration(myResult.totalTimeSpentMs) : '-'}
                  </div>
                  <p className="text-xs text-muted-foreground">Thời gian</p>
                </CardContent>
              </Card>
            </div>
          )}

          <Badge variant="default" className="text-base px-4 py-1.5">
            Xếp hạng #{myRank}
          </Badge>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="default" size="lg" onClick={handlePlayAgain} className="flex-1">
          <RotateCcw />
          Chơi tiếp
        </Button>
        <Button variant="outline" size="lg" onClick={handleShare} className="flex-1">
          <Share2 />
          Chia sẻ
        </Button>
        <Button variant="outline" size="lg" onClick={handleGoHome} className="flex-1">
          <Home />
          Trang chủ
        </Button>
      </div>

      <Leaderboard
        entries={leaderboard}
        title="Bảng xếp hạng"
        highlightPlayerId={playerId}
        showStats={true}
        maxDisplay={10}
      />
    </div>
  )
}

