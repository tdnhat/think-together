'use client'

import { Trophy, Medal, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { LeaderboardEntryDto } from '../types'

interface TopPerformersProps {
  entries: LeaderboardEntryDto[]
  maxDisplay?: number
  className?: string
}

export function TopPerformers({
  entries,
  maxDisplay = 5,
  className = '',
}: TopPerformersProps) {
  const topEntries = entries.slice(0, maxDisplay)

  if (topEntries.length === 0) {
    return null
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-orange-600" />
      default:
        return null
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) return null
    return (
      <Badge variant="outline" className="ml-auto">
        #{rank}
      </Badge>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Top người chơi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topEntries.map((entry) => (
            <div
              key={entry.attemptId}
              className="flex items-center justify-between rounded-lg border-2 border-border p-3 hover:bg-[var(--bg-surface-secondary)] transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                  {!getRankIcon(entry.rank) && (
                    <span className="text-sm font-semibold text-[var(--text-secondary)] w-6">
                      #{entry.rank}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--text-primary)] truncate">
                    {entry.nickname}
                  </p>
                  {entry.quizSetTitle && (
                    <p className="text-xs text-[var(--text-secondary)] truncate">
                      {entry.quizSetTitle}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 ml-2">
                <div className="text-right">
                  <p className="font-bold text-blue-600">{entry.score}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {entry.correctAnswers}/{entry.totalQuestions}
                  </p>
                </div>
                {getRankBadge(entry.rank)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
