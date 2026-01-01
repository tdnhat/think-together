'use client'

import {MoreVertical, Edit, Trash2, Share, Play, Eye, Trophy, Copy} from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import ImageCard from '@/shared/ui/image-card'
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

  const overlay = (
    <>
      {/* Status Badge */}
      <div className="absolute top-3 left-3">
        <Badge
          variant={quizSet.isPublished ? 'default' : 'secondary'}
          className="text-xs font-semibold"
        >
          {quizSet.isPublished ? 'Đã xuất bản' : 'Nháp'}
        </Badge>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-3 right-3 flex gap-2">
        {onView && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onView(quizSet)}
            className="bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200"
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
            {onDuplicate && (
              <DropdownMenuItem onClick={() => onDuplicate(quizSet)}>
                <Copy className="mr-2 h-4 w-4" />
                Nhân bản
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(quizSet)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  return (
    <ImageCard
      imageUrl={coverImage}
      imageAlt={quizSet.title}
      className={`group transition-all duration-200 ${className}`}
      aspectRatio="aspect-video"
      imageOverlay={overlay}
    >
      <div className="flex flex-col gap-3">
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-bold text-foreground line-clamp-2 leading-tight">
            {quizSet.title}
          </h3>

          {quizSet.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {quizSet.description}
            </p>
          )}
        </div>

        <div className="pt-0 space-y-3">
          {/* Category Badge */}
          {quizSet.categoryName && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {quizSet.categoryName}
              </Badge>
            </div>
          )}

          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="default" className="gap-1.5">
                <span className="font-heading text-sm font-bold text-primary-foreground">
                  {questionCount}
                </span>
                <span className="text-xs font-medium text-primary-foreground">
                  câu hỏi
                </span>
              </Badge>

              {quizSet.creatorName && (
                <span className="text-xs text-muted-foreground">
                  bởi {quizSet.creatorName}
                </span>
              )}
            </div>

            <span className="text-xs font-medium text-muted-foreground">
              {formatDate(quizSet.updatedAt)}
            </span>
          </div>
        </div>
      </div>
    </ImageCard>
  )
}
