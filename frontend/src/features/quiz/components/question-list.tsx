'use client'

import { Plus, Search, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card } from '@/shared/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { SectionContainer } from '@/shared/components'
import { QuestionCard } from './question-card'
import { QUESTION_CONSTANTS } from '../constants'
import { QuestionType, type QuestionDto } from '@/types/api'

interface PaginationInfo {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface QuestionListProps {
  readonly questions: QuestionDto[]
  readonly pagination?: PaginationInfo
  readonly isLoading?: boolean
  readonly searchQuery?: string
  readonly onSearchChange?: (query: string) => void
  readonly filterBy?: string
  readonly onFilterChange?: (filter: string) => void
  readonly onPageChange?: (page: number) => void
  readonly onCreateNew?: () => void
  readonly onEdit?: (question: QuestionDto) => void
  readonly onDelete?: (question: QuestionDto) => void
  readonly onDuplicate?: (question: QuestionDto) => void
  readonly className?: string
}

export function QuestionList({
  questions,
  pagination,
  isLoading = false,
  searchQuery = '',
  onSearchChange,
  filterBy = 'all',
  onFilterChange,
  onPageChange,
  onCreateNew,
  onEdit,
  onDelete,
  onDuplicate,
  className = '',
}: QuestionListProps) {
  // Get filter label
  const getFilterLabel = () => {
    if (filterBy === 'all') return 'Tất cả loại'
    const questionType = filterBy as QuestionType
    return QUESTION_CONSTANTS.TYPES[questionType]?.label || filterBy
  }

  return (
    <SectionContainer background="white" className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              Câu hỏi
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-[var(--text-secondary)]">
                {pagination?.total || questions.length} câu hỏi
              </p>
              {pagination && pagination.totalPages > 1 && (
                <span className="text-xs text-[var(--text-tertiary)]">
                  (Trang {pagination.page}/{pagination.totalPages})
                </span>
              )}
            </div>
          </div>

          {onCreateNew && (
            <Button onClick={onCreateNew} size="lg" variant="default" className="gap-2 shrink-0">
              <Plus className="h-5 w-5" />
              Thêm câu hỏi
            </Button>
          )}
        </div>

        {/* Search and Filter Bar */}
        {(questions.length > 0 || searchQuery || filterBy !== 'all') && (
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--brand-primary)]" />
              <Input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 border-[var(--brand-primary)]/30 focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]/20"
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="neutral"
                  className="gap-2 border-[var(--brand-secondary)]/30 hover:border-[var(--brand-secondary)] hover:bg-[var(--brand-secondary-light)]/10"
                >
                  <Filter className="h-4 w-4 text-[var(--brand-secondary)]" />
                  {getFilterLabel()}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-[var(--brand-secondary)]/20">
                <DropdownMenuItem onClick={() => onFilterChange?.('all')} className="hover:bg-[var(--brand-primary-light)]/20">
                  <span>Tất cả loại</span>
                </DropdownMenuItem>

                {Object.entries(QUESTION_CONSTANTS.TYPES).map(([type, info]) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => onFilterChange?.(type)}
                    className="hover:bg-[var(--brand-primary-light)]/20"
                  >
                    <span>{info.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-primary)] border-t-transparent" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && questions.length === 0 && (
          <Card className="flex flex-col items-center justify-center border-dashed border-[var(--brand-primary)]/20 bg-gradient-to-br from-[var(--bg-surface-secondary)] to-[var(--brand-secondary-light)]/5 py-20 px-6 text-center shadow-brutal-secondary-xs">
            <Card className="mb-6 rounded-full p-6 bg-gradient-to-br from-[var(--brand-primary-light)] to-[var(--brand-secondary-light)] shadow-brutal-primary-sm">
              <Plus className="h-10 w-10 text-[var(--brand-primary)]" />
            </Card>
            <h3 className="mb-3 font-heading text-2xl font-bold text-[var(--text-primary)]">
              {QUESTION_CONSTANTS.MESSAGES.EMPTY_STATE_TITLE}
            </h3>
            <p className="mb-8 max-w-md text-base text-[var(--text-secondary)]">
              {QUESTION_CONSTANTS.MESSAGES.EMPTY_STATE_DESCRIPTION}
            </p>
            {onCreateNew && (
              <Button onClick={onCreateNew} size="lg" variant="default" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] shadow-brutal-primary-sm">
                <Plus className="mr-2 h-5 w-5" />
                {QUESTION_CONSTANTS.MESSAGES.CREATE_FIRST_QUESTION}
              </Button>
            )}
          </Card>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="neutral"
              size="sm"
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="border-[var(--brand-primary)]/30 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]/10 disabled:opacity-50"
            >
              Trước
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[var(--bg-surface-secondary)] border border-[var(--brand-secondary)]/20">
              <span className="text-sm font-medium text-[var(--brand-primary)]">
                Trang {pagination.page}
              </span>
              <span className="text-sm text-[var(--text-tertiary)]">
                / {pagination.totalPages}
              </span>
            </div>
            <Button
              variant="neutral"
              size="sm"
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="border-[var(--brand-primary)]/30 hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)]/10 disabled:opacity-50"
            >
              Sau
            </Button>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && (pagination?.total || questions.length) > 0 && questions.length === 0 && (
          <Card className="flex flex-col items-center justify-center border-dashed border-[var(--brand-secondary)]/30 bg-gradient-to-br from-[var(--bg-surface-secondary)] to-[var(--brand-secondary-light)]/10 py-16 px-6 text-center shadow-brutal-secondary-xs">
            <Card className="mb-6 rounded-full p-6 bg-gradient-to-br from-[var(--brand-secondary-light)] to-[var(--accent-cyan-light)] shadow-brutal-secondary-sm">
              <Search className="h-10 w-10 text-[var(--brand-secondary)]" />
            </Card>
            <h3 className="mb-3 font-heading text-xl font-bold text-[var(--text-primary)]">
              Không tìm thấy câu hỏi
            </h3>
            <p className="mb-6 max-w-md text-base text-[var(--text-secondary)]">
              Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
            </p>
            <Button
              variant="neutral"
              onClick={() => {
                onSearchChange?.('')
                onFilterChange?.('all')
              }}
              className="bg-[var(--accent-cyan)] hover:bg-[var(--accent-cyan-hover)] text-white"
            >
              Xóa bộ lọc
            </Button>
          </Card>
        )}

        {/* Questions List */}
        {!isLoading && questions.length > 0 && (
          <div className="space-y-3">
            {questions.map((question, index) => {
              // Calculate display index based on pagination
              const displayIndex = pagination ? (pagination.page - 1) * pagination.pageSize + index : index
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={displayIndex}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                />
              )
            })}
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

