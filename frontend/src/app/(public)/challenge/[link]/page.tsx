'use client'

import { Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { PageLayout, PageMain } from '@/shared/components'
import {
  StartChallengeForm,
  useChallengeLinkResolver,
} from '@/features/challenge'
import { useChallengeStart } from '@/features/challenge/hooks/public'
import {
  ChallengeStartLoading,
  ChallengeStartError,
  ChallengeInfoCard,
  ChallengeStartHeader,
  ChallengeStartFooter,
} from '@/features/challenge/components/public'

function ChallengeStartContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const shareLink = params.link as string
  const homeworkId = searchParams.get('homeworkId')

  const { data: challenge, isLoading, error } = useChallengeLinkResolver(shareLink)
  const { handleStart, isStarting } = useChallengeStart({
    challenge,
    shareLink,
    homeworkId,
  })

  if (isLoading) {
    return <ChallengeStartLoading />
  }

  if (error || !challenge) {
    return <ChallengeStartError />
  }

  return (
    <PageLayout>
      <ChallengeStartHeader />

      <PageMain centered>
        <div className="max-w-2xl space-y-6">
          <ChallengeInfoCard challenge={challenge} />

          <StartChallengeForm
            challenge={challenge}
            isLoading={isStarting}
            onSubmit={handleStart}
          />
        </div>
      </PageMain>

      <ChallengeStartFooter />
    </PageLayout>
  )
}

export default function ChallengeStartPage() {
  return (
    <Suspense fallback={<ChallengeStartLoading />}>
      <ChallengeStartContent />
    </Suspense>
  )
}

