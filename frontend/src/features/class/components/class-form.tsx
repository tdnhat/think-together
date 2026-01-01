'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/shared/ui/form'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import {
  createClassSchema,
  updateClassSchema,
  type CreateClassFormData,
  type UpdateClassFormData,
} from '@/lib/validators'
import { CLASS_CONSTANTS } from '../constants'
import { ImageUpload } from './image-upload'
import type { ClassDto, CreateClassRequest, UpdateClassRequest } from '../types'

interface ClassFormProps {
  classData?: ClassDto | null
  onSubmit: (data: CreateClassRequest | UpdateClassRequest) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
  showActions?: boolean
}

export function ClassForm({
  classData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
  showActions = true,
}: Readonly<ClassFormProps>) {
  const isEditing = !!classData

  const form = useForm<CreateClassFormData | UpdateClassFormData>({
    resolver: zodResolver(isEditing ? updateClassSchema : createClassSchema),
    defaultValues: {
      name: classData?.name || '',
      description: classData?.description || '',
      coverImageUrl: classData?.coverImageUrl || '',
    },
  })

  const { handleSubmit, control, watch } = form
  const coverImageUrl = watch('coverImageUrl')

  const handleFormSubmit = async (data: CreateClassFormData | UpdateClassFormData) => {
    const submitData: CreateClassRequest | UpdateClassRequest = {
      ...(data.name && { name: data.name.trim() }),
      ...(data.description !== undefined && { description: data.description?.trim() || undefined }),
      ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl?.trim() || undefined }),
    }

    await onSubmit(submitData)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
        <div className="space-y-6">
          {/* Name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên lớp học <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={CLASS_CONSTANTS.PLACEHOLDERS.NAME}
                    maxLength={CLASS_CONSTANTS.LIMITS.NAME_MAX_LENGTH}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0} / {CLASS_CONSTANTS.LIMITS.NAME_MAX_LENGTH} ký tự
                </FormDescription>
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
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={CLASS_CONSTANTS.PLACEHOLDERS.DESCRIPTION}
                    maxLength={CLASS_CONSTANTS.LIMITS.DESCRIPTION_MAX_LENGTH}
                    rows={4}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {(field.value?.length || 0)} / {CLASS_CONSTANTS.LIMITS.DESCRIPTION_MAX_LENGTH} ký tự
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image */}
          <div className="space-y-4">
            <FormLabel>Ảnh bìa</FormLabel>

            <ImageUpload
              classId={classData?.id}
              currentImageUrl={coverImageUrl}
              onUploadSuccess={(updatedClass) => {
                form.setValue('coverImageUrl', updatedClass.coverImageUrl || '')
              }}
              onUploadSuccessTemp={(imageUrl) => {
                form.setValue('coverImageUrl', imageUrl)
              }}
              disabled={isSubmitting}
            />

            <FormField
              control={control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Hoặc nhập URL ảnh bìa
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !watch('name')?.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Đang lưu...' : classData ? 'Cập nhật' : 'Tạo lớp học'}
              </Button>
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
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}
