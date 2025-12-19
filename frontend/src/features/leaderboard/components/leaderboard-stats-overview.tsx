'use client'

import { Users, Target, Clock, TrendingUp, Award, Activity } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import type { LeaderboardStatsDto } from '../types'

interface LeaderboardStatsOverviewProps {
  stats: LeaderboardStatsDto
  className?: string
}

export function LeaderboardStatsOverview({
  stats,
  className = '',
}: LeaderboardStatsOverviewProps) {
  const formatTime = (ms?: number) => {
    if (!ms) return '-'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const statCards = [
    {
      icon: Users,
      label: 'Tổng số lượt làm',
      value: stats.totalAttempts.toLocaleString('vi-VN'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Target,
      label: 'Người tham gia',
      value: stats.totalParticipants.toLocaleString('vi-VN'),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      label: 'Điểm trung bình',
      value: Math.round(stats.averageScore).toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Award,
      label: 'Độ chính xác TB',
      value: `${Math.round(stats.averageAccuracy)}%`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Clock,
      label: 'Thời gian TB',
      value: formatTime(stats.averageCompletionTimeMs),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Activity,
      label: 'Hoàn thành',
      value: `${Math.round(stats.completionRate)}%`,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
  ]

  return (
    <div className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 ${className}`}>
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {stat.label}
                  </p>
                  <p className={`text-lg font-bold ${stat.color} truncate`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
