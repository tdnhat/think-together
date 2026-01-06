'use client'

import { useState } from 'react'
import { Plus, BookOpen } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { EmptyState } from '@/shared/components/page'
import { Skeleton } from '@/shared/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
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
  isTeacher?: boolean
  onCreateNew?: () => void
  onView?: (homework: HomeworkDto) => void
  onEdit?: (homework: HomeworkDto) => void
  onDelete?: (homework: HomeworkDto) => void
  onStart?: (homework: HomeworkDto) => void
  onViewDetails?: (homework: HomeworkDto) => void
  className?: string
}

export function HomeworkList({
  homeworks,
  pagination,
  isLoading = false,
  isTeacher = false,
  onCreateNew,
  onView,
  onEdit,
  onDelete,
  onStart,
  onViewDetails,
  className = '',
}: Readonly<HomeworkListProps>) {
  const [filter, setFilter] = useState<'all' | 'not-done' | 'done'>('all')

  // Filter homeworks based on selected filter
  const filteredHomeworks = homeworks.filter((homework) => {
    if (filter === 'all') return true
    if (filter === 'done') return homework.hasSubmission === true
    if (filter === 'not-done') return homework.hasSubmission !== true
    return true
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {onCreateNew && (
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Bài tập về nhà
          </h2>
          <Button onClick={onCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Tạo bài tập mới
          </Button>
        </div>
      )}

      {/* Filter Tabs */}
      {!onCreateNew && homeworks.length > 0 && (
        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="not-done">Chưa làm</TabsTrigger>
            <TabsTrigger value="done">Đã làm</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-full flex flex-col">
              <CardContent className="p-4 flex flex-col h-full">
                {/* Header skeleton */}
                <div className="pb-3 border-b border-border mb-3">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Main content skeleton */}
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3 w-2/5 mt-2" />
                </div>

                {/* Button skeleton at bottom */}
                <div className="mt-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Homeworks Grid */}
      {!isLoading && filteredHomeworks.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 items-stretch">
            {filteredHomeworks.map((homework) => (
              <HomeworkCard
                key={homework.id}
                homework={homework}
                isTeacher={isTeacher}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onStart={onStart}
                onViewDetails={onViewDetails}
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
      {!isLoading && filteredHomeworks.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title={filter === 'all'
            ? CLASS_CONSTANTS.MESSAGES.NO_HOMEWORKS
            : filter === 'done'
              ? 'Chưa có bài tập đã làm'
              : 'Chưa có bài tập chưa làm'}
          description={filter === 'all'
            ? CLASS_CONSTANTS.MESSAGES.NO_HOMEWORKS_DESCRIPTION
            : filter === 'done'
              ? 'Bạn chưa hoàn thành bài tập nào'
              : 'Tất cả bài tập đã được hoàn thành'}
          action={onCreateNew ? {
            label: 'Tạo bài tập đầu tiên',
            onClick: onCreateNew
          } : undefined}
        />
      )}
    </div>
  )
}
