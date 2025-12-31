'use client'

import { useState } from 'react'
import { Copy, ExternalLink, Share2, QrCode } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { toast } from '@/lib/utils/toast'
import type { ChallengeDto } from '../types'

interface ChallengeShareCardProps {
  challenge: ChallengeDto
  shareUrl: string
}

export function ChallengeShareCard({ challenge, shareUrl }: ChallengeShareCardProps) {
  const [showQRCode, setShowQRCode] = useState(false)

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

  return (
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
          <Button variant="outline" size="icon" onClick={handleCopyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </Button>
          <Button variant="outline" onClick={handleOpenChallenge} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Mở thử thách
          </Button>
          <Button
            variant="outline"
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
  )
}
