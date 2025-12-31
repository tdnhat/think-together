'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { DashboardLayout } from '@/widgets/dashboard'
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
      <div className="container mx-auto space-y-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Lớp học của tôi
            </h1>
            <p className="mt-2 text-muted-foreground">
              Quản lý các lớp học và bài tập về nhà
            </p>
          </div>
        </div>

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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo lớp học mới</DialogTitle>
              <DialogDescription>
                Tạo một lớp học mới để quản lý học sinh và bài tập về nhà.
              </DialogDescription>
            </DialogHeader>
            <ClassForm
              onSubmit={(data) => handleCreate(data as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
              onCancel={() => setIsCreateModalOpen(false)}
              isSubmitting={createClassMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
