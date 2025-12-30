'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, TrendingUp, Sparkles, Filter } from 'lucide-react'
import { Card } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { QuizSetCard } from '@/features/quiz'
import { usePublicQuizSets } from '@/features/quiz/hooks/use-public-quiz-sets'
import { useAuthStore, selectUser } from '@/features/auth/stores/auth.store'
import { ROUTES } from '@/config/routes'
import type { QuizSetDto, QuizSetQueryParams } from '@/types/api'

export default function HomePage() {
  const router = useRouter()
  const user = useAuthStore(selectUser)
  const [filterBy, setFilterBy] = useState<'all' | 'popular' | 'newest'>('all')

  // Query params for fetching public quizzes (discovery)
  const queryParams: QuizSetQueryParams = {
    sortBy: 'newest',
    page: 1,
    pageSize: 12,
  }

  const { quizSets, isLoadingQuizSets } = usePublicQuizSets(queryParams)

  const filterTabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'popular', label: 'Phổ biến' },
    { id: 'newest', label: 'Mới nhất' },
  ]

  const handleView = (quizSet: QuizSetDto) => {
    router.push(ROUTES.quiz.view(quizSet.id))
  }

  const handleHost = (quizSet: QuizSetDto) => {
    router.push(ROUTES.game.hostWithQuiz(quizSet.id))
  }

  const isCreator = user?.role === 'Creator' || user?.role === 'Administrator'

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl text-[var(--text-primary)]">
                Khám phá bài kiểm tra
              </h1>
              <p className="mt-2 text-[var(--text-secondary)]">
                Chọn bài kiểm tra phù hợp với bạn và bắt đầu học ngay!
              </p>
            </div>
          </div>
        </section>

        {/* Featured Section Badge */}
        <section>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--brand-primary)]" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Bài kiểm tra được đề xuất
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => {
                const isActive = filterBy === tab.id

                return (
                  <Button
                    key={tab.id}
                    type="button"
                    size="sm"
                    variant={isActive ? 'default' : 'outline'}
                    onClick={() =>
                      setFilterBy(tab.id as 'all' | 'popular' | 'newest')
                    }
                    className="rounded-full"
                  >
                    {tab.label}
                  </Button>
                )
              })}
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start sm:self-auto">
              <Filter className="h-4 w-4" />
              Bộ lọc
            </Button>
          </div>
        </section>

        {/* Quiz Grid */}
        <section>
          {isLoadingQuizSets && (
            <div className="flex h-40 items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          )}

          {!isLoadingQuizSets && quizSets && quizSets.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quizSets.map((quizSet) => (
                <QuizSetCard
                  key={quizSet.id}
                  quizSet={quizSet}
                  onView={handleView}
                  onHost={isCreator ? handleHost : undefined}
                />
              ))}
            </div>
          )}

          {!isLoadingQuizSets && (!quizSets || quizSets.length === 0) && (
            <Card className="flex flex-col items-center justify-center border-dashed border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] py-20 px-6 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
                <TrendingUp className="h-8 w-8 text-[var(--brand-primary)]" />
              </div>
              <h3 className="mb-2 font-heading text-xl text-[var(--text-primary)]">
                Chưa có bài kiểm tra
              </h3>
              <p className="text-[var(--text-secondary)]">
                Hiện chưa có bài kiểm tra nào được công bố. Quay lại sau!
              </p>
            </Card>
          )}
        </section>
      </div>
    </DashboardLayout>
  )
}
