'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { CategoryForm } from './category-form'
import type { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

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

  const handleSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="border-b-2 border-primary bg-muted px-6 py-4">
          <DialogTitle className="font-heading text-xl font-bold text-foreground">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 py-6">
          <CategoryForm
            category={category}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
