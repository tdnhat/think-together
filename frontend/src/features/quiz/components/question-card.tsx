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
  Volume2,
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
  [QuestionType.AUDIO]: Volume2,
}

const questionTypeColors: Record<QuestionType, 'default' | 'outline'> = {
  [QuestionType.SINGLE_CHOICE]: 'default',
  [QuestionType.TRUE_FALSE]: 'default',
  [QuestionType.MULTIPLE_CHOICE]: 'outline',
  [QuestionType.MATCHING]: 'default',
  [QuestionType.ORDERING]: 'outline',
  [QuestionType.VIDEO]: 'default',
  [QuestionType.AUDIO]: 'outline',
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
      className={`group ${isDragging ? 'opacity-50' : ''}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Question Number */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-3 border-primary/20 bg-background font-heading text-sm font-bold">
            {index + 1}
          </div>

          {/* Question Content */}
          <div className="flex-1 min-w-0">
            <Badge
              variant={typeColor}
              className="gap-1 font-bold"
            >
              <Icon className="h-3 w-3" />
              {typeInfo.label}
            </Badge>

            <p className="text-sm font-semibold text-foreground line-clamp-2 my-2">
              {question.content}
            </p>

            <p className="text-xs text-muted-foreground">
              {getQuestionSummary()}
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Preview of options/pairs/items (optional, can be expanded) */}
      {question.options && question.options.length > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-1.5 pl-12">
            {question.options.slice(0, 3).map((option, idx) => (
              <div
                key={option.id || `option-${question.id}-${idx}`}
                className="flex items-center gap-2 rounded-md border border-border bg-muted px-2.5 py-1.5"
              >
                <span className="font-heading text-xs font-bold text-foreground">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="flex-1 text-xs text-muted-foreground line-clamp-1">
                  {option.content}
                </span>
              </div>
            ))}
            {question.options.length > 3 && (
              <p className="text-xs font-medium text-muted-foreground pl-2">
                +{question.options.length - 3} lựa chọn khác
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

