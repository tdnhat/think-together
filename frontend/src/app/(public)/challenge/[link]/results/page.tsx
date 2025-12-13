'use client'

import { Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Trophy, Home, Share2 } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import {
  ResultsSummary,
  LeaderboardTable,
  useAttempt,
  useLeaderboard,
} from '@/features/challenge'
import type { ChallengeResultsSummary } from '@/features/challenge'

function ChallengeResultsContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const shareLink = params.link as string
  const attemptId = searchParams.get('attemptId')

  // Fetch attempt directly by attemptId
  const { data: attempt, isLoading: isLoadingAttempt } = useAttempt(attemptId || undefined)

  // Fetch leaderboard using challengeId from attempt
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useLeaderboard(
    attempt?.challengeId
  )

  const handleShare = async () => {
    const url = `${window.location.origin}/challenge/${shareLink}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ThinkTogether Challenge',
          text: 'Tham gia thử thách này cùng tôi!',
          url,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url)
      alert('Đã sao chép liên kết!')
    }
  }

  const handleRetry = () => {
    router.push(`/challenge/${shareLink}`)
  }

  const handleHome = () => {
    router.push('/home')
  }

  if (isLoadingAttempt || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!attemptId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-[var(--text-primary)] font-semibold mb-2">
              Không tìm thấy kết quả
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              Vui lòng kiểm tra lại liên kết.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Find user rank in leaderboard
  const userRank = leaderboard?.entries.find(
    (entry) => entry.attemptId === attemptId
  )?.rank

  // Create results summary
  const resultsSummary: ChallengeResultsSummary = {
    attemptId: attempt.id,
    challengeTitle: 'Thử thách', // We'd need to fetch the challenge separately
    score: attempt.scoreAchieved,
    correctAnswers: attempt.correctAnswers,
    totalQuestions: attempt.totalQuestions,
    accuracy: (attempt.correctAnswers / attempt.totalQuestions) * 100,
    completionTimeMs: attempt.completionTimeMs,
    rank: userRank,
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 border-b border-[var(--border)]">
        <div className="container mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-[var(--brand-primary)]" />
            <span className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              Kết quả thử thách
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-4xl space-y-8">
          {/* Results Summary */}
          <ResultsSummary results={resultsSummary} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="default" onClick={handleRetry} className="gap-2">
              Thử lại
            </Button>
            <Button variant="neutral" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Chia sẻ
            </Button>
            <Button variant="neutral" onClick={handleHome} className="gap-2">
              <Home className="h-4 w-4" />
              Về trang chủ
            </Button>
          </div>

          {/* Leaderboard */}
          {leaderboard && leaderboard.entries.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[var(--brand-primary)]" />
                  <h2 className="text-2xl font-heading font-bold text-[var(--text-primary)]">
                    Bảng xếp hạng
                  </h2>
                </div>

                {isLoadingLeaderboard ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <LeaderboardTable
                    entries={leaderboard.entries}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-[var(--text-tertiary)] border-t border-[var(--border)]">
        <p>© 2024 ThinkTogether. Học cùng nhau, vui hơn gấp bội!</p>
      </footer>
    </div>
  )
}

export default function ChallengeResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ChallengeResultsContent />
    </Suspense>
  )
}

