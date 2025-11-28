'use client'

import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  GripVertical,
  CircleDot,
  CheckCircle,
  CheckSquare,
  Link,
  ArrowUpDown,
  Video,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { QuestionType, type QuestionDto } from '@/types/api'
import { QUESTION_CONSTANTS } from '../constants'

interface QuestionCardProps {
  question: QuestionDto
  index: number
  onEdit?: (question: QuestionDto) => void
  onDelete?: (question: QuestionDto) => void
  onDuplicate?: (question: QuestionDto) => void
  isDragging?: boolean
}

const questionTypeIcons: Record<QuestionType, typeof CircleDot> = {
  [QuestionType.SINGLE_CHOICE]: CircleDot,
  [QuestionType.TRUE_FALSE]: CheckCircle,
  [QuestionType.MULTIPLE_CHOICE]: CheckSquare,
  [QuestionType.MATCHING]: Link,
  [QuestionType.ORDERING]: ArrowUpDown,
  [QuestionType.VIDEO]: Video,
}

const questionTypeColors: Record<QuestionType, 'default' | 'neutral'> = {
  [QuestionType.SINGLE_CHOICE]: 'default',
  [QuestionType.TRUE_FALSE]: 'default',
  [QuestionType.MULTIPLE_CHOICE]: 'neutral',
  [QuestionType.MATCHING]: 'default',
  [QuestionType.ORDERING]: 'neutral',
  [QuestionType.VIDEO]: 'default',
}

export function QuestionCard({
  question,
  index,
  onEdit,
  onDelete,
  onDuplicate,
  isDragging = false,
}: QuestionCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const Icon = questionTypeIcons[question.type]
  const typeInfo = QUESTION_CONSTANTS.TYPES[question.type]
  const typeColor = questionTypeColors[question.type]

  const handleEdit = () => {
    onEdit?.(question)
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = () => {
    onDelete?.(question)
    setShowDeleteDialog(false)
  }

  const handleDuplicate = () => {
    onDuplicate?.(question)
  }

  const getQuestionSummary = () => {
    switch (question.type) {
      case QuestionType.SINGLE_CHOICE:
      case QuestionType.TRUE_FALSE:
      case QuestionType.MULTIPLE_CHOICE:
        return `${question.options?.length || 0} lựa chọn`
      case QuestionType.MATCHING:
        return `${question.matchingPairs?.length || 0} cặp ghép`
      case QuestionType.ORDERING:
        return `${question.orderingItems?.length || 0} mục sắp xếp`
      case QuestionType.VIDEO:
        return 'Video'
      default:
        return ''
    }
  }

  return (
    <Card
      className={`group transition-all duration-300 hover:border-[var(--brand-primary)] hover:shadow-brutal-primary-sm hover:-translate-y-1 hover:bg-gradient-to-r hover:from-[var(--bg-surface)] hover:to-[var(--brand-primary-light)]/5 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing text-[var(--text-tertiary)] hover:text-[var(--brand-primary)] transition-colors shrink-0 mt-1">
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Question Number */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-3 border-[var(--brand-primary-shadow)] bg-[var(--bg-surface)] font-heading text-sm font-bold shadow-brutal-primary-xs">
            {index + 1}
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant={typeColor}
                className="gap-1 font-bold"
              >
                <Icon className="h-3 w-3" />
                {typeInfo.label}
              </Badge>
              <div className="flex items-center gap-1 rounded-md border border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] px-2 py-0.5">
                <Clock className="h-3 w-3 text-[var(--text-tertiary)]" />
                <span className="text-xs font-medium text-[var(--text-secondary)]">
                  {question.timeLimit}s
                </span>
              </div>
            </div>
            
            <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 mb-1.5">
              {question.content}
            </p>
            
            <p className="text-xs text-[var(--text-tertiary)]">
              {getQuestionSummary()}
            </p>
          </div>
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="neutral"
              size="icon"
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onEdit && (
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
            )}
            {onDuplicate && (
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Sao chép
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={handleDeleteClick} className="text-[var(--color-error)] focus:text-[var(--color-error)]">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="border-b-2 border-[var(--color-border-main)] bg-[var(--bg-surface-secondary)] -mx-6 -mt-6 px-6 py-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-3 border-[var(--color-error)] bg-[var(--color-error)]/10">
                <AlertTriangle className="h-5 w-5 text-[var(--color-error)]" />
              </div>
              <AlertDialogTitle className="text-lg">Xóa câu hỏi?</AlertDialogTitle>
            </div>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-base leading-relaxed">
            Bạn có chắc chắn muốn xóa câu hỏi <span className="font-semibold text-[var(--text-primary)]">&quot;{question.content}&quot;</span>? 
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel asChild>
              <Button variant="neutral" size="default">
                Hủy
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="default"
                size="default"
                onClick={handleDeleteConfirm}
              >
                Xóa câu hỏi
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview of options/pairs/items (optional, can be expanded) */}
      {question.options && question.options.length > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-1.5 pl-12">
            {question.options.slice(0, 3).map((option, idx) => (
              <div
                key={option.id || `option-${question.id}-${idx}`}
                className="flex items-center gap-2 rounded-md border border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] px-2.5 py-1.5"
              >
                <span className="font-heading text-xs font-bold text-[var(--text-primary)]">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1 text-xs text-[var(--text-secondary)] line-clamp-1">
                  {option.content}
                </span>
                {option.isCorrect && (
                  <CheckCircle className="h-3.5 w-3.5 text-[var(--color-success)] flex-shrink-0" />
                )}
              </div>
            ))}
            {question.options.length > 3 && (
              <p className="text-xs font-medium text-[var(--text-tertiary)] pl-2">
                +{question.options.length - 3} lựa chọn khác
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

