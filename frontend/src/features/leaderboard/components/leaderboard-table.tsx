'use client'

import { Trophy, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { LEADERBOARD_HEADERS } from '../constants'
import type { LeaderboardEntryDto } from '../types'

interface LeaderboardTableProps {
  entries: LeaderboardEntryDto[]
  showQuizSet?: boolean
  className?: string
}

export function LeaderboardTable({
  entries,
  showQuizSet = false,
  className = '',
}: LeaderboardTableProps) {
  if (!entries || entries.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--text-secondary)]">
            Chưa có dữ liệu xếp hạng
          </p>
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
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
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">
                {LEADERBOARD_HEADERS.RANK}
              </th>
              <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">
                {LEADERBOARD_HEADERS.NICKNAME}
              </th>
              {showQuizSet && (
                <th className="text-left py-3 px-4 font-semibold text-[var(--text-secondary)]">
                  {LEADERBOARD_HEADERS.QUIZ_SET}
                </th>
              )}
              <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">
                {LEADERBOARD_HEADERS.SCORE}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">
                {LEADERBOARD_HEADERS.CORRECT_ANSWERS}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">
                {LEADERBOARD_HEADERS.ACCURACY}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">
                {LEADERBOARD_HEADERS.TIME}
              </th>
              <th className="text-center py-3 px-4 font-semibold text-[var(--text-secondary)]">
                {LEADERBOARD_HEADERS.COMPLETED_AT}
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr
                key={entry.attemptId}
                className="border-b border-border hover:bg-[var(--bg-surface-secondary)] transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {entry.rank === 1 && (
                      <Trophy className="h-4 w-4 text-yellow-500" />
                    )}
                    {entry.rank === 2 && (
                      <Trophy className="h-4 w-4 text-gray-400" />
                    )}
                    {entry.rank === 3 && (
                      <Trophy className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="font-semibold">{entry.rank}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-[var(--text-primary)]">
                  {entry.nickname}
                </td>
                {showQuizSet && (
                  <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                    {entry.quizSetTitle || '-'}
                  </td>
                )}
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
                <td className="py-3 px-4 text-center text-xs text-[var(--text-secondary)]">
                  {formatDate(entry.completedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => (
          <Card key={entry.attemptId} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {entry.rank === 1 && (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  )}
                  {entry.rank === 2 && (
                    <Trophy className="h-5 w-5 text-gray-400" />
                  )}
                  {entry.rank === 3 && (
                    <Trophy className="h-5 w-5 text-orange-600" />
                  )}
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      #{entry.rank}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {entry.nickname}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-blue-100 text-blue-700">
                  {entry.score} điểm
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {showQuizSet && entry.quizSetTitle && (
                  <div className="col-span-2">
                    <p className="text-[var(--text-secondary)] text-xs">
                      Bộ câu hỏi
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {entry.quizSetTitle}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[var(--text-secondary)] text-xs">
                    Câu đúng
                  </p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {entry.correctAnswers}/{entry.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)] text-xs">
                    Độ chính xác
                  </p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {calculateAccuracy(entry.correctAnswers, entry.totalQuestions)}
                  </p>
                </div>
                {entry.completionTimeMs && (
                  <div>
                    <p className="text-[var(--text-secondary)] text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Thời gian
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {formatTime(entry.completionTimeMs)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[var(--text-secondary)] text-xs">
                    Hoàn thành
                  </p>
                  <p className="font-semibold text-[var(--text-primary)] text-xs">
                    {formatDate(entry.completedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
