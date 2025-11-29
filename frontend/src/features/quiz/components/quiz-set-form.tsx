'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { FormInput } from '@/shared/components'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { createQuizSetSchema, updateQuizSetSchema, type CreateQuizSetFormData, type UpdateQuizSetFormData } from '@/lib/validators'
import { QUIZ_SET_CONSTANTS } from '../constants'
import { ImageUpload } from './image-upload'
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
  const [uploadSuccess, setUploadSuccess] = useState(false)

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

  const handleImageUploadSuccess = (updatedQuizSet: QuizSetDto) => {
    setValue('coverImageUrl', updatedQuizSet.coverImageUrl || '')
    setUploadSuccess(true)
    setTimeout(() => setUploadSuccess(false), 2000)
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
        <FormInput
          id="title"
          type="text"
          placeholder={QUIZ_SET_CONSTANTS.PLACEHOLDERS.TITLE}
          error={errors.title?.message}
          {...register('title')}
        />
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

        {/* File Upload Component - show for both create and edit */}
        <ImageUpload
          quizSetId={isEditing && quizSet ? quizSet.id : undefined}
          currentImageUrl={coverImageUrl}
          onUploadSuccess={handleImageUploadSuccess}
          onUploadSuccessTemp={(imageUrl) => {
            handleImageUrlChange(imageUrl)
            setUploadSuccess(true)
            setTimeout(() => setUploadSuccess(false), 2000)
          }}
          disabled={isSubmitting}
        />

        {/* URL Input - for manual URL entry (optional) */}
         <div className="space-y-2">
           <Label htmlFor="coverImageUrl" className="text-sm font-semibold">
             Hoặc nhập URL ảnh bìa
           </Label>
           <FormInput
             id="coverImageUrl"
             type="url"
             placeholder="https://example.com/image.jpg"
             value={coverImageUrl}
             onChange={(e) => handleImageUrlChange(e.target.value)}
             error={errors.coverImageUrl?.message}
             disabled={isSubmitting}
           />
           <p className="text-xs text-[var(--text-tertiary)]">
             Bạn có thể tải ảnh lên hoặc nhập URL trực tiếp.
           </p>
         </div>
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
