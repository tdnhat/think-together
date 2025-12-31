'use client'

import { Suspense, useCallback } from 'react'
import { toastSuccess } from '@/lib/utils/toast'
import { toast } from '@/lib/utils/toast'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { QuizSetList, QuizSetModal, useQuizSets } from '@/features/quiz'
import { useCreateChallenge, type ChallengeDto } from '@/features/challenge'
import { DashboardLayout } from '@/widgets/dashboard'
import { CreatorRouteGuard } from '@/shared/components/creator-route-guard'
import type { QuizSetDto } from '@/types/api'
import type { CreateQuizSetFormData, UpdateQuizSetFormData } from '@/lib/validators'
import {
  useQuizUrlParams,
  useQuizActions,
  useQuizDialogs,
  useQuizModal,
} from '@/features/quiz/hooks/creator'
import { DeleteQuizDialog, PublishQuizDialog } from '@/features/quiz/components/creator'

function CreatorQuizzesContent() {
  const { params, queryParams, updateUrlParams } = useQuizUrlParams()
  const { handleEdit, handleView, handleHost } = useQuizActions()
  const {
    deleteDialogOpen,
    publishDialogOpen,
    selectedQuizSet,
    openDeleteDialog,
    closeDeleteDialog,
    openPublishDialog,
    closePublishDialog,
  } = useQuizDialogs()
  const { modalOpen, editingQuizSet, openModal, closeModal } = useQuizModal()

  const {
    quizSets,
    pagination,
    isLoadingQuizSets,
    createQuizSet,
    updateQuizSet,
    deleteQuizSet,
    publishQuizSet,
    isCreating,
    isUpdating,
  } = useQuizSets(queryParams)

  const { mutate: createChallenge } = useCreateChallenge()

  const handleSearchChange = useCallback(
    (query: string) => {
      updateUrlParams({ search: query, page: 1 })
    },
    [updateUrlParams]
  )

  const handleSortChange = useCallback(
    (sort: 'newest' | 'oldest' | 'title' | 'questions') => {
      updateUrlParams({ sortBy: sort, page: 1 })
    },
    [updateUrlParams]
  )

  const handleFilterChange = useCallback(
    (filter: 'all' | 'published' | 'draft') => {
      updateUrlParams({ filterBy: filter, page: 1 })
    },
    [updateUrlParams]
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateUrlParams({ page: newPage })
    },
    [updateUrlParams]
  )

  const handleCreateNew = useCallback(() => {
    openModal()
  }, [openModal])

  const handleDelete = useCallback(
    (quizSet: QuizSetDto) => {
      openDeleteDialog(quizSet)
    },
    [openDeleteDialog]
  )

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedQuizSet) {
      try {
        await deleteQuizSet(selectedQuizSet.id)
        closeDeleteDialog()
      } catch (error) {
        console.error('Failed to delete quiz set:', error)
      }
    }
  }, [selectedQuizSet, deleteQuizSet, closeDeleteDialog])

  const handlePublish = useCallback(
    (quizSet: QuizSetDto) => {
      openPublishDialog(quizSet)
    },
    [openPublishDialog]
  )

  const handlePublishConfirm = useCallback(async () => {
    if (selectedQuizSet) {
      try {
        await publishQuizSet(selectedQuizSet.id)
        closePublishDialog()
      } catch (error) {
        console.error('Failed to publish quiz set:', error)
      }
    }
  }, [selectedQuizSet, publishQuizSet, closePublishDialog])

  const handleDuplicate = useCallback(() => {
    toastSuccess('Tính năng sao chép sẽ được triển khai trong phiên bản tiếp theo')
  }, [])

  const handleCreateChallenge = useCallback(
    (quizSet: QuizSetDto) => {
      createChallenge(
        {
          quizSetId: quizSet.id,
          title: quizSet.title,
          description: quizSet.description,
        },
        {
          onSuccess: (challenge: ChallengeDto) => {
            toast.success('Thử thách đã được tạo thành công!')
            const shareUrl = `${window.location.origin}/challenge/${challenge.shareLink}`
            navigator.clipboard.writeText(shareUrl).then(() => {
              toast.success('Đã sao chép liên kết thử thách!')
            })
          },
        }
      )
    },
    [createChallenge]
  )

  const handleModalSubmit = useCallback(
    async (data: CreateQuizSetFormData | UpdateQuizSetFormData) => {
      try {
        if (editingQuizSet) {
          await updateQuizSet(data as UpdateQuizSetFormData)
          closeModal()
        } else {
          const createdQuizSet = await createQuizSet(data as CreateQuizSetFormData)
          if (createdQuizSet) {
            // Keep modal open to edit the created quiz
          }
        }
      } catch (error) {
        console.error('Failed to save quiz set:', error)
      }
    },
    [editingQuizSet, updateQuizSet, createQuizSet, closeModal]
  )

  const handleModalClose = useCallback(() => {
    if (!isCreating && !isUpdating) {
      closeModal()
    }
  }, [isCreating, isUpdating, closeModal])

  return (
    <DashboardLayout>
      <CreatorRouteGuard>
        <div className="space-y-6">
          <QuizSetList
            quizSets={quizSets}
            pagination={pagination}
            isLoading={isLoadingQuizSets}
            searchQuery={params.searchQuery}
            onSearchChange={handleSearchChange}
            sortBy={params.sortBy}
            onSortChange={handleSortChange}
            filterBy={params.filterBy}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onView={handleView}
            onHost={handleHost}
            onDuplicate={handleDuplicate}
            onCreateChallenge={handleCreateChallenge}
          />

          <QuizSetModal
            open={modalOpen}
            onOpenChange={handleModalClose}
            quizSet={editingQuizSet}
            onSubmit={handleModalSubmit}
            isSubmitting={isCreating || isUpdating}
            title={
              editingQuizSet
                ? 'Chỉnh sửa bộ trắc nghiệm'
                : 'Tạo bộ trắc nghiệm mới'
            }
          />

          <DeleteQuizDialog
            open={deleteDialogOpen}
            onOpenChange={closeDeleteDialog}
            quizSet={selectedQuizSet}
            onConfirm={handleDeleteConfirm}
          />

          <PublishQuizDialog
            open={publishDialogOpen}
            onOpenChange={closePublishDialog}
            quizSet={selectedQuizSet}
            onConfirm={handlePublishConfirm}
          />
        </div>
      </CreatorRouteGuard>
    </DashboardLayout>
  )
}

export default function CreatorQuizzesPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <CreatorQuizzesContent />
    </Suspense>
  )
}

