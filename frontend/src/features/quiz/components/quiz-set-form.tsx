'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, Upload, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { createQuizSetSchema, updateQuizSetSchema, type CreateQuizSetFormData, type UpdateQuizSetFormData } from '@/lib/validators'
import { QUIZ_SET_CONSTANTS } from '../constants'
import type { QuizSetDto } from '@/types/api'

interface QuizSetFormProps {
  quizSet?: QuizSetDto | null
  onSubmit: (data: CreateQuizSetFormData | UpdateQuizSetFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
}

export function QuizSetForm({
  quizSet,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: QuizSetFormProps) {
  const isEditing = !!quizSet

  const schema = isEditing ? updateQuizSetSchema : createQuizSetSchema
  const defaultValues = isEditing && quizSet ? {
    id: quizSet.id,
    title: quizSet.title,
    description: quizSet.description || '',
    coverImageUrl: quizSet.coverImageUrl || '',
  } : {
    title: '',
    description: '',
    coverImageUrl: '',
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateQuizSetFormData | UpdateQuizSetFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const coverImageUrl = watch('coverImageUrl')

  // Update form when quizSet prop changes
  useEffect(() => {
    if (isEditing && quizSet) {
      setValue('id', quizSet.id)
      setValue('title', quizSet.title)
      setValue('description', quizSet.description || '')
      setValue('coverImageUrl', quizSet.coverImageUrl || '')
    }
  }, [quizSet, isEditing, setValue])

  const handleFormSubmit = async (data: CreateQuizSetFormData | UpdateQuizSetFormData) => {
    await onSubmit(data)
  }

  const handleRemoveImage = () => {
    setValue('coverImageUrl', '')
  }

  const handleImageUrlChange = (url: string) => {
    setValue('coverImageUrl', url)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-6 ${className}`}>
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold">
          Tiêu đề <span className="text-[var(--color-error)]">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder={QUIZ_SET_CONSTANTS.PLACEHOLDERS.TITLE}
          {...register('title')}
          className={errors.title ? 'border-[var(--color-error)]' : ''}
        />
        {errors.title && (
          <p className="text-sm text-[var(--color-error)]">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">
          Mô tả
        </Label>
        <Textarea
          id="description"
          placeholder={QUIZ_SET_CONSTANTS.PLACEHOLDERS.DESCRIPTION}
          rows={4}
          {...register('description')}
          className={errors.description ? 'border-[var(--color-error)]' : ''}
        />
        {errors.description && (
          <p className="text-sm text-[var(--color-error)]">{errors.description.message}</p>
        )}
      </div>

      {/* Cover Image */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Ảnh bìa</Label>

        {/* Current Image Preview */}
        {coverImageUrl && (
          <div className="relative">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[var(--brand-primary-shadow)] bg-[var(--bg-surface-secondary)] shadow-brutal-primary-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt="Cover preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Button
                  type="button"
                  variant="neutral"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Image URL Input */}
        <div className="space-y-2">
          <Label htmlFor="coverImageUrl" className="text-sm font-semibold">
            URL ảnh bìa
          </Label>
          <div className="flex gap-2">
            <Input
              id="coverImageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={coverImageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              className={errors.coverImageUrl ? 'border-[var(--color-error)]' : ''}
            />
            <Button
              type="button"
              variant="neutral"
              size="icon"
              className="shrink-0"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          {errors.coverImageUrl && (
            <p className="text-sm text-[var(--color-error)]">{errors.coverImageUrl.message}</p>
          )}
          <p className="text-xs text-[var(--text-tertiary)]">
            Nhập URL của ảnh bìa. Để trống nếu không muốn thêm ảnh bìa.
          </p>
        </div>

        {/* Placeholder when no image */}
        {!coverImageUrl && (
          <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-[var(--color-border-light)] bg-[var(--bg-surface-secondary)]">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-[var(--text-tertiary)]" />
              <p className="mt-2 text-sm text-[var(--text-tertiary)]">
                Chưa có ảnh bìa
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="neutral"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          variant="default"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang lưu...' : isEditing ? 'Cập nhật' : 'Tạo bộ trắc nghiệm'}
        </Button>
      </div>
    </form>
  )
}
