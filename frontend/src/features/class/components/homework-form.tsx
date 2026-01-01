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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import {
  createHomeworkSchema,
  updateHomeworkSchema,
  type CreateHomeworkFormData,
  type UpdateHomeworkFormData,
} from '@/lib/validators'
import { useQuizSets } from '@/features/quiz/hooks'
import type { HomeworkDto, CreateHomeworkRequest, UpdateHomeworkRequest } from '../types'

interface HomeworkFormProps {
  classId: string
  homework?: HomeworkDto | null
  onSubmit: (data: CreateHomeworkRequest | UpdateHomeworkRequest) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
  showActions?: boolean
}

export function HomeworkForm({
  classId,
  homework,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
  showActions = true,
}: Readonly<HomeworkFormProps>) {
  const { quizSets, isLoadingQuizSets } = useQuizSets({
    page: 1,
    pageSize: 100, // Get all quiz sets for the dropdown
  })

  const isEditing = !!homework

  const form = useForm<CreateHomeworkFormData | UpdateHomeworkFormData>({
    resolver: zodResolver(isEditing ? updateHomeworkSchema : createHomeworkSchema),
    defaultValues: {
      title: homework?.title || '',
      quizSetId: homework?.quizSetId || '',
      dueDate: homework?.dueDate ? new Date(homework.dueDate).toISOString().slice(0, 16) : '',
    },
  })

  const { handleSubmit, control } = form

  const handleFormSubmit = async (data: CreateHomeworkFormData | UpdateHomeworkFormData) => {
    const submitData: CreateHomeworkRequest | UpdateHomeworkRequest = {
      ...(homework?.id && { id: homework.id }),
      classId,
      title: data.title?.trim() || '',
      quizSetId: data.quizSetId || '',
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    }

    await onSubmit(submitData)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
        <div className="space-y-6">
          {/* Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tiêu đề bài tập <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tiêu đề bài tập"
                    maxLength={255}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {field.value?.length || 0} / 255 ký tự
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quiz Set */}
          <FormField
            control={control}
            name="quizSetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Bộ câu hỏi <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || isLoadingQuizSets}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn bộ câu hỏi" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizSets?.map((quizSet) => (
                        <SelectItem key={quizSet.id} value={quizSet.id}>
                          {quizSet.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày hết hạn</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Để trống nếu không có hạn nộp
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          {showActions && (
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.watch('title')?.trim() || !form.watch('quizSetId')}
                className="flex-1"
              >
                {isSubmitting ? 'Đang lưu...' : homework ? 'Cập nhật' : 'Tạo bài tập'}
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
