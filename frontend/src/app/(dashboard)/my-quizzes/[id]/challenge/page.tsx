'use client'

import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/widgets/dashboard'
import {
  useChallengeByQuizSetId,
  useLeaderboard,
  ChallengeDetailHeader,
  ChallengeShareCard,
  ChallengeLeaderboardCard,
} from '@/features/challenge'
import { useQuizSet } from '@/features/quiz/hooks/use-quiz-set'
import {
  useChallengeActions,
  useChallengePagination,
  useChallengeShareUrl,
} from '@/features/challenge/hooks/dashboard'
import { ChallengeLoading, ChallengeError } from '@/features/challenge/components/dashboard'
import { DEFAULT_LEADERBOARD_PAGE_SIZE } from '@/features/challenge/constants/dashboard'

export default function ChallengeDetailsPage() {
  const params = useParams()
  const quizSetId = params.id as string

  const { quizSet, isLoadingQuizSet } = useQuizSet(quizSetId)
  const { data: challenge, isLoading: isLoadingChallenge } =
    useChallengeByQuizSetId(quizSetId)
  const { page, handlePageChange } = useChallengePagination()
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useLeaderboard(
    challenge?.id,
    page,
    DEFAULT_LEADERBOARD_PAGE_SIZE
  )

  const { handleBack } = useChallengeActions(quizSetId)
  const shareUrl = useChallengeShareUrl(challenge)

  if (isLoadingQuizSet || isLoadingChallenge) {
    return <ChallengeLoading />
  }

  if (!challenge) {
    return <ChallengeError onBack={handleBack} />
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

