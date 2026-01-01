'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { CategoryForm } from './category-form'
import type { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'
import type { CreateCategoryFormData, UpdateCategoryFormData } from '@/lib/validators'

interface CategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: CategoryDto | null
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => void | Promise<void>
  isSubmitting?: boolean
  title?: string
}

export function CategoryModal({
  open,
  onOpenChange,
  category,
  onSubmit,
  isSubmitting = false,
  title,
}: CategoryModalProps) {
  const isEditing = !!category
  const modalTitle = title || (isEditing ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới')

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen)
    }
  }

  const handleSubmit = async (data: CreateCategoryFormData | UpdateCategoryFormData) => {
    // Transform schema data to API request format if needed
    // Currently they are compatible, ensuring description is handled
    const requestData = {
      ...data,
      description: data.description || undefined,
    } as CreateCategoryRequest | UpdateCategoryRequest

    await onSubmit(requestData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>
            {modalTitle}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Cập nhật thông tin danh mục của bạn.' : 'Tạo một danh mục mới để tổ chức các bộ trắc nghiệm.'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 scrollbar-thin">
          <CategoryForm
            category={category}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            showActions={false}
          />
        </div>
        <DialogFooter className="flex-shrink-0 px-6 pb-6 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="category-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
