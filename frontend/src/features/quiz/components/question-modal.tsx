'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="border-b-2 border-primary bg-muted px-6 py-4">
          <DialogTitle className="font-heading text-xl font-bold text-foreground">
            {modalTitle}
          </DialogTitle>
          <DialogDescription>
            {question ? 'Cập nhật nội dung và các tùy chọn của câu hỏi.' : 'Tạo một câu hỏi mới cho bộ trắc nghiệm của bạn.'}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 py-6">
          <QuestionForm
            question={question}
            quizSetId={quizSetId}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

