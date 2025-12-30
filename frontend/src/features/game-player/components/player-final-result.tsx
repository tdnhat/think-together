'use client'

import { useRouter } from 'next/navigation'
import { Trophy, Medal, Home, RotateCcw, Share2, Target, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
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
  const isWinner = myRank === 1
  const isTopThree = myRank <= 3

  const handlePlayAgain = () => {
    router.push(ROUTES.game.join)
  }

  const handleGoHome = () => {
    router.push(ROUTES.public.home)
  }

  const handleShare = async () => {
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
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
            <span className="font-heading text-3xl font-bold text-[var(--brand-primary)]">
              #{myRank}
            </span>
          </div>
        )
    }
  }

  const getRankGradient = () => {
    switch (myRank) {
      case 1:
        return 'from-yellow-50 to-amber-100 border-yellow-300'
      case 2:
        return 'from-gray-50 to-gray-100 border-gray-300'
      case 3:
        return 'from-amber-50 to-orange-100 border-amber-400'
      default:
        return 'from-[var(--bg-surface)] to-[var(--bg-surface-secondary)] border-[var(--color-border-light)]'
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
      {/* Personal Result Card */}
      <Card className={`overflow-hidden bg-gradient-to-br ${getRankGradient()}`}>
        <CardContent className="p-8 text-center">
          {/* Rank Icon */}
          <div className="mb-4 flex justify-center">
            {isWinner && (
              <div className="absolute animate-bounce">
                <Trophy className="h-6 w-6 text-yellow-500 -mt-8" />
              </div>
            )}
            {getRankIcon()}
          </div>

          {/* Congratulations */}
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-2">
            {isWinner ? 'Chúc mừng!' : isTopThree ? 'Tuyệt vời!' : 'Kết quả của bạn'}
          </h2>
          <p className="text-lg text-[var(--text-secondary)] mb-4">
            {nickname}
          </p>

          {/* Stats */}
          {myResult && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Badge variant="default" className="mb-2">#{myRank}</Badge>
                <div className="text-sm text-[var(--text-secondary)]">Xếp hạng</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-[var(--brand-primary)]">
                  {myResult.totalPoints.toLocaleString('vi-VN')}
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Điểm</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Target className="h-5 w-5 text-[var(--color-success)]" />
                  <span className="font-heading text-xl font-bold text-[var(--color-success)]">
                    {myResult.correctAnswers}
                  </span>
                  <span className="text-[var(--text-secondary)]">/{totalQuestions}</span>
                </div>
                <div className="text-sm text-[var(--text-secondary)]">Đúng</div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          {myResult && (
            <div className="mt-6 pt-4 border-t border-[var(--color-border-light)]/30 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--brand-secondary)]" />
                <span className="text-[var(--text-secondary)]">Độ chính xác:</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {(myResult.accuracyPercentage ?? 0).toFixed(0)}%
                </span>
              </div>
              {myResult.totalTimeSpentMs != null && (
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--color-info)]" />
                  <span className="text-[var(--text-secondary)]">Thời gian:</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {formatDuration(myResult.totalTimeSpentMs)}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="default" 
          size="lg" 
          onClick={handlePlayAgain}
          className="flex-1 gap-2"
        >
          <RotateCcw className="h-5 w-5" />
          Chơi tiếp
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleShare}
          className="flex-1 gap-2"
        >
          <Share2 className="h-5 w-5" />
          Chia sẻ
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleGoHome}
          className="flex-1 gap-2"
        >
          <Home className="h-5 w-5" />
          Trang chủ
        </Button>
      </div>

      {/* Full Leaderboard */}
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

