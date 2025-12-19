'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../api/category.service'
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'
import { toastSuccess, toastError } from '@/lib/utils/toast'

const QUERY_KEYS = {
  CATEGORIES: (onlyActive?: boolean) => ['categories', { onlyActive }] as const,
  CATEGORY: (id: string) => ['categories', id] as const,
}

export const useCategories = (onlyActive: boolean = true) => {
  const queryClient = useQueryClient()

  // Query: Get all categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.CATEGORIES(onlyActive),
    queryFn: async () => {
      const response = await categoryService.getAll(onlyActive)
      return response.success ? response.data || [] : []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Mutation: Create category
  const createMutation = useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await categoryService.create(data)
      if (!response.success) {
        throw new Error(response.message || 'Không thể tạo danh mục')
      }
      return response.data!
    },
    onSuccess: (newCategory) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Update individual category cache
      queryClient.setQueryData(QUERY_KEYS.CATEGORY(newCategory.id), newCategory)
      toastSuccess('Danh mục đã được tạo')
    },
    onError: (error: Error) => {
      toastError(error.message || 'Không thể tạo danh mục')
    },
  })

  // Mutation: Update category
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCategoryRequest) => {
      const response = await categoryService.update(data)
      if (!response.success) {
        throw new Error(response.message || 'Không thể cập nhật danh mục')
      }
      return response.data!
    },
    onSuccess: (updatedCategory) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Update individual category cache
      queryClient.setQueryData(QUERY_KEYS.CATEGORY(updatedCategory.id), updatedCategory)
      toastSuccess('Danh mục đã được cập nhật')
    },
    onError: (error: Error) => {
      toastError(error.message || 'Không thể cập nhật danh mục')
    },
  })

  // Mutation: Delete category
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await categoryService.delete(id)
      if (!response.success) {
        throw new Error(response.message || 'Không thể xóa danh mục')
      }
      return id
    },
    onSuccess: (deletedId) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Remove individual category cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.CATEGORY(deletedId) })
      toastSuccess('Danh mục đã được xóa')
    },
    onError: (error: Error) => {
      toastError(error.message || 'Không thể xóa danh mục')
    },
  })

  return {
    categories,
    isLoading,
    error,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}

