'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const modalTitle = title || (question ? 'Chỉnh sửa câu hỏi' : 'Tạo câu hỏi mới')

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isSubmitting) {
      handleClose()
    }
  }

  const handleSubmit = async (data: CreateQuestionRequest) => {
    await onSubmit(data)
    handleClose()
  }

  if (!open || !mounted) return null
  if (!document.body) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60"
        onClick={handleClose}
        aria-hidden={!open}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
      >
        <div
          className="relative w-full max-w-3xl rounded-2xl border-3 border-[var(--brand-primary)] bg-[var(--bg-surface)] max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[var(--brand-primary)] bg-[var(--bg-surface-secondary)] px-6 py-4">
            <h2
              id="modal-title"
              className="font-heading text-xl font-bold text-[var(--text-primary)]"
            >
              {modalTitle}
            </h2>
            <Button
              variant="neutral"
              size="icon"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-8 w-8 hover:bg-[var(--brand-primary-light)]/20 text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
            <QuestionForm
              question={question}
              quizSetId={quizSetId}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

