'use client'

import { Trophy, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { LEADERBOARD_HEADERS } from '@/features/challenge/constants'
import type { ChallengeLeaderboardEntryDto } from '@/features/challenge/types'

interface LeaderboardTableProps {
  entries: ChallengeLeaderboardEntryDto[]
  className?: string
  highlightAttemptId?: string
}

export function LeaderboardTable({ 
  entries, 
  className = '',
  highlightAttemptId 
}: LeaderboardTableProps) {
  if (!entries || entries.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Chưa có bài nộp nào</p>
        </CardContent>
      </Card>
    )
  }

  const formatTime = (ms?: number) => {
    if (!ms) return '-'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const calculateAccuracy = (correct: number, total: number) => {
    if (total === 0) return '0%'
    return `${Math.round((correct / total) * 100)}%`
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                {LEADERBOARD_HEADERS.RANK}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">
                {LEADERBOARD_HEADERS.NICKNAME}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                {LEADERBOARD_HEADERS.SCORE}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                {LEADERBOARD_HEADERS.CORRECT_ANSWERS}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                {LEADERBOARD_HEADERS.ACCURACY}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">
                {LEADERBOARD_HEADERS.TIME}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isHighlighted = highlightAttemptId === entry.attemptId
              return (
              <tr
                key={entry.attemptId}
                className={`border-b border-border transition-colors ${
                  isHighlighted
                    ? 'bg-primary/10 border-primary/30'
                    : 'hover:bg-accent'
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {entry.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500" />}
                    {entry.rank === 2 && <Trophy className="h-4 w-4 text-gray-400" />}
                    {entry.rank === 3 && <Trophy className="h-4 w-4 text-orange-600" />}
                    <span className="font-semibold">{entry.rank}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {entry.nickname}
                    {isHighlighted && (
                      <Badge variant="default" className="text-xs">
                        Bạn
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center font-bold text-blue-600">
                  {entry.score}
                </td>
                <td className="py-3 px-4 text-center">
                  {entry.correctAnswers}/{entry.totalQuestions}
                </td>
                <td className="py-3 px-4 text-center">
                  {calculateAccuracy(entry.correctAnswers, entry.totalQuestions)}
                </td>
                <td className="py-3 px-4 text-center text-sm">
                  {formatTime(entry.completionTimeMs)}
                </td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => {
          const isHighlighted = highlightAttemptId === entry.attemptId
          return (
          <Card 
            key={entry.attemptId} 
            className={`overflow-hidden ${
              isHighlighted
                ? 'border-primary bg-primary/5'
                : ''
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {entry.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                  {entry.rank === 2 && <Trophy className="h-5 w-5 text-gray-400" />}
                  {entry.rank === 3 && <Trophy className="h-5 w-5 text-orange-600" />}
                  <div>
                    <p className="font-semibold text-foreground">#{entry.rank}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">{entry.nickname}</p>
                      {isHighlighted && (
                        <Badge variant="default" className="text-xs">
                          Bạn
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">
                  {entry.score} điểm
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Câu đúng</p>
                  <p className="font-semibold text-foreground">
                    {entry.correctAnswers}/{entry.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Độ chính xác</p>
                  <p className="font-semibold text-foreground">
                    {calculateAccuracy(entry.correctAnswers, entry.totalQuestions)}
                  </p>
                </div>
                {entry.completionTimeMs && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Thời gian
                    </p>
                    <p className="font-semibold text-foreground">
                      {formatTime(entry.completionTimeMs)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          )
        })}
      </div>
    </div>
  )
}

