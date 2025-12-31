'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { PageLayout, PageMain } from '@/shared/components'
import {
  ResultsSummary,
  useLeaderboard,
} from '@/features/challenge'
import {
  useChallengeResultsAttempt,
  useChallengeResultsSummary,
  useChallengeResultsActions,
} from '@/features/challenge/hooks/results'
import {
  ChallengeResultsLoading,
  ChallengeResultsError,
  ChallengeResultsHeader,
  ChallengeResultsActions,
  ChallengeResultsLeaderboard,
  ChallengeResultsFooter,
} from '@/features/challenge/components/results'

function ChallengeResultsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const shareLink = params.link as string
  const attemptId = searchParams.get('attemptId')

  const { attempt, isLoading } = useChallengeResultsAttempt(attemptId)
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useLeaderboard(
    attempt?.challengeId
  )
  const { resultsSummary } = useChallengeResultsSummary({
    attemptId,
    attempt,
    leaderboard,
  })
  const { handleShare, handleRetry, handleHome } = useChallengeResultsActions(shareLink)

  if (isLoading || !attempt) {
    return <ChallengeResultsLoading />
  }

  if (!attemptId || !resultsSummary) {
    return <ChallengeResultsError />
  }

  return (
    <PageLayout>
      <ChallengeResultsHeader />

      <PageMain>
        <div className="max-w-4xl mx-auto space-y-8">
          <ResultsSummary results={resultsSummary} attemptId={attemptId} />

          <ChallengeResultsActions
            onRetry={handleRetry}
            onShare={handleShare}
            onHome={handleHome}
          />

          <ChallengeResultsLeaderboard
            leaderboard={leaderboard}
            isLoading={isLoadingLeaderboard}
            attemptId={attemptId}
          />
        </div>
      </PageMain>

      <ChallengeResultsFooter />
    </PageLayout>
  )
}

export default function ChallengeResultsPage() {
  return (
    <Suspense fallback={<ChallengeResultsLoading />}>
      <ChallengeResultsContent />
    </Suspense>
  )
}
