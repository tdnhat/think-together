'use client'

import { Users, BookOpen, Calendar, MoreVertical, Edit, Trash2, Eye, Copy } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import ImageCard from '@/shared/ui/image-card'
import { CLASS_CONSTANTS } from '../constants'
import type { ClassDto } from '../types'

interface ClassCardProps {
  classData: ClassDto
  onView?: (classData: ClassDto) => void
  onEdit?: (classData: ClassDto) => void
  onDelete?: (classData: ClassDto) => void
  onCopyJoinCode?: (joinCode: string) => void
  className?: string
}

export function ClassCard({
  classData,
  onView,
  onEdit,
  onDelete,
  onCopyJoinCode,
  className = '',
}: Readonly<ClassCardProps>) {
  const coverImage = classData.coverImageUrl || '/images/default-class-cover.jpg'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const overlay = (
    <div className="absolute top-3 right-3 flex gap-2">
      {onView && (
        <Button
          variant="neutral"
          size="icon"
          onClick={() => onView(classData)}
          className="bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)]"
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
            className="bg-[var(--bg-surface)] hover:bg-[var(--bg-surface)]"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onView && (
            <DropdownMenuItem onClick={() => onView(classData)}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(classData)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
          )}
          {onCopyJoinCode && (
            <DropdownMenuItem onClick={() => onCopyJoinCode(classData.joinCode)}>
              <Copy className="mr-2 h-4 w-4" />
              Sao chép mã tham gia
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={() => onDelete(classData)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa lớp học
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <ImageCard
      imageUrl={coverImage}
      imageAlt={classData.name}
      className={`group transition-all duration-200 hover:shadow-lg ${className}`}
      aspectRatio="aspect-video"
      imageOverlay={overlay}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] truncate">
              {classData.name}
            </h3>
            {classData.description && (
              <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                {classData.description}
              </p>
            )}
          </div>
        </div>

        <div className="pt-0">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{classData.memberCount || 0} thành viên</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{classData.homeworkCount || 0} bài tập</span>
            </div>
          </div>

          {/* Join Code */}
          <div className="mt-3 flex items-center justify-between rounded-lg border-2 border-border bg-[var(--bg-surface-secondary)] p-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[var(--text-secondary)]" />
              <span className="text-xs text-[var(--text-secondary)]">Mã tham gia:</span>
              <code className="font-mono font-bold text-[var(--brand-primary)]">
                {classData.joinCode}
              </code>
            </div>
            {onCopyJoinCode && (
              <Button
                variant="neutral"
                size="sm"
                onClick={() => onCopyJoinCode(classData.joinCode)}
                className="h-7 px-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Created Date */}
          <div className="mt-2 text-xs text-[var(--text-tertiary)]">
            Tạo lúc: {formatDate(classData.createdAt)}
          </div>
        </div>
      </div>
    </ImageCard>
  )
}
