'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../api/category.service'
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'
import { toastSuccess, toastError } from '@/lib/utils/toast'

export const useCategories = () => {
  const queryClient = useQueryClient()

  // Query: Get all categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(true),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Mutation: Create category
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toastSuccess('Danh mục đã được tạo')
    },
    onError: (error: any) => {
      toastError(error.response?.data?.detail || 'Không thể tạo danh mục')
    }
  })

  // Mutation: Update category
  const updateMutation = useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoryService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toastSuccess('Danh mục đã được cập nhật')
    },
    onError: (error: any) => {
      toastError(error.response?.data?.detail || 'Không thể cập nhật danh mục')
    }
  })

  // Mutation: Delete category
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toastSuccess('Danh mục đã được xóa')
    },
    onError: (error: any) => {
      toastError(error.response?.data?.detail || 'Không thể xóa danh mục')
    }
  })

  return {
    categories,
    isLoading,
    error,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}

