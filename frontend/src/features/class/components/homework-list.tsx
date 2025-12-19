'use client'

import { Plus, BookOpen } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { PaginationControls } from '@/shared/components/pagination-controls'
import { HomeworkCard } from './homework-card'
import { CLASS_CONSTANTS } from '../constants'
import type { HomeworkDto } from '../types'

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface HomeworkListProps {
  homeworks: HomeworkDto[]
  pagination?: PaginationInfo
  isLoading?: boolean
  onCreateNew?: () => void
  onView?: (homework: HomeworkDto) => void
  onEdit?: (homework: HomeworkDto) => void
  onDelete?: (homework: HomeworkDto) => void
  onStart?: (homework: HomeworkDto) => void
  className?: string
}

export function HomeworkList({
  homeworks,
  pagination,
  isLoading = false,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
  onStart,
  className = '',
}: Readonly<HomeworkListProps>) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {onCreateNew && (
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
            Bài tập về nhà
          </h2>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo bài tập mới
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Homeworks Grid */}
      {!isLoading && homeworks.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {homeworks.map((homework) => (
              <HomeworkCard
                key={homework.id}
                homework={homework}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onStart={onStart}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col items-center gap-2">
              <PaginationControls
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onPageChange={(page) => {
                  // This will be handled by parent component
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && homeworks.length === 0 && (
        <Card className="flex flex-col items-center justify-center border-dashed border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] py-20 px-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
            <BookOpen className="h-8 w-8 text-[var(--brand-primary)]" />
          </div>
          <h3 className="mb-2 font-heading text-xl text-[var(--text-primary)]">
            {CLASS_CONSTANTS.MESSAGES.NO_HOMEWORKS}
          </h3>
          <p className="text-[var(--text-secondary)]">
            {CLASS_CONSTANTS.MESSAGES.NO_HOMEWORKS_DESCRIPTION}
          </p>
          {onCreateNew && (
            <Button onClick={onCreateNew} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Tạo bài tập đầu tiên
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
