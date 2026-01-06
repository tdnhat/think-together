'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { PaginationControls } from '@/shared/components/pagination-controls'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer, LoadingState, EmptyState, ErrorState } from '@/shared/components/page'
import {
  LeaderboardTable,
  LeaderboardFilters,
  LeaderboardStatsOverview,
  QuizSetSelector,
  useLeaderboard,
  LEADERBOARD_CONSTANTS,
} from '@/features/leaderboard'
import { useQuizSets } from '@/features/quiz'
import { useClasses } from '@/features/class'
import { useAuthStore, selectUser } from '@/features/auth/stores/auth.store'
import type { LeaderboardFilters as LeaderboardFiltersType } from '@/features/leaderboard/types'

export default function LeaderboardPage() {
  const user = useAuthStore(selectUser)
  const isCreator = user?.role === 'Creator' || user?.role === 'Administrator'

  const [filters, setFilters] = useState<LeaderboardFiltersType>({
    timePeriod: 'all',
    sortBy: 'score',
    sortOrder: 'desc',
  })

  const [page, setPage] = useState(1)
  const pageSize = LEADERBOARD_CONSTANTS.LIMITS.DEFAULT_PAGE_SIZE

  // Fetch quiz sets for creator
  const { quizSets } = useQuizSets({
    page: 1,
    pageSize: 100, // Get all quiz sets for selector
  })

  // Fetch classes for homework filter
  const { data: classesData } = useClasses({
    page: 1,
    pageSize: 100, // Get all classes for selector
  })

  // Extract classes from data
  // Note: To get homeworks, we would need to load each class detail
  // For now, we'll just use classes for filtering and load homeworks on-demand
  const classes = classesData?.data || []
  const homeworks: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any

  // TODO: Load homeworks when a class is selected, or load all class details to get homeworks

  const { data, stats, isLoading, isLoadingStats, error } = useLeaderboard({
    params: {
      ...filters,
      page,
      pageSize,
    },
  })

  const handleFiltersChange = (newFilters: LeaderboardFiltersType) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

  const handleQuizSetChange = (quizSetId: string | undefined) => {
    setFilters({ ...filters, quizSetId })
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          icon={TrendingUp}
          title="Bảng xếp hạng"
          description={
            isCreator
              ? 'Theo dõi hiệu suất và phân tích dữ liệu người chơi'
              : 'Xem thứ hạng của bạn và các người chơi khác'
          }
        />

        {/* Stats Overview - Only for creators */}
        {isCreator && (
          <section>
            {isLoadingStats ? (
              <LoadingState variant="skeleton" skeletonLines={1} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6" />
            ) : (
              stats && (
                <LeaderboardStatsOverview stats={stats} className="mb-4" />
              )
            )}
          </section>
        )}

        {/* Filters Section */}
        <section>
          <LeaderboardFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            showQuizSetFilter={isCreator}
            quizSetSelector={
              isCreator && quizSets.length > 0 ? (
                <QuizSetSelector
                  quizSets={quizSets}
                  selectedQuizSetId={filters.quizSetId}
                  onQuizSetChange={handleQuizSetChange}
                />
              ) : undefined
            }
            classes={classes}
            homeworks={homeworks}
          />
        </section>

        {/* Leaderboard Table */}
        <section>
          {isLoading && <LoadingState />}

          {error && (
            <ErrorState
              title="Đã xảy ra lỗi"
              description={error}
            />
          )}

          {!isLoading && !error && data && (
            <>
              <LeaderboardTable
                entries={data.entries}
                showQuizSet={isCreator && !filters.quizSetId}
                className="mb-6"
              />

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex flex-col items-center gap-2">
                  <PaginationControls
                    page={data.page}
                    pageSize={data.pageSize}
                    total={data.totalEntries}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              {/* Results Info */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Hiển thị {data.entries.length} / {data.totalEntries} kết quả
              </div>
            </>
          )}

          {!isLoading && !error && data && data.entries.length === 0 && (
            <EmptyState
              icon={TrendingUp}
              title={LEADERBOARD_CONSTANTS.MESSAGES.EMPTY_LEADERBOARD}
              description={LEADERBOARD_CONSTANTS.MESSAGES.EMPTY_LEADERBOARD_DESCRIPTION}
            />
          )}
        </section>
      </PageContainer>
    </DashboardLayout >
  )
}
