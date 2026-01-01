'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Checkbox } from '@/shared/ui/checkbox'
import { Textarea } from '@/shared/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
import { CategoryDto } from '@/types/api'
import {
  createCategorySchema,
  updateCategorySchema,
  type CreateCategoryFormData,
  type UpdateCategoryFormData
} from '@/lib/validators'

interface CategoryFormProps {
  category?: CategoryDto | null
  onSubmit: (data: CreateCategoryFormData | UpdateCategoryFormData) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  showActions?: boolean
}

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isSubmitting = false,
  showActions = true,
}: CategoryFormProps) {
  const isEditing = !!category
  const schema = isEditing ? updateCategorySchema : createCategorySchema

  const form = useForm<CreateCategoryFormData | UpdateCategoryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      isActive: true,
      ...(isEditing && category ? {
        id: category.id,
        name: category.name,
        description: category.description || '',
        isActive: category.isActive,
      } : {})
    },
  })

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        id: category.id,
        name: category.name,
        description: category.description || '',
        isActive: category.isActive ?? true,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        isActive: true,
      })
    }
  }, [category, form])

  const handleSubmit = async (values: CreateCategoryFormData | UpdateCategoryFormData) => {
    await onSubmit(values)
  }

  return (
    <Form {...form}>
      <form id="category-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên danh mục <span className="text-destructive">*</span></FormLabel>
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

        {isEditing && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Kích hoạt danh mục này</FormLabel>
              </FormItem>
            )}
          />
        )}

        {showActions && (
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : isEditing ? 'Cập nhật' : 'Tạo mới'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Hủy
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  )
}

