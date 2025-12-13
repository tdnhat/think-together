'use client'

import { Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Trophy, Users } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import {
  StartChallengeForm,
  useChallengeLinkResolver,
  useStartAttempt,
} from '@/features/challenge'

function ChallengeStartContent() {
  const params = useParams()
  const router = useRouter()
  const shareLink = params.link as string

  const { data: challenge, isLoading, error } = useChallengeLinkResolver(shareLink)
  const { mutate: startAttempt, isPending } = useStartAttempt()

  const handleStart = (nickname: string) => {
    if (!challenge) return

    startAttempt(
      { challengeId: challenge.id, nickname },
      {
        onSuccess: (attempt) => {
          // Navigate to taking page with attemptId
          router.push(`/challenge/${shareLink}/take?attemptId=${attempt.id}`)
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
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 border-b border-[var(--border)]">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-[var(--brand-primary)]" />
            <span className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              ThinkTogether Challenge
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-6">
          {/* Challenge Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="neutral" className="gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {challenge.playCount} người đã thử
                  </Badge>
                  {challenge.showLeaderboard && (
                    <Badge variant="neutral" className="gap-1.5">
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
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-[var(--text-tertiary)] border-t border-[var(--border)]">
        <p>© 2024 ThinkTogether. Học cùng nhau, vui hơn gấp bội!</p>
      </footer>
    </div>
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

