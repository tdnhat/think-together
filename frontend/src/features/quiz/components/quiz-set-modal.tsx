'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isEditing = !!quizSet
  const modalTitle = title || (isEditing ? 'Chỉnh sửa bộ trắc nghiệm' : 'Tạo bộ trắc nghiệm mới')

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

  const handleSubmit = async (data: CreateQuizSetFormData | UpdateQuizSetFormData) => {
    await onSubmit(data)
    onOpenChange(false)
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
          className="relative w-full max-w-2xl rounded-2xl border-3 border-[var(--brand-primary-shadow)] bg-[var(--bg-surface)] max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--brand-primary-shadow)] bg-[var(--bg-surface-secondary)] px-6 py-4">
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
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
            <QuizSetForm
              quizSet={quizSet}
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
