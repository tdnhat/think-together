'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toastSuccess } from '@/lib/utils/toast'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import { toast } from 'sonner'

import { QuizSetList, QuizSetModal, useQuizSets } from '@/features/quiz'
import { useCreateChallenge, type ChallengeDto } from '@/features/challenge'
import { DashboardLayout } from '@/widgets/dashboard'
import { CreatorRouteGuard } from '@/shared/components/creator-route-guard'
import { ROUTES } from '@/config/routes'
import type { QuizSetDto, QuizSetQueryParams } from '@/types/api'
import type { CreateQuizSetFormData, UpdateQuizSetFormData } from '@/lib/validators'

function CreatorQuizzesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuizSet, setEditingQuizSet] = useState<QuizSetDto | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [selectedQuizSet, setSelectedQuizSet] = useState<QuizSetDto | null>(null)

  // Get params from URL
  const searchQuery = searchParams.get('search') || ''
  const sortBy = (searchParams.get('sortBy') as 'newest' | 'oldest' | 'title' | 'questions') || 'newest'
  const filterBy = (searchParams.get('filterBy') as 'all' | 'published' | 'draft') || 'all'
  const page = Number.parseInt(searchParams.get('page') || '1', 10)
  const pageSize = Number.parseInt(searchParams.get('pageSize') || '10', 10)

  const queryParams: QuizSetQueryParams = {
    search: searchQuery || undefined,
    sortBy,
    filterBy,
    page,
    pageSize,
  }

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

  // Update URL params when filters change
  const updateUrlParams = (updates: Partial<QuizSetQueryParams>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (updates.search !== undefined) {
      if (updates.search) {
        params.set('search', updates.search)
      } else {
        params.delete('search')
      }
    }
    
    if (updates.sortBy) params.set('sortBy', updates.sortBy)
    if (updates.filterBy && updates.filterBy !== 'all') {
      params.set('filterBy', updates.filterBy)
    } else {
      params.delete('filterBy')
    }
    
    if (updates.page && updates.page > 1) {
      params.set('page', updates.page.toString())
    } else {
      params.delete('page')
    }
    
    if (updates.pageSize && updates.pageSize !== 10) {
      params.set('pageSize', updates.pageSize.toString())
    } else {
      params.delete('pageSize')
    }

    router.push(`?${params.toString()}`)
  }

  const handleSearchChange = (query: string) => {
    updateUrlParams({ search: query, page: 1 })
  }

  const handleSortChange = (sort: 'newest' | 'oldest' | 'title' | 'questions') => {
    updateUrlParams({ sortBy: sort, page: 1 })
  }

  const handleFilterChange = (filter: 'all' | 'published' | 'draft') => {
    updateUrlParams({ filterBy: filter, page: 1 })
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage })
  }

  const handleCreateNew = () => {
    setEditingQuizSet(null)
    setModalOpen(true)
  }

  const handleEdit = (quizSet: QuizSetDto) => {
    router.push(ROUTES.quiz.edit(quizSet.id))
  }

  const handleDelete = (quizSet: QuizSetDto) => {
    setSelectedQuizSet(quizSet)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedQuizSet) {
      try {
        await deleteQuizSet(selectedQuizSet.id)
        setDeleteDialogOpen(false)
        setSelectedQuizSet(null)
      } catch (error) {
        console.error('Failed to delete quiz set:', error)
      }
    }
  }

  const handlePublish = (quizSet: QuizSetDto) => {
    setSelectedQuizSet(quizSet)
    setPublishDialogOpen(true)
  }

  const handlePublishConfirm = async () => {
    if (selectedQuizSet) {
      try {
        await publishQuizSet(selectedQuizSet.id)
        setPublishDialogOpen(false)
        setSelectedQuizSet(null)
      } catch (error) {
        console.error('Failed to publish quiz set:', error)
      }
    }
  }

  const handleView = (quizSet: QuizSetDto) => {
    router.push(ROUTES.quiz.view(quizSet.id))
  }

  const handleHost = (quizSet: QuizSetDto) => {
    router.push(ROUTES.game.hostWithQuiz(quizSet.id))
  }

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    toastSuccess('Tính năng sao chép sẽ được triển khai trong phiên bản tiếp theo')
  }

  const handleCreateChallenge = (quizSet: QuizSetDto) => {
    createChallenge(
      {
        quizSetId: quizSet.id,
        title: quizSet.title,
        description: quizSet.description,
      },
      {
        onSuccess: (challenge: ChallengeDto) => {
          toast.success('Thử thách đã được tạo thành công!')
          // Copy share link to clipboard
          const shareUrl = `${window.location.origin}/challenge/${challenge.shareLink}`
          navigator.clipboard.writeText(shareUrl).then(() => {
            toast.success('Đã sao chép liên kết thử thách!')
          })
        },
      }
    )
  }

  const handleModalSubmit = async (data: CreateQuizSetFormData | UpdateQuizSetFormData) => {
    try {
      if (editingQuizSet) {
        await updateQuizSet(data as UpdateQuizSetFormData)
        setModalOpen(false)
        setEditingQuizSet(null)
      } else {
        const createdQuizSet = await createQuizSet(data as CreateQuizSetFormData)
        if (createdQuizSet) {
          setEditingQuizSet(createdQuizSet)
        }
      }
    } catch (error) {
      // Error is already handled by the hook
      console.error('Failed to save quiz set:', error)
    }
  }

  const handleModalClose = () => {
    if (!isCreating && !isUpdating) {
      setModalOpen(false)
      setEditingQuizSet(null)
    }
  }

  return (
    <DashboardLayout>
      <CreatorRouteGuard>
        <div className="space-y-6">
        <QuizSetList
          quizSets={quizSets}
          pagination={pagination}
          isLoading={isLoadingQuizSets}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          filterBy={filterBy}
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
          title={editingQuizSet ? 'Chỉnh sửa bộ trắc nghiệm' : 'Tạo bộ trắc nghiệm mới'}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa bộ trắc nghiệm?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa bộ trắc nghiệm &quot;{selectedQuizSet?.title}&quot; không? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="neutral">Hủy</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="default" onClick={handleDeleteConfirm}>
                  Xóa
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Publish Confirmation Dialog */}
        <AlertDialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xuất bản bộ trắc nghiệm?</AlertDialogTitle>
              <AlertDialogDescription>
                Xuất bản bộ trắc nghiệm &quot;{selectedQuizSet?.title}&quot; sẽ cho phép người khác sử dụng. Bạn có muốn tiếp tục?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="neutral">Hủy</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="default" onClick={handlePublishConfirm}>
                  Xuất bản
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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

