'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import {
  useChallengeByQuizSetId,
  useLeaderboard,
  ChallengeDetailHeader,
  ChallengeShareCard,
  ChallengeLeaderboardCard,
} from '@/features/challenge'
import { useQuizSet } from '@/features/quiz/hooks/use-quiz-set'

const DEFAULT_PAGE_SIZE = 20

export default function ChallengeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const quizSetId = params.id as string
  const [page, setPage] = useState(1)

  const { quizSet, isLoadingQuizSet } = useQuizSet(quizSetId)
  const { data: challenge, isLoading: isLoadingChallenge } = useChallengeByQuizSetId(quizSetId)
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useLeaderboard(
    challenge?.id,
    page,
    DEFAULT_PAGE_SIZE
  )

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleBack = () => {
    router.push(`/quiz/${quizSetId}`)
  }

  const shareUrl = challenge
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/challenge/${challenge.shareLink}`
    : ''

  if (isLoadingQuizSet || isLoadingChallenge) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      </DashboardLayout>
    )
  }

  if (!challenge) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Chưa có thử thách
          </h2>
          <p className="text-[var(--text-secondary)]">
            Bộ trắc nghiệm này chưa có thử thách nào.
          </p>
          <button
            onClick={handleBack}
            className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] underline"
          >
            Quay lại
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ChallengeDetailHeader
          challenge={challenge}
          quizSetTitle={quizSet?.title}
          onBack={handleBack}
        />

        <div className="space-y-6">
          <ChallengeShareCard challenge={challenge} shareUrl={shareUrl} />
          <ChallengeLeaderboardCard
            challengeId={challenge.id}
            leaderboard={leaderboard}
            isLoading={isLoadingLeaderboard}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

