'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="border-b border-primary/20 bg-muted px-6 py-4">
          <DialogTitle className="font-heading text-xl font-bold text-foreground">
            {modalTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 py-6">
          <QuizSetForm
            quizSet={quizSet}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
