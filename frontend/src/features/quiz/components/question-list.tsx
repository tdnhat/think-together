'use client'

import { Plus, Search } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { PaginationControls, SectionContainer } from '@/shared/components'
import { QuestionCard } from './question-card'
import { QuestionListToolbar } from './question-list-toolbar'
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
  return (
    <SectionContainer background="white" className={className}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Câu hỏi
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {pagination?.total || questions.length} câu hỏi
              </p>
              {pagination && pagination.totalPages > 1 && (
                <span className="text-xs text-muted-foreground">
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
          <QuestionListToolbar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            filterBy={filterBy}
            onFilterChange={onFilterChange}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="md" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && questions.length === 0 && (
          <Card className="flex flex-col items-center justify-center border-dashed border-primary/20 bg-gradient-to-br from-muted to-secondary/5 py-20 px-6 text-center">
            <Card className="mb-6 rounded-full p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <Plus className="h-10 w-10 text-primary" />
            </Card>
            <h3 className="mb-3 font-heading text-2xl font-bold text-foreground">
              {QUESTION_CONSTANTS.MESSAGES.EMPTY_STATE_TITLE}
            </h3>
            <p className="mb-8 max-w-md text-base text-muted-foreground">
              {QUESTION_CONSTANTS.MESSAGES.EMPTY_STATE_DESCRIPTION}
            </p>
            {onCreateNew && (
              <Button onClick={onCreateNew} size="lg" variant="default">
                <Plus className="mr-2 h-5 w-5" />
                {QUESTION_CONSTANTS.MESSAGES.CREATE_FIRST_QUESTION}
              </Button>
            )}
          </Card>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && onPageChange && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-muted border border-secondary/20">
              <span className="text-sm font-medium text-primary">
                Trang {pagination.page}
              </span>
              <span className="text-sm text-muted-foreground">
                / {pagination.totalPages}
              </span>
            </div>
            <PaginationControls
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onPageChange={onPageChange}
            />
          </div>
        )}

        {/* No Results State */}
        {!isLoading && (pagination?.total || questions.length) > 0 && questions.length === 0 && (
          <Card className="flex flex-col items-center justify-center border-dashed border-secondary/30 bg-gradient-to-br from-muted to-secondary/10 py-16 px-6 text-center">
            <Card className="mb-6 rounded-full p-6 bg-gradient-to-br from-secondary/10 to-cyan-100 dark:to-cyan-950/30">
              <Search className="h-10 w-10 text-secondary" />
            </Card>
            <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
              Không tìm thấy câu hỏi
            </h3>
            <p className="mb-6 max-w-md text-base text-muted-foreground">
              Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
            </p>
            <Button
              variant="outline"
              onClick={() => {
                onSearchChange?.('')
                onFilterChange?.('all')
              }}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
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

