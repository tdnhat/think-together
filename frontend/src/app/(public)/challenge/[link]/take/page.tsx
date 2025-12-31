'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { PageLayout, PageMain } from '@/shared/components'
import {
  ChallengeProgress,
  QuestionDisplay,
  QuestionGrid,
  useChallengeStore,
} from '@/features/challenge'
import {
  useChallengeAttempt,
  useChallengeAnswers,
  useChallengeSubmission,
  useChallengeAnswerHandler,
  useChallengeTimeHandler,
} from '@/features/challenge/hooks/take'
import {
  ChallengeTakeLoading,
  ChallengeTakeError,
  ChallengeTimeWarning,
  ChallengeNavigationButtons,
} from '@/features/challenge/components/take'

function ChallengeTakingContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const shareLink = params.link as string
  const attemptId = searchParams.get('attemptId')
  const homeworkId = searchParams.get('homeworkId')

  const { attempt, isLoading, startTime } = useChallengeAttempt(attemptId)
  useChallengeAnswers()
  const { handleAnswerChange } = useChallengeAnswerHandler(startTime)
  const { handleComplete, isSubmitting } = useChallengeSubmission({
    attempt,
    shareLink,
    homeworkId,
  })

  useChallengeTimeHandler(attempt, handleComplete)

  const goToNextQuestion = useChallengeStore((s) => s.goToNextQuestion)
  const goToPreviousQuestion = useChallengeStore((s) => s.goToPreviousQuestion)

  if (isLoading || !attempt) {
    return <ChallengeTakeLoading />
  }

  if (!attemptId) {
    return <ChallengeTakeError />
  }

  return (
    <PageLayout>
      <PageMain className="py-6">
        <div className="space-y-4">
          <ChallengeProgress />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <QuestionDisplay onAnswerChange={handleAnswerChange} />

            <ChallengeTimeWarning />

            <ChallengeNavigationButtons
              onPrevious={goToPreviousQuestion}
              onNext={goToNextQuestion}
              onSubmit={handleComplete}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <QuestionGrid
                questions={attempt.questions}
                onQuestionClick={(index) => {
                  useChallengeStore.getState().jumpToQuestion(index)
                }}
                onSubmit={handleComplete}
                isSubmitting={isSubmitting}
                submitDisabled={isSubmitting}
              />
            </div>
          </div>
        </div>
      </PageMain>
    </PageLayout>
  )
}

export default function ChallengeTakePage() {
  return (
    <Suspense fallback={<ChallengeTakeLoading />}>
      <ChallengeTakingContent />
    </Suspense>
  )
}
