'use client'

import { Plus, Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/components'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu'
import { PaginationControls } from '@/shared/components'
import { QuizSetCard } from './quiz-set-card'
import { QUIZ_SET_CONSTANTS } from '../constants'
import type { QuizSetDto } from '@/types/api'

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface QuizSetListProps {
  readonly quizSets: QuizSetDto[]
  readonly pagination?: PaginationInfo
  readonly isLoading?: boolean
  readonly searchQuery?: string
  readonly onSearchChange?: (query: string) => void
  readonly sortBy?: 'newest' | 'oldest' | 'title' | 'questions'
  readonly onSortChange?: (sort: 'newest' | 'oldest' | 'title' | 'questions') => void
  readonly filterBy?: 'all' | 'published' | 'draft'
  readonly onFilterChange?: (filter: 'all' | 'published' | 'draft') => void
  readonly onPageChange?: (page: number) => void
  readonly onCreateNew?: () => void
  readonly onEdit?: (quizSet: QuizSetDto) => void
  readonly onDelete?: (quizSet: QuizSetDto) => void
  readonly onPublish?: (quizSet: QuizSetDto) => void
  readonly onView?: (quizSet: QuizSetDto) => void
  readonly onHost?: (quizSet: QuizSetDto) => void
  readonly onDuplicate?: (quizSet: QuizSetDto) => void
  readonly className?: string
}

export function QuizSetList({
  quizSets,
  pagination,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  sortBy = 'newest',
  onSortChange,
  filterBy = 'all',
  onFilterChange,
  onPageChange,
  onCreateNew,
  onEdit,
  onDelete,
  onPublish,
  onView,
  onHost,
  onDuplicate,
  className = '',
}: QuizSetListProps) {
  const total = pagination?.total || quizSets.length
  const publishedCount = pagination ? undefined : quizSets.filter(q => q.isPublished).length
  const draftCount = pagination ? undefined : quizSets.filter(q => !q.isPublished).length

  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Filters skeleton */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Skeleton className="h-10 w-full max-w-sm" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => `skeleton-card-${i}`).map((key) => (
              <Card key={key} className="space-y-4 p-6">
                <Skeleton className="h-32 w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold text-[var(--text-primary)]">
              Bộ trắc nghiệm của tôi
            </h1>
            <p className="text-base text-[var(--text-secondary)]">
              Quản lý và tạo bộ câu hỏi cho các buổi học của bạn
            </p>
          </div>

          {onCreateNew && (
            <Button
              onClick={onCreateNew}
              size="lg"
              variant="default"
              className="shrink-0"
            >
              <Plus className="mr-2 h-5 w-5" />
              Tạo bộ trắc nghiệm mới
            </Button>
          )}
        </div>

        {/* Stats */}
        {pagination ? (
          <div className="flex gap-4">
            <Badge variant="default" className="px-3 py-1">
              Tổng: {total}
            </Badge>
            <Badge variant="default" className="px-3 py-1">
              Trang {pagination.page}/{pagination.totalPages}
            </Badge>
          </div>
        ) : (
          <div className="flex gap-4">
            <Badge variant="default" className="px-3 py-1">
              Tổng: {quizSets.length}
            </Badge>
            {publishedCount !== undefined && (
              <Badge variant="default" className="px-3 py-1">
                Đã xuất bản: {publishedCount}
              </Badge>
            )}
            {draftCount !== undefined && (
              <Badge variant="neutral" className="px-3 py-1">
                Nháp: {draftCount}
              </Badge>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <SearchInput
            className="flex-1 max-w-md"
            placeholder="Tìm kiếm bộ trắc nghiệm..."
            value={searchQuery}
            onChange={(value) => onSearchChange?.(value)}
            iconColor="text-[var(--text-tertiary)]"
          />

          {/* Sort and Filter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--text-tertiary)]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="neutral" className="w-36 justify-between">
                    {sortBy === 'newest' && 'Mới nhất'}
                    {sortBy === 'oldest' && 'Cũ nhất'}
                    {sortBy === 'title' && 'Tên A-Z'}
                    {sortBy === 'questions' && 'Số câu hỏi'}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSortChange?.('newest')}>
                    Mới nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSortChange?.('oldest')}>
                    Cũ nhất
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSortChange?.('title')}>
                    Tên A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSortChange?.('questions')}>
                    Số câu hỏi
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="neutral" className="w-36 justify-between">
                  {filterBy === 'all' && 'Tất cả'}
                  {filterBy === 'published' && 'Đã xuất bản'}
                  {filterBy === 'draft' && 'Nháp'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onFilterChange?.('all')}>
                  Tất cả
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange?.('published')}>
                  Đã xuất bản
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFilterChange?.('draft')}>
                  Nháp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && onPageChange && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <PaginationControls
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onPageChange={onPageChange}
            />
          </div>
        )}

        {/* Content */}
        {quizSets.length === 0 && !isLoading ? (
          <Card className="flex flex-col items-center justify-center border-dashed border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] py-20 px-6 text-center">
            <Card className="mb-6 rounded-full p-6">
              <Search className="h-10 w-10 text-[var(--brand-primary)]" />
            </Card>
            <h3 className="mb-3 font-heading text-2xl font-bold text-[var(--text-primary)]">
              {QUIZ_SET_CONSTANTS.MESSAGES.EMPTY_STATE_TITLE}
            </h3>
            <p className="mb-8 max-w-md text-base text-[var(--text-secondary)]">
              {QUIZ_SET_CONSTANTS.MESSAGES.EMPTY_STATE_DESCRIPTION}
            </p>
            {onCreateNew && (
              <Button onClick={onCreateNew} size="lg" variant="default">
                <Plus className="mr-2 h-5 w-5" />
                {QUIZ_SET_CONSTANTS.MESSAGES.CREATE_FIRST_QUIZ}
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizSets.map((quizSet) => (
              <QuizSetCard
                key={quizSet.id}
                quizSet={quizSet}
                onEdit={onEdit}
                onDelete={onDelete}
                onPublish={onPublish}
                onView={onView}
                onHost={onHost}
                onDuplicate={onDuplicate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
