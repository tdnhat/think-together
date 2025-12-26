'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { SearchInput } from '@/shared/components'
import { Skeleton } from '@/shared/ui/skeleton'
import { PaginationControls } from '@/shared/components/pagination-controls'
import { ClassCard } from './class-card'
import { CLASS_CONSTANTS } from '../constants'
import type { ClassDto } from '../types'

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface ClassListProps {
  classes: ClassDto[]
  pagination?: PaginationInfo
  isLoading?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onPageChange?: (page: number) => void
  onCreateNew?: () => void
  onView?: (classData: ClassDto) => void
  onEdit?: (classData: ClassDto) => void
  onDelete?: (classData: ClassDto) => void
  onCopyJoinCode?: (joinCode: string) => void
  className?: string
}

export function ClassList({
  classes,
  pagination,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  onPageChange,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
  onCopyJoinCode,
  className = '',
}: Readonly<ClassListProps>) {
  const handleCopyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode).then(() => {
      // Toast notification can be added here
      if (onCopyJoinCode) {
        onCopyJoinCode(joinCode)
      }
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Search and Create */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          {onSearchChange && (
            <SearchInput
              placeholder="Tìm kiếm lớp học..."
              value={searchQuery}
              onChange={(value) => onSearchChange(value)}
              className="max-w-md"
            />
          )}
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo lớp học mới
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Classes Grid */}
      {!isLoading && classes.length > 0 && (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onCopyJoinCode={handleCopyJoinCode}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && onPageChange && (
            <div className="flex flex-col items-center gap-2">
              <PaginationControls
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && classes.length === 0 && (
        <Card className="flex flex-col items-center justify-center border-dashed border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] py-20 px-6 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
            <Search className="h-8 w-8 text-[var(--brand-primary)]" />
          </div>
          <h3 className="mb-2 font-heading text-xl text-[var(--text-primary)]">
            {searchQuery
              ? 'Không tìm thấy lớp học'
              : CLASS_CONSTANTS.MESSAGES.NO_CLASSES}
          </h3>
          <p className="text-[var(--text-secondary)]">
            {searchQuery
              ? 'Thử tìm kiếm với từ khóa khác'
              : CLASS_CONSTANTS.MESSAGES.NO_CLASSES_DESCRIPTION}
          </p>
          {onCreateNew && !searchQuery && (
            <Button onClick={onCreateNew} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Tạo lớp học đầu tiên
            </Button>
          )}
        </Card>
      )}
    </div>
  )
}
