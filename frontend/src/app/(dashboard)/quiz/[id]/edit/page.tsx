'use client'

import { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Settings, Eye } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { DashboardLayout } from '@/widgets/dashboard'
import { QuestionList, QuestionModal } from '@/features/quiz'
import { useQuizSets } from '@/features/quiz/hooks/use-quiz-sets'
import { useQuestions } from '@/features/quiz/hooks/use-questions'
import { ROUTES } from '@/config/routes'
import type { QuestionDto, CreateQuestionRequest, QuestionQueryParams } from '@/types/api'

export default function QuizEditorPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizSetId = params.id as string

  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionDto | null>(null)

  // Get params from URL
  const searchQuery = searchParams.get('search') || ''
  const filterBy = searchParams.get('filterBy') || 'all'
  const sortBy = (searchParams.get('sortBy') as 'order' | 'createdAt' | 'type') || 'order'
  const page = Number.parseInt(searchParams.get('page') || '1', 10)
  const pageSize = Number.parseInt(searchParams.get('pageSize') || '50', 10)

  const questionParams: QuestionQueryParams = {
    search: searchQuery || undefined,
    filterBy,
    sortBy,
    page,
    pageSize,
  }

  // Fetch quiz set data
  const { quizSets, isLoadingQuizSets } = useQuizSets()
  const quizSet = quizSets?.find((q) => q.id === quizSetId)

  // Fetch questions with pagination
  const {
    questions,
    pagination,
    isLoadingQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    isCreating,
    isUpdating,
  } = useQuestions(quizSetId, questionParams)

  // Update URL params when filters change
  const updateUrlParams = (updates: Partial<QuestionQueryParams>) => {
    const urlParams = new URLSearchParams(searchParams.toString())
    
    if (updates.search !== undefined) {
      if (updates.search) {
        urlParams.set('search', updates.search)
      } else {
        urlParams.delete('search')
      }
    }
    
    if (updates.filterBy && updates.filterBy !== 'all') {
      urlParams.set('filterBy', updates.filterBy)
    } else {
      urlParams.delete('filterBy')
    }
    
    if (updates.sortBy) urlParams.set('sortBy', updates.sortBy)
    
    if (updates.page && updates.page > 1) {
      urlParams.set('page', updates.page.toString())
    } else {
      urlParams.delete('page')
    }
    
    if (updates.pageSize && updates.pageSize !== 50) {
      urlParams.set('pageSize', updates.pageSize.toString())
    } else {
      urlParams.delete('pageSize')
    }

    router.push(`?${urlParams.toString()}`, { scroll: false })
  }

  const handleSearchChange = (query: string) => {
    updateUrlParams({ search: query, page: 1 })
  }

  const handleFilterChange = (filter: string) => {
    updateUrlParams({ filterBy: filter, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
  }

  const handleBack = () => {
    router.push(ROUTES.quiz.list)
  }

  const handleCreateNew = () => {
    setEditingQuestion(null)
    setModalOpen(true)
  }

  const handleEdit = (question: QuestionDto) => {
    setEditingQuestion(question)
    setModalOpen(true)
  }

  const handleDelete = async (question: QuestionDto) => {
    try {
      await deleteQuestion(question.id)
    } catch (error) {
      console.error('Failed to delete question:', error)
    }
  }

  const handleDuplicate = async (question: QuestionDto) => {
    try {
      await duplicateQuestion(question.id)
    } catch (error) {
      console.error('Failed to duplicate question:', error)
    }
  }

  const handleSubmit = async (data: CreateQuestionRequest) => {
    if (editingQuestion) {
      // When updating, we need to include IDs for nested objects
      await updateQuestion({
        id: editingQuestion.id,
        content: data.content,
        timeLimit: data.timeLimit,
        displayOrder: data.displayOrder,
        options: data.options?.map((opt, index) => ({
          ...opt,
          id: editingQuestion.options?.[index]?.id || crypto.randomUUID(),
        })),
        matchingPairs: data.matchingPairs?.map((pair, index) => ({
          ...pair,
          id: editingQuestion.matchingPairs?.[index]?.id || crypto.randomUUID(),
        })),
        orderingItems: data.orderingItems?.map((item, index) => ({
          ...item,
          id: editingQuestion.orderingItems?.[index]?.id || crypto.randomUUID(),
        })),
        videoUrl: data.videoUrl,
        videoTimestamp: data.videoTimestamp,
      })
    } else {
      await createQuestion(data)
    }
  }

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Preview quiz')
  }

  const handleSettings = () => {
    // TODO: Implement quiz settings
    console.log('Quiz settings')
  }

  if (isLoadingQuizSets) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-primary)] border-t-transparent" />
        </div>
      </DashboardLayout>
    )
  }

  if (!quizSet) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Không tìm thấy bộ trắc nghiệm
          </h2>
          <Button onClick={handleBack}>Quay lại</Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Button 
                variant="neutral" 
                size="icon" 
                onClick={handleBack}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text-primary)] break-words">
                    {quizSet.title}
                  </h1>
                  {quizSet.isPublished ? (
                    <Badge variant="default" className="shrink-0">
                      Đã xuất bản
                    </Badge>
                  ) : (
                    <Badge variant="neutral" className="shrink-0">
                      Bản nháp
                    </Badge>
                  )}
                </div>
                {quizSet.description && (
                  <p className="text-sm sm:text-base text-[var(--text-secondary)] break-words">
                    {quizSet.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-1.5 rounded-lg border border-[var(--brand-primary-shadow)] bg-[var(--bg-surface-secondary)] px-3 py-1 shadow-brutal-primary-xs">
                    <span className="font-heading text-sm font-bold text-[var(--brand-primary)]">
                      {pagination?.total || questions.length}
                    </span>
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                      câu hỏi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button variant="neutral" onClick={handleSettings} className="gap-2">
                <Settings className="h-4 w-4" />
                Cài đặt
              </Button>
              <Button variant="neutral" onClick={handlePreview} className="gap-2">
                <Eye className="h-4 w-4" />
                Xem trước
              </Button>
            </div>
          </div>
        </Card>

        {/* Questions Section */}
        <QuestionList
          questions={questions}
          pagination={pagination}
          isLoading={isLoadingQuestions}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          filterBy={filterBy}
          onFilterChange={handleFilterChange}
          onPageChange={handlePageChange}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />

        {/* Question Modal */}
        <QuestionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          question={editingQuestion}
          quizSetId={quizSetId}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
      </div>
    </DashboardLayout>
  )
}

