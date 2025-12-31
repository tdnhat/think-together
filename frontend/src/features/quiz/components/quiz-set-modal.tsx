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
import { QuizSetForm } from './quiz-set-form'
import type { QuizSetDto } from '@/types/api'
import type { CreateQuizSetFormData, UpdateQuizSetFormData } from '@/lib/validators'

interface QuizSetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizSet?: QuizSetDto | null
  onSubmit: (data: CreateQuizSetFormData | UpdateQuizSetFormData) => Promise<void>
  isSubmitting?: boolean
  title?: string
}

export function QuizSetModal({
  open,
  onOpenChange,
  quizSet,
  onSubmit,
  isSubmitting = false,
  title,
}: QuizSetModalProps) {
  const isEditing = !!quizSet
  const modalTitle = title || (isEditing ? 'Chỉnh sửa bộ trắc nghiệm' : 'Tạo bộ trắc nghiệm mới')
  const modalDescription = isEditing 
    ? 'Cập nhật thông tin bộ trắc nghiệm của bạn.'
    : 'Tạo một bộ trắc nghiệm mới để sử dụng trong các buổi học của bạn.'

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen)
    }
  }

  const handleSubmit = async (data: CreateQuizSetFormData | UpdateQuizSetFormData) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <QuizSetForm
          quizSet={quizSet}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          showActions={false}
        />
        <DialogFooter>
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
            form="quiz-set-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo bộ trắc nghiệm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
