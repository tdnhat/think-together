'use client'

import { DashboardLayout } from '@/widgets/dashboard'
import { usePublicQuizSets } from '@/features/quiz/hooks/use-public-quiz-sets'
import { useAuthStore, selectUser } from '@/features/auth/stores/auth.store'
import { DEFAULT_QUERY_PARAMS } from '@/features/quiz/constants/home'
import { useQuizFilters, useQuizHandlers } from '@/features/quiz/hooks/home'
import {
  HomeHeader,
  HomeFeaturedBadge,
  HomeFilterTabs,
  HomeQuizGrid,
  HomeEmptyState,
  HomeLoadingState,
} from '@/features/quiz/components/home'

export default function HomePage() {
  const user = useAuthStore(selectUser)
  const { filterBy, setFilterBy } = useQuizFilters()
  const { handleView, handleHost } = useQuizHandlers()

  const { quizSets, isLoadingQuizSets } = usePublicQuizSets(DEFAULT_QUERY_PARAMS)

  const isCreator = user?.role === 'Creator' || user?.role === 'Administrator'

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <HomeHeader />
        <HomeFeaturedBadge />
        <HomeFilterTabs filterBy={filterBy} onFilterChange={setFilterBy} />
        {isLoadingQuizSets && <HomeLoadingState />}
        {!isLoadingQuizSets && quizSets && quizSets.length > 0 && (
          <HomeQuizGrid
            quizSets={quizSets}
            isLoading={isLoadingQuizSets}
            onView={handleView}
            onHost={isCreator ? handleHost : undefined}
          />
        )}
        {!isLoadingQuizSets && (!quizSets || quizSets.length === 0) && (
          <HomeEmptyState />
        )}
      </div>
    </DashboardLayout>
  )
}
