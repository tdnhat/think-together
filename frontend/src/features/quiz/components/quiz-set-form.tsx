'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import { createQuizSetSchema, updateQuizSetSchema, type CreateQuizSetFormData, type UpdateQuizSetFormData } from '@/lib/validators'
import { QUIZ_SET_CONSTANTS } from '../constants'
import { ImageUpload } from './image-upload'
import { CategorySelector } from '@/features/category'
import type { QuizSetDto } from '@/types/api'

interface QuizSetFormProps {
  quizSet?: QuizSetDto | null
  onSubmit: (data: CreateQuizSetFormData | UpdateQuizSetFormData) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
  showActions?: boolean
}

export function QuizSetForm({
  quizSet,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
  showActions = true,
}: QuizSetFormProps) {
  const isEditing = !!quizSet

  const schema = isEditing ? updateQuizSetSchema : createQuizSetSchema
  const defaultValues = isEditing && quizSet ? {
    id: quizSet.id,
    title: quizSet.title,
    description: quizSet.description || '',
    coverImageUrl: quizSet.coverImageUrl || '',
    categoryId: quizSet.categoryId || '',
  } : {
    title: '',
    description: '',
    coverImageUrl: '',
    categoryId: '',
  }

  const form = useForm<CreateQuizSetFormData | UpdateQuizSetFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const { handleSubmit, control, watch, setValue } = form
  const coverImageUrl = watch('coverImageUrl')

  // Update form when quizSet prop changes
  useEffect(() => {
    if (isEditing && quizSet) {
      setValue('id', quizSet.id)
      setValue('title', quizSet.title)
      setValue('description', quizSet.description || '')
      setValue('coverImageUrl', quizSet.coverImageUrl || '')
      setValue('categoryId', quizSet.categoryId || '')
    }
  }, [quizSet, isEditing, setValue])

  const handleFormSubmit = async (data: CreateQuizSetFormData | UpdateQuizSetFormData) => {
    await onSubmit(data)
  }

  const handleImageUploadSuccess = (updatedQuizSet: QuizSetDto) => {
    setValue('coverImageUrl', updatedQuizSet.coverImageUrl || '')
  }

  const handleImageUrlChange = (url: string) => {
    setValue('coverImageUrl', url)
  }

  return (
    <Form {...form}>
      <form id="quiz-set-form" onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-6 ${className}`}>
        {/* Title */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Tiêu đề <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={QUIZ_SET_CONSTANTS.PLACEHOLDERS.TITLE}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Mô tả
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={QUIZ_SET_CONSTANTS.PLACEHOLDERS.DESCRIPTION}
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">
                Danh mục (Tùy chọn)
              </FormLabel>
              <FormControl>
                <CategorySelector
                  value={field.value || ''}
                  onChange={(value) => field.onChange(value || '')}
                  placeholder="Chọn danh mục"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image */}
        <div className="space-y-4">
          <FormLabel className="text-sm font-semibold">Ảnh bìa</FormLabel>

          {/* File Upload Component - show for both create and edit */}
          <ImageUpload
            quizSetId={isEditing && quizSet ? quizSet.id : undefined}
            currentImageUrl={coverImageUrl}
            onUploadSuccess={handleImageUploadSuccess}
            onUploadSuccessTemp={(imageUrl) => {
              handleImageUrlChange(imageUrl)
            }}
            disabled={isSubmitting}
          />

          {/* URL Input - for manual URL entry (optional) */}
          <FormField
            control={control}
            name="coverImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Hoặc nhập URL ảnh bìa
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Bạn có thể tải ảnh lên hoặc nhập URL trực tiếp.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
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
      )}
      </form>
    </Form>
  )
}
