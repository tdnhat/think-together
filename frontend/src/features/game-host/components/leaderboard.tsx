'use client'

import { Trophy, Medal, Award, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { LeaderboardEntry } from '../types'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  title?: string
  showStats?: boolean
  maxDisplay?: number
  highlightPlayerId?: string
  className?: string
}

export function Leaderboard({
  entries,
  title = 'Bảng xếp hạng',
  showStats = true,
  maxDisplay = 10,
  highlightPlayerId,
  className = '',
}: Readonly<LeaderboardProps>) {
  const displayedEntries = entries.slice(0, maxDisplay)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <span className="flex h-6 w-6 items-center justify-center font-bold text-[var(--text-secondary)]">{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300'
      default:
        return 'bg-[var(--bg-surface-secondary)] border-[var(--color-border-light)]'
    }
  }

  const formatPoints = (points: number | undefined | null) => {
    if (points == null || Number.isNaN(points)) {
      return '0'
    }
    return points.toLocaleString('vi-VN')
  }

  const formatAccuracy = (percentage: number | undefined | null) => {
    if (percentage == null || Number.isNaN(percentage)) {
      return '0%'
    }
    return `${percentage.toFixed(0)}%`
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
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="h-5 w-5 text-[var(--brand-primary)]" />
            {title}
          </CardTitle>
          {entries.length > 0 && (
            <Badge variant="neutral" className="text-sm">
              {entries.length} người chơi
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {entries.length === 0 ? (
          <div className="py-8 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-[var(--text-tertiary)] opacity-50" />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Chưa có dữ liệu xếp hạng
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedEntries.map((entry) => {
              const isHighlighted = entry.playerId === highlightPlayerId
              
              return (
                <div
                  key={entry.playerId}
                  className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${getRankBg(entry.rank ?? 0)} ${
                    isHighlighted ? 'ring-2 ring-[var(--brand-primary)] ring-offset-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank ?? 0)}
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {entry.nickname || 'Người chơi không tên'}
                      </span>
                      {showStats && (
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="neutral" className="text-xs">
                            {entry.correctAnswers ?? 0} đúng
                          </Badge>
                          <Badge variant="neutral" className="text-xs">
                            {formatAccuracy(entry.accuracyPercentage)}
                          </Badge>
                          {entry.totalTimeSpentMs != null && (
                            <Badge variant="neutral" className="text-xs flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(entry.totalTimeSpentMs)}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-heading text-xl font-bold text-[var(--brand-primary)]">
                      {formatPoints(entry.totalPoints)}
                    </span>
                    <span className="text-sm text-[var(--text-tertiary)] ml-1">điểm</span>
                  </div>
                </div>
              )
            })}

            {entries.length > maxDisplay && (
              <div className="text-center pt-2">
                <span className="text-sm text-[var(--text-tertiary)]">
                  +{entries.length - maxDisplay} người chơi khác
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

