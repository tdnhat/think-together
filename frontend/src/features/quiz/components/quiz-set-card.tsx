'use client'

import { MoreVertical, Edit, Trash2, Share, Play, Eye, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { SafeImage } from '@/shared/components'
import { QUIZ_SET_CONSTANTS } from '../constants'
import type { QuizSetDto } from '@/types/api'

interface QuizSetCardProps {
  quizSet: QuizSetDto
  onEdit?: (quizSet: QuizSetDto) => void
  onDelete?: (quizSet: QuizSetDto) => void
  onPublish?: (quizSet: QuizSetDto) => void
  onView?: (quizSet: QuizSetDto) => void
  onHost?: (quizSet: QuizSetDto) => void
  onDuplicate?: (quizSet: QuizSetDto) => void
  onCreateChallenge?: (quizSet: QuizSetDto) => void
  className?: string
}

export function QuizSetCard({
  quizSet,
  onEdit,
  onDelete,
  onPublish,
  onView,
  onHost,
  onDuplicate,
  onCreateChallenge,
  className = '',
}: Readonly<QuizSetCardProps>) {
  const coverImage = quizSet.coverImageUrl || QUIZ_SET_CONSTANTS.DEFAULTS.COVER_IMAGE
  const questionCount = quizSet.questionCount || 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className={`group relative overflow-hidden transition-all duration-200 ${className}`}>
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-surface-secondary)]">
        <SafeImage
          src={coverImage}
          alt={quizSet.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={quizSet.isPublished ? 'default' : 'neutral'}
            className="text-xs font-semibold"
          >
            {quizSet.isPublished ? 'Đã xuất bản' : 'Nháp'}
          </Badge>
        </div>

        {/* Actions Menu */}
        <div className="absolute top-3 right-3 flex gap-2">
          {onView && (
            <Button
              variant="neutral"
              size="icon"
              onClick={() => onView(quizSet)}
              className="bg-[var(--bg-surface)]/95 transition-all duration-200"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="neutral"
                size="icon"
                className="bg-[var(--bg-surface)]/95 transition-all duration-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(quizSet)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {!quizSet.isPublished && onPublish && (
                <DropdownMenuItem onClick={() => onPublish(quizSet)}>
                  <Share className="mr-2 h-4 w-4" />
                  Xuất bản
                </DropdownMenuItem>
              )}
              {onHost && quizSet.isPublished && (
                <DropdownMenuItem onClick={() => onHost(quizSet)}>
                  <Play className="mr-2 h-4 w-4" />
                  Tổ chức trò chơi
                </DropdownMenuItem>
              )}
              {onCreateChallenge && quizSet.isPublished && (
                <DropdownMenuItem onClick={() => onCreateChallenge(quizSet)}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Tạo thử thách
                </DropdownMenuItem>
              )}
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(quizSet)}>
                  <Share className="mr-2 h-4 w-4" />
                  Sao chép
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(quizSet)}
                  className="text-[var(--color-error)] focus:text-[var(--color-error)]"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-bold text-[var(--text-primary)] line-clamp-2 leading-tight">
            {quizSet.title}
          </h3>

          {quizSet.description && (
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
              {quizSet.description}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="default" className="gap-1.5">
              <span className="font-heading text-sm font-bold text-[var(--brand-primary)]">
                {questionCount}
              </span>
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                câu hỏi
              </span>
            </Badge>

            {quizSet.creatorName && (
              <span className="text-xs text-[var(--text-tertiary)]">
                bởi {quizSet.creatorName}
              </span>
            )}
          </div>

          <span className="text-xs font-medium text-[var(--text-tertiary)]">
            {formatDate(quizSet.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
