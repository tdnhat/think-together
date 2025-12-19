'use client'

import { Calendar, Clock, Users, MoreVertical, Edit, Trash2, Eye, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { SUBMISSION_STATUS_LABELS } from '../constants'
import type { HomeworkDto } from '../types'

interface HomeworkCardProps {
  homework: HomeworkDto
  onView?: (homework: HomeworkDto) => void
  onEdit?: (homework: HomeworkDto) => void
  onDelete?: (homework: HomeworkDto) => void
  onStart?: (homework: HomeworkDto) => void
  className?: string
}

export function HomeworkCard({
  homework,
  onView,
  onEdit,
  onDelete,
  onStart,
  className = '',
}: Readonly<HomeworkCardProps>) {
  const isOverdue = homework.isOverdue || false
  const dueDate = homework.dueDate ? new Date(homework.dueDate) : null

  const getStatusBadge = () => {
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Quá hạn
        </Badge>
      )
    }
    if (dueDate) {
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      if (daysUntilDue <= 1) {
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            Sắp đến hạn
          </Badge>
        )
      }
    }
    return null
  }

  return (
    <Card className={`group transition-all duration-200 hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] truncate">
                {homework.title}
              </h3>
              {getStatusBadge()}
            </div>
            {homework.quizSetTitle && (
              <p className="text-sm text-[var(--text-secondary)]">
                Bộ câu hỏi: {homework.quizSetTitle}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="neutral" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(homework)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
              )}
              {onStart && (
                <DropdownMenuItem onClick={() => onStart(homework)}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Làm bài
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(homework)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(homework)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Due Date */}
          {dueDate && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Calendar className="h-4 w-4" />
              <span>
                Hạn nộp:{' '}
                <span className={isOverdue ? 'font-semibold text-red-600' : 'font-medium'}>
                  {dueDate.toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </span>
            </div>
          )}

          {/* Time Remaining */}
          {dueDate && !isOverdue && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Clock className="h-4 w-4" />
              <span>
                Còn lại:{' '}
                {formatDistanceToNow(dueDate, {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
            </div>
          )}

          {/* Submission Count */}
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Users className="h-4 w-4" />
            <span>
              {homework.submissionCount || 0} học sinh đã nộp bài
            </span>
          </div>

          {/* Assigned Date */}
          <div className="pt-2 text-xs text-[var(--text-tertiary)]">
            Giao lúc: {new Date(homework.assignedAt).toLocaleDateString('vi-VN')}
          </div>
        </div>

        {/* Action Button */}
        {onStart && (
          <div className="mt-4">
            <Button
              onClick={() => onStart(homework)}
              className="w-full"
              variant={isOverdue ? 'neutral' : 'default'}
            >
              {isOverdue ? 'Xem bài tập' : 'Làm bài ngay'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
