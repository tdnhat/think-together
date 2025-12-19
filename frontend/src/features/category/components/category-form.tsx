'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Textarea } from '@/shared/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được trống').max(255, 'Tối đa 255 ký tự'),
  description: z.string().max(2000, 'Tối đa 2000 ký tự').optional().or(z.literal('')),
  displayOrder: z.number().min(0, 'Thứ tự phải là số không âm'),
  isActive: z.boolean().default(true),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

interface CategoryFormProps {
  category?: CategoryDto | null
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CategoryFormProps) {
  const isEditing = !!category

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      displayOrder: category?.displayOrder || 0,
      isActive: category?.isActive ?? true,
    },
  })

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        displayOrder: category.displayOrder,
        isActive: category.isActive ?? true,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        displayOrder: 0,
        isActive: true,
      })
    }
  }, [category, form])

  const handleSubmit = async (values: CategoryFormValues) => {
    if (isEditing && category) {
      await onSubmit({
        id: category.id,
        name: values.name,
        description: values.description || undefined,
        displayOrder: values.displayOrder,
        isActive: values.isActive,
      } as UpdateCategoryRequest)
    } else {
      await onSubmit({
        name: values.name,
        description: values.description || undefined,
        displayOrder: values.displayOrder,
      } as CreateCategoryRequest)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục *</FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Tiếng Anh, Toán Học..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả chi tiết về danh mục..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thứ tự hiển thị</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4"
                  />
                </FormControl>
                <FormLabel className="!mt-0">Kích hoạt danh mục này</FormLabel>
              </FormItem>
            )}
          />
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Hủy
          </Button>
        </div>
      </form>
    </Form>
  )
}

