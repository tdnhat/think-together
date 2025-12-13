'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ArrowLeft,
  Copy,
  ExternalLink,
  Trophy,
  Users,
  Calendar,
  Share2,
  QrCode
} from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { Input } from '@/shared/ui/input'
import { useChallengeByQuizSetId, useLeaderboard, LeaderboardTable } from '@/features/challenge'
import { useQuizSet } from '@/features/quiz/hooks/use-quiz-set'
import { toast } from 'sonner'

export default function ChallengeDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const quizSetId = params.id as string
  const [showQRCode, setShowQRCode] = useState(false)

  const { quizSet, isLoadingQuizSet } = useQuizSet(quizSetId)
  const { data: challenge, isLoading: isLoadingChallenge } = useChallengeByQuizSetId(quizSetId)
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useLeaderboard(challenge?.id)

  const handleBack = () => {
    router.push(`/quiz/${quizSetId}`)
  }

  const shareUrl = challenge ? `${typeof window !== 'undefined' ? window.location.origin : ''}/challenge/${challenge.shareLink}` : ''

  const handleCopyLink = async () => {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Đã sao chép liên kết!')
    } catch (error) {
      toast.error('Không thể sao chép liên kết')
    }
  }

  const handleShare = async () => {
    if (!shareUrl || !challenge) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: challenge.title,
          text: `Tham gia thử thách "${challenge.title}" cùng tôi!`,
          url: shareUrl,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      handleCopyLink()
    }
  }

  const handleOpenChallenge = () => {
    if (!challenge) return
    window.open(`/challenge/${challenge.shareLink}`, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="neutral" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              {challenge.title}
            </h1>
            {quizSet && (
              <p className="text-sm text-[var(--text-secondary)]">
                Từ bộ trắc nghiệm: {quizSet.title}
              </p>
            )}
          </div>
          <Badge variant={challenge.status === 'Active' ? 'default' : 'neutral'}>
            {challenge.status === 'Active' ? 'Đang hoạt động' : 'Đã đóng'}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Share Link & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Share Link Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Liên kết chia sẻ
                </CardTitle>
                <CardDescription>
                  Chia sẻ liên kết này để mời người khác tham gia thử thách
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button variant="neutral" size="icon" onClick={handleCopyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                  </Button>
                  <Button variant="neutral" onClick={handleOpenChallenge} className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Mở thử thách
                  </Button>
                  <Button
                    variant="neutral"
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    {showQRCode ? 'Ẩn QR' : 'Hiện QR'}
                  </Button>
                </div>

                {showQRCode && (
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    {/* Simple QR code placeholder - you can integrate a QR library */}
                    <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-500 text-center px-4">
                        QR Code cho<br/>{challenge.shareLink}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Bảng xếp hạng
                </CardTitle>
                <CardDescription>
                  Top người chơi đạt điểm cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLeaderboard ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" />
                  </div>
                ) : leaderboard && leaderboard.entries.length > 0 ? (
                  <LeaderboardTable entries={leaderboard.entries} />
                ) : (
                  <div className="text-center py-8 text-[var(--text-secondary)]">
                    <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Chưa có ai hoàn thành thử thách này.</p>
                    <p className="text-sm mt-1">Hãy chia sẻ để mời bạn bè tham gia!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Challenge Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Users className="h-4 w-4" />
                    <span>Lượt chơi</span>
                  </div>
                  <span className="font-bold text-[var(--text-primary)]">
                    {challenge.playCount}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Calendar className="h-4 w-4" />
                    <span>Ngày tạo</span>
                  </div>
                  <span className="text-sm text-[var(--text-primary)]">
                    {formatDate(challenge.createdAt)}
                  </span>
                </div>

                {challenge.updatedAt && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Calendar className="h-4 w-4" />
                        <span>Cập nhật</span>
                      </div>
                      <span className="text-sm text-[var(--text-primary)]">
                        {formatDate(challenge.updatedAt)}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {challenge.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {challenge.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

