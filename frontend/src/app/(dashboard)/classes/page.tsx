'use client'

import { GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer } from '@/shared/components/page'
import {
  ClassList,
  ClassForm,
  useClasses,
  useCreateClass,
  useDeleteClass,
  CLASS_CONSTANTS,
} from '@/features/class'
import { ROUTES } from '@/config/routes'
import type { ClassDto } from '@/features/class/types'
import { Button } from '@/shared/ui/button'

export default function ClassesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, isLoading, error } = useClasses({
    search: searchQuery || undefined,
    page,
    pageSize: 20,
  })

  const createClassMutation = useCreateClass()
  const deleteClassMutation = useDeleteClass()

  const handleCreate = async (data: Parameters<typeof createClassMutation.mutateAsync>[0]) => {
    try {
      const newClass = await createClassMutation.mutateAsync(data)
      setIsCreateModalOpen(false)
      router.push(`${ROUTES.classes.detail(newClass.id)}`)
    } catch (error) {
      console.error('Failed to create class:', error)
    }
  }

  const handleView = (classData: ClassDto) => {
    router.push(ROUTES.classes.detail(classData.id))
  }

  const handleDelete = async (classData: ClassDto) => {
    if (!confirm(CLASS_CONSTANTS.MESSAGES.CONFIRM_DELETE)) {
      return
    }

    try {
      await deleteClassMutation.mutateAsync(classData.id)
    } catch (error) {
      console.error('Failed to delete class:', error)
    }
  }

  const handleCopyJoinCode = (joinCode: string) => {
    navigator.clipboard.writeText(joinCode)
    // Toast notification can be added here
  }

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          icon={GraduationCap}
          title="Lớp học của tôi"
          description="Quản lý các lớp học và bài tập về nhà"
        />

        <ClassList
          classes={data?.data || []}
          pagination={
            data
              ? {
                total: data.total,
                page: data.page,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
              }
              : undefined
          }
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPageChange={setPage}
          onCreateNew={() => setIsCreateModalOpen(true)}
          onView={handleView}
          onDelete={handleDelete}
          onCopyJoinCode={handleCopyJoinCode}
        />

        {/* Create Class Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
              <DialogTitle>Tạo lớp học mới</DialogTitle>
              <DialogDescription>
                Tạo một lớp học mới để quản lý học sinh và bài tập về nhà.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 scrollbar-thin">
              <ClassForm
                onSubmit={(data) => handleCreate(data as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                onCancel={() => setIsCreateModalOpen(false)}
                isSubmitting={createClassMutation.isPending}
                showActions={false}
              />
            </div>
            <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={createClassMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={() => {
                  // Trigger form submission
                  const form = document.querySelector('form') as HTMLFormElement
                  form?.requestSubmit()
                }}
                disabled={createClassMutation.isPending}
              >
                {createClassMutation.isPending ? 'Đang lưu...' : 'Tạo lớp học'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </DashboardLayout>
  )
}
