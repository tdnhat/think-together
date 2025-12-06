'use client'

import { ChevronRight, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { QuestionCard } from './question-card'
import type { QuestionDto } from '@/types/api'

interface QuizPreviewQuestionsProps {
  questions: QuestionDto[]
  isLoading: boolean
  total: number
  onViewAll?: () => void
  showViewAllButton?: boolean
  maxPreview?: number
}

export function QuizPreviewQuestions({
  questions,
  isLoading,
  total,
  onViewAll,
  showViewAllButton = true,
  maxPreview = 3,
}: QuizPreviewQuestionsProps) {
  const previewQuestions = questions.slice(0, maxPreview)
  const hasMore = total > maxPreview

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Xem trước câu hỏi</CardTitle>
          <CardDescription>
            Danh sách các câu hỏi trong bộ trắc nghiệm
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-32 items-center justify-center">
          <LoadingSpinner size="md" />
        </CardContent>
      </Card>
    )
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Xem trước câu hỏi</CardTitle>
          <CardDescription>
            Danh sách các câu hỏi trong bộ trắc nghiệm
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-center text-[var(--text-tertiary)]">
            Chưa có câu hỏi nào trong bộ trắc nghiệm này
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Xem trước câu hỏi</CardTitle>
            <CardDescription>
              {total} câu hỏi • Hiển thị {Math.min(maxPreview, total)}
            </CardDescription>
          </div>
          {showViewAllButton && hasMore && (
            <Button
              variant="neutral"
              size="sm"
              onClick={onViewAll}
              className="shrink-0"
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem tất cả
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {previewQuestions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <QuestionCard
              question={question}
              index={index}
              isDragging={false}
            />
          </div>
        ))}

        {hasMore && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)] py-4">
            <button
              onClick={onViewAll}
              className="flex items-center gap-2 text-sm font-medium text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-primary-hover)]"
            >
              <span>Xem {total - maxPreview} câu hỏi còn lại</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
