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
import { QuestionForm } from './question-form'
import type { QuestionDto, CreateQuestionRequest } from '@/types/api'

interface QuestionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question?: QuestionDto | null
  quizSetId: string
  onSubmit: (data: CreateQuestionRequest) => void | Promise<void>
  isSubmitting?: boolean
  title?: string
}

export function QuestionModal({
  open,
  onOpenChange,
  question,
  quizSetId,
  onSubmit,
  isSubmitting = false,
  title,
}: QuestionModalProps) {
  const modalTitle = title || (question ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới')

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting) {
      onOpenChange(newOpen)
    }
  }

  const handleSubmit = async (data: CreateQuestionRequest) => {
    await onSubmit(data)
    onOpenChange(false)
  }

  const isEditing = !!question
  const modalDescription = isEditing
    ? 'Cập nhật nội dung và các tùy chọn của câu hỏi.'
    : 'Tạo một câu hỏi mới cho bộ trắc nghiệm của bạn.'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-6xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 scrollbar-thin">
          <QuestionForm
            question={question}
            quizSetId={quizSetId}
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
            form="question-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo câu hỏi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

