'use client'

import { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { QuestionList, QuestionModal, QuizEditorHeader } from '@/features/quiz'
import { useQuizSets } from '@/features/quiz/hooks/use-quiz-sets'
import { useQuestions } from '@/features/quiz/hooks/use-questions'
import { ROUTES } from '@/config/routes'
import { useUrlParams } from '@/hooks/use-url-params'
import type { QuestionDto, CreateQuestionRequest, QuestionQueryParams } from '@/types/api'

export default function QuizEditorPage() {
  const params = useParams()
  const router = useRouter()
  const quizSetId = params.id as string

  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuestionDto | null>(null)

  // Use generic hook for params
  const { params: urlParams, updateParams } = useUrlParams<'order' | 'createdAt' | 'type'>({
    defaultPageSize: 50,
    defaultSortBy: 'order',
    defaultFilterBy: 'all'
  })

  // Destructure for readability
  const { search: searchQuery, filterBy, sortBy, page, pageSize } = urlParams

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

  const handleSearchChange = (query: string) => {
    updateParams({ search: query, page: 1 })
  }

  const handleFilterChange = (filter: string) => {
    updateParams({ filterBy: filter, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage })
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
          <LoadingSpinner size="md" />
        </div>
      </DashboardLayout>
    )
  }

  if (!quizSet) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="font-heading text-2xl font-bold text-foreground">
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
        <QuizEditorHeader
          title={quizSet.title}
          description={quizSet.description}
          isPublished={quizSet.isPublished}
          onBack={handleBack}
          onSettings={handleSettings}
          onPreview={handlePreview}
        />

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

