'use client'

import { ArrowLeft, Edit, Trash2, Copy, Calendar, Users, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { SafeImage } from '@/shared/components'
import type { ClassDetailDto } from '../types'

interface ClassDetailHeaderProps {
  classData: ClassDetailDto
  isTeacher?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onCopyJoinCode?: () => void
}

export function ClassDetailHeader({
  classData,
  isTeacher = false,
  onEdit,
  onDelete,
  onCopyJoinCode,
}: Readonly<ClassDetailHeaderProps>) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 sm:h-64">
        {classData.coverImageUrl ? (
          <SafeImage
            src={classData.coverImageUrl}
            alt={classData.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <div className="absolute left-4 top-4">
          <Button
            variant="neutral"
            size="icon"
            onClick={handleBack}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </Button>
        </div>

        {/* Actions */}
        {isTeacher && (
          <div className="absolute right-4 top-4 flex gap-2">
            {onEdit && (
              <Button
                variant="neutral"
                size="icon"
                onClick={onEdit}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
              >
                <Edit className="h-4 w-4 text-white" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="neutral"
                size="icon"
                onClick={onDelete}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Class Info */}
      <div className="relative -mt-16 rounded-t-2xl bg-[var(--bg-surface)] px-6 pb-6 pt-8 shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="font-heading text-3xl font-bold text-[var(--text-primary)]">
              {classData.name}
            </h1>
            {classData.description && (
              <p className="mt-2 text-[var(--text-secondary)]">{classData.description}</p>
            )}
            {classData.teacherName && (
              <p className="mt-1 text-sm text-[var(--text-tertiary)]">
                Giáo viên: {classData.teacherName}
              </p>
            )}
          </div>

          {/* Join Code (Teacher only) */}
          {isTeacher && (
            <div className="flex shrink-0 items-center gap-2 rounded-lg border-2 border-[var(--brand-primary)] bg-[var(--bg-surface-secondary)] px-4 py-2">
              <Calendar className="h-4 w-4 text-[var(--brand-primary)]" />
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-secondary)]">Mã tham gia</span>
                <div className="flex items-center gap-2">
                  <code className="font-mono text-lg font-bold text-[var(--brand-primary)]">
                    {classData.joinCode}
                  </code>
                  {onCopyJoinCode && (
                    <Button
                      variant="neutral"
                      size="icon"
                      onClick={onCopyJoinCode}
                      className="h-6 w-6"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-[var(--brand-primary)]/10 p-2">
              <Users className="h-5 w-5 text-[var(--brand-primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Thành viên</p>
              <p className="font-semibold text-[var(--text-primary)]">
                {classData.memberCount || classData.members?.length || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-[var(--brand-primary)]/10 p-2">
              <BookOpen className="h-5 w-5 text-[var(--brand-primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Bài tập</p>
              <p className="font-semibold text-[var(--text-primary)]">
                {classData.homeworkCount || classData.homeworks?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
