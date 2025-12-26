'use client'

import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Skeleton } from '@/shared/ui/skeleton'
import { PaginationControls } from '@/shared/components/pagination-controls'
import { DashboardLayout } from '@/widgets/dashboard'
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
      <div className="space-y-6">
        {/* Header Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[var(--brand-primary)] p-2">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl text-[var(--text-primary)]">
                Bảng xếp hạng
              </h1>
              <p className="mt-1 text-[var(--text-secondary)]">
                {isCreator
                  ? 'Theo dõi hiệu suất và phân tích dữ liệu người chơi'
                  : 'Xem thứ hạng của bạn và các người chơi khác'}
              </p>
            </div>
          </div>
        </section>

        {/* Stats Overview - Only for creators */}
        {isCreator && (
          <section>
            {isLoadingStats ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-10 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              stats && (
                <LeaderboardStatsOverview stats={stats} className="mb-4" />
              )
            )}
          </section>
        )}

        {/* Main Content */}
        <div className="space-y-6">
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
            {isLoading && (
              <div className="flex h-40 items-center justify-center">
                <LoadingSpinner size="md" />
              </div>
            )}

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-8 text-center">
                  <p className="text-red-600">{error}</p>
                </CardContent>
              </Card>
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
                <div className="mt-4 text-center text-sm text-[var(--text-secondary)]">
                  Hiển thị {data.entries.length} / {data.totalEntries} kết quả
                </div>
              </>
            )}

            {!isLoading && !error && data && data.entries.length === 0 && (
              <Card className="flex flex-col items-center justify-center border-dashed border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] py-20 px-6 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
                  <TrendingUp className="h-8 w-8 text-[var(--brand-primary)]" />
                </div>
                <h3 className="mb-2 font-heading text-xl text-[var(--text-primary)]">
                  {LEADERBOARD_CONSTANTS.MESSAGES.EMPTY_LEADERBOARD}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {LEADERBOARD_CONSTANTS.MESSAGES.EMPTY_LEADERBOARD_DESCRIPTION}
                </p>
              </Card>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
