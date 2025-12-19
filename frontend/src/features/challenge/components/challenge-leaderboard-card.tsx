'use client'

import { Trophy, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { PaginationControls } from '@/shared/components/pagination-controls'
import { LeaderboardTable } from './leaderboard-table'
import { ChallengeStatsOverview } from './challenge-stats-overview'
import { useChallengeStats } from '../hooks'
import { usePdfExport } from '../hooks/use-pdf-export'
import type { ChallengeLeaderboardDto } from '../types'

interface ChallengeLeaderboardCardProps {
  challengeId: string
  leaderboard?: ChallengeLeaderboardDto
  isLoading: boolean
  onPageChange?: (page: number) => void
}

export function ChallengeLeaderboardCard({
  challengeId,
  leaderboard,
  isLoading,
  onPageChange,
}: ChallengeLeaderboardCardProps) {
  const { data: stats, isLoading: isLoadingStats } = useChallengeStats(challengeId)
  const { downloadLeaderboardPdf, downloadStatisticsPdf, isLoading: isExporting } = usePdfExport()
  const hasData = leaderboard && leaderboard.entries.length > 0
  const hasStats = stats && stats.completedAttempts > 0

  const handleDownloadLeaderboard = async () => {
    if (leaderboard) {
      await downloadLeaderboardPdf(challengeId, leaderboard.page, leaderboard.pageSize)
    }
  }

  const handleDownloadStats = async () => {
    await downloadStatisticsPdf(challengeId)
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview - Only show if there's actual data */}
      {!isLoadingStats && stats && hasStats && (
        <ChallengeStatsOverview stats={stats} />
      )}

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Bảng xếp hạng
              </CardTitle>
              <CardDescription>
                Top người chơi đạt điểm cao nhất
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadLeaderboard}
                disabled={isExporting || !hasData}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Tải Bảng XH
              </Button>
              {hasStats && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadStats}
                  disabled={isExporting}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Tải Thống kê
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="md" />
            </div>
          ) : hasData ? (
            <>
              {/* Pagination - Top */}
              {leaderboard.totalPages > 1 && (
                <div className="mb-6 flex flex-col items-center gap-2">
                  <PaginationControls
                    page={leaderboard.page}
                    pageSize={leaderboard.pageSize}
                    total={leaderboard.totalEntries}
                    onPageChange={onPageChange}
                  />
                  <div className="text-sm text-[var(--text-secondary)]">
                    Hiển thị {leaderboard.entries.length} / {leaderboard.totalEntries} kết quả
                  </div>
                </div>
              )}

              <LeaderboardTable entries={leaderboard.entries} />

              {/* Pagination - Bottom */}
              {leaderboard.totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <PaginationControls
                    page={leaderboard.page}
                    pageSize={leaderboard.pageSize}
                    total={leaderboard.totalEntries}
                    onPageChange={onPageChange}
                  />
                  <div className="text-sm text-[var(--text-secondary)]">
                    Hiển thị {leaderboard.entries.length} / {leaderboard.totalEntries} kết quả
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-[var(--text-secondary)]">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Chưa có ai hoàn thành thử thách này.</p>
              <p className="text-sm mt-1">Hãy chia sẻ để mời bạn bè tham gia!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
