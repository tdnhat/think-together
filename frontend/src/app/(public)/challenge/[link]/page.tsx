'use client'

import { Suspense, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Trophy, Users } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { PageLayout, PageHeader, PageMain, PageFooter } from '@/shared/components'
import {
  StartChallengeForm,
  useChallengeLinkResolver,
  useStartAttempt,
} from '@/features/challenge'
import { useAuthStore, selectUser } from '@/features/auth/stores/auth.store'

function ChallengeStartContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const shareLink = params.link as string
  const homeworkId = searchParams.get('homeworkId')
  const user = useAuthStore(selectUser)

  const { data: challenge, isLoading, error } = useChallengeLinkResolver(shareLink)
  const { mutate: startAttempt, isPending } = useStartAttempt()

  // Auto-start if user is logged in and homeworkId is provided
  useEffect(() => {
    if (challenge && user?.id && homeworkId && !isPending) {
      startAttempt(
        {
          challengeId: challenge.id,
          nickname: user.name || user.email || 'Học sinh',
          userId: user.id,
          homeworkId: homeworkId,
        },
        {
          onSuccess: (attempt) => {
            // Navigate to taking page with attemptId and homeworkId
            router.push(`/challenge/${shareLink}/take?attemptId=${attempt.id}&homeworkId=${homeworkId}`)
          },
        }
      )
    }
  }, [challenge, user, homeworkId, isPending, startAttempt, shareLink, router])

  const handleStart = (nickname: string) => {
    if (!challenge) return

    startAttempt(
      {
        challengeId: challenge.id,
        nickname,
        userId: user?.id,
        homeworkId: homeworkId || undefined,
      },
      {
        onSuccess: (attempt) => {
          // Navigate to taking page with attemptId and homeworkId if present
          const queryParams = new URLSearchParams()
          queryParams.set('attemptId', attempt.id)
          if (homeworkId) {
            queryParams.set('homeworkId', homeworkId)
          }
          router.push(`/challenge/${shareLink}/take?${queryParams.toString()}`)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-[var(--text-primary)] font-semibold mb-2">
              Không tìm thấy thử thách
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              Liên kết thử thách không hợp lệ hoặc đã bị xóa.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader bordered>
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8 text-[var(--brand-primary)]" />
          <span className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            ThinkTogether Challenge
          </span>
        </div>
      </PageHeader>

      {/* Main Content */}
      <PageMain centered>
        <div className="w-full max-w-2xl space-y-6">
          {/* Challenge Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {challenge.playCount} người đã thử
                  </Badge>
                  {challenge.showLeaderboard && (
                    <Badge variant="outline" className="gap-1.5">
                      <Trophy className="h-3.5 w-3.5" />
                      Có bảng xếp hạng
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Start Form */}
          <StartChallengeForm
            challenge={challenge}
            isLoading={isPending}
            onSubmit={handleStart}
          />
        </div>
      </PageMain>

      {/* Footer */}
      <PageFooter>
        <p>© 2024 ThinkTogether. Học cùng nhau, vui hơn gấp bội!</p>
      </PageFooter>
    </PageLayout>
  )
}

export default function ChallengeStartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ChallengeStartContent />
    </Suspense>
  )
}

