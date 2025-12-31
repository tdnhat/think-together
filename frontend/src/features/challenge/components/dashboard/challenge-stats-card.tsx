'use client'

import { Users, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Separator } from '@/shared/ui/separator'
import type { ChallengeDto } from '../types'

interface ChallengeStatsCardProps {
  challenge: ChallengeDto
  description?: string
}

export function ChallengeStatsCard({ challenge, description }: ChallengeStatsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thống kê</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Lượt chơi</span>
            </div>
            <span className="font-bold text-foreground">
              {challenge.playCount}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Ngày tạo</span>
            </div>
            <span className="text-sm text-foreground">
              {formatDate(challenge.createdAt)}
            </span>
          </div>

          {challenge.updatedAt && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Cập nhật</span>
                </div>
                <span className="text-sm text-foreground">
                  {formatDate(challenge.updatedAt)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      {description && (
        <Card>
          <CardHeader>
            <CardTitle>Mô tả</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
