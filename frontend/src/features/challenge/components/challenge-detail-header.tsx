'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import type { ChallengeDto } from '../types'

interface ChallengeDetailHeaderProps {
  challenge: ChallengeDto
  quizSetTitle?: string
  onBack: () => void
}

export function ChallengeDetailHeader({
  challenge,
  quizSetTitle,
  onBack,
}: ChallengeDetailHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button variant="neutral" size="icon" onClick={onBack}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          {challenge.title}
        </h1>
        {quizSetTitle && (
          <p className="text-sm text-[var(--text-secondary)]">
            Từ bộ trắc nghiệm: {quizSetTitle}
          </p>
        )}
      </div>
      <Badge variant={challenge.status === 'Active' ? 'default' : 'neutral'}>
        {challenge.status === 'Active' ? 'Đang hoạt động' : 'Đã đóng'}
      </Badge>
    </div>
  )
}
