'use client'

import { Play, Trophy, Eye, MoreHorizontal, FileText } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import type { QuizSetDto } from '@/types/api'
import type { ChallengeDto } from '@/features/challenge'

interface QuizActionsProps {
  quizSet: QuizSetDto
  challenge?: ChallengeDto | null
  onStart: () => void
  onCreateChallenge?: () => void
  onViewChallenge?: () => void
  isStarting?: boolean
  isCreatingChallenge?: boolean
  isLoadingChallenge?: boolean
  onExportPdf: () => void
  isExportingPdf: boolean
}

export function QuizActions({
  quizSet,
  challenge,
  onStart,
  onCreateChallenge,
  onViewChallenge,
  isStarting = false,
  isCreatingChallenge = false,
  isLoadingChallenge = false,
  onExportPdf,
  isExportingPdf,
}: QuizActionsProps) {
  const canStart = quizSet.isPublished && (quizSet.questionCount || 0) > 0
  const hasChallenge = !!challenge

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={onStart}
          disabled={!canStart || isStarting}
        >
          <Play className="mr-2 h-5 w-5" />
          {isStarting ? 'Đang khởi động...' : 'Bắt đầu ngay'}
        </Button>

        {hasChallenge && onViewChallenge ? (
          <Button
            variant="neutral"
            size="lg"
            className="w-full"
            onClick={onViewChallenge}
          >
            <Eye className="mr-2 h-5 w-5" />
            Xem thử thách
          </Button>
        ) : onCreateChallenge && (
          <Button
            variant="neutral"
            size="lg"
            className="w-full"
            onClick={onCreateChallenge}
            disabled={!canStart || isCreatingChallenge || isLoadingChallenge}
          >
            <Trophy className="mr-2 h-5 w-5" />
            {isCreatingChallenge ? 'Đang tạo...' : isLoadingChallenge ? 'Đang tải...' : 'Tạo thử thách'}
          </Button>
        )}

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="neutral" size="lg" className="w-full">
              <MoreHorizontal className="mr-2 h-5 w-5" />
              Tùy chọn khác
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[var(--radix-dropdown-menu-trigger-width)]">
            <DropdownMenuItem onClick={onExportPdf} disabled={isExportingPdf}>
              <FileText className="mr-2 h-4 w-4" />
              {isExportingPdf ? 'Đang xuất...' : 'Xuất PDF (cho in ấn)'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!quizSet.isPublished && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Bạn cần xuất bản bộ trắc nghiệm trước khi bắt đầu
          </p>
        )}

        {quizSet.isPublished && (quizSet.questionCount || 0) === 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Bạn cần thêm ít nhất một câu hỏi để bắt đầu
          </p>
        )}

        {quizSet.isPublished && (quizSet.questionCount || 0) > 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Sẵn sàng để bắt đầu với {quizSet.questionCount} câu hỏi
          </p>
        )}
      </CardContent>
    </Card >
  )
}
