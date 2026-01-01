'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toastSuccess, toastError } from '@/lib/utils/toast'

import { quizSetService } from '../api/quiz-set.service'
import { QUIZ_SET_CONSTANTS } from '../constants'
import { CreateQuizSetFormData, UpdateQuizSetFormData } from '@/lib/validators'
import type { QuizSetDto, QuizSetQueryParams } from '@/types/api'

const QUERY_KEYS = {
  QUIZ_SETS: (params?: QuizSetQueryParams) => ['quiz-sets', params] as const,
  QUIZ_SET: (id: string) => ['quiz-sets', id] as const,
}

/**
 * Hook for managing quiz sets
 * Provides CRUD operations with optimistic updates and error handling
 */
export function useQuizSets(params?: QuizSetQueryParams) {
  const queryClient = useQueryClient()

  // Get all quiz sets with pagination
  const {
    data: paginatedData,
    isLoading: isLoadingQuizSets,
    error: quizSetsError,
    refetch: refetchQuizSets,
  } = useQuery({
    queryKey: QUERY_KEYS.QUIZ_SETS(params),
    queryFn: async () => {
      return quizSetService.getAllQuizSets(params)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const quizSets = paginatedData?.data || []
  const pagination = paginatedData ? {
    total: paginatedData.total,
    page: paginatedData.page,
    pageSize: paginatedData.pageSize,
    totalPages: paginatedData.totalPages,
  } : undefined

  // Get single quiz set - Note: This should be used as a separate hook
  // Usage: const { data: quizSet } = useQuery({
  //   queryKey: QUERY_KEYS.QUIZ_SET(id),
  //   queryFn: async () => {
  //     const response = await quizSetService.getQuizSetById(id)
  //     return response.success ? response.data : null
  //   },
  //   enabled: !!id,
  //   staleTime: 5 * 60 * 1000,
  // })

  // Create quiz set mutation
  const createQuizSetMutation = useMutation({
    mutationFn: async (data: CreateQuizSetFormData) => {
      return quizSetService.createQuizSet(data)
    },
    onSuccess: () => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['quiz-sets'] })

      toastSuccess(QUIZ_SET_CONSTANTS.MESSAGES.CREATE_SUCCESS)
    },
    onError: (error) => {
      toastError(error.message || QUIZ_SET_CONSTANTS.MESSAGES.CREATE_FAILED)
    },
  })

  // Update quiz set mutation
  const updateQuizSetMutation = useMutation({
    mutationFn: async (data: UpdateQuizSetFormData) => {
      return quizSetService.updateQuizSet(data)
    },
    onSuccess: (updatedQuizSet) => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['quiz-sets'] })

      // Update individual quiz set cache
      queryClient.setQueryData(QUERY_KEYS.QUIZ_SET(updatedQuizSet.id), updatedQuizSet)

      toastSuccess(QUIZ_SET_CONSTANTS.MESSAGES.UPDATE_SUCCESS)
    },
    onError: (error) => {
      toastError(error.message || QUIZ_SET_CONSTANTS.MESSAGES.UPDATE_FAILED)
    },
  })

  // Delete quiz set mutation
  const deleteQuizSetMutation = useMutation({
    mutationFn: async (id: string) => {
      await quizSetService.deleteQuizSet(id)
      return id
    },
    onSuccess: (deletedId) => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['quiz-sets'] })

      // Remove individual cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.QUIZ_SET(deletedId) })

      toastSuccess(QUIZ_SET_CONSTANTS.MESSAGES.DELETE_SUCCESS)
    },
    onError: (error) => {
      toastError(error.message || QUIZ_SET_CONSTANTS.MESSAGES.DELETE_FAILED)
    },
  })

  // Publish quiz set mutation
  const publishQuizSetMutation = useMutation({
    mutationFn: async (id: string) => {
      await quizSetService.publishQuizSet(id)
      return id
    },
    onSuccess: (publishedId) => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['quiz-sets'] })

      // Update individual quiz set cache
      queryClient.setQueryData<QuizSetDto | undefined>(
        QUERY_KEYS.QUIZ_SET(publishedId),
        (oldData) => oldData ? { ...oldData, isPublished: true } : undefined
      )

      toastSuccess(QUIZ_SET_CONSTANTS.MESSAGES.PUBLISH_SUCCESS)
    },
    onError: (error) => {
      toastError(error.message || QUIZ_SET_CONSTANTS.MESSAGES.PUBLISH_FAILED)
    },
  })

  // Duplicate quiz set mutation
  const duplicateQuizSetMutation = useMutation({
    mutationFn: async (id: string) => {
      return quizSetService.duplicateQuizSet(id)
    },
    onSuccess: () => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['quiz-sets'] })

      toastSuccess('Bộ trắc nghiệm đã được sao chép thành công')
    },
    onError: (error) => {
      toastError(error.message || 'Không thể sao chép bộ trắc nghiệm')
    },
  })

  return {
    // Data
    quizSets,
    pagination,
    isLoadingQuizSets,
    quizSetsError,

    // Queries
    refetchQuizSets,

    // Mutations
    createQuizSet: createQuizSetMutation.mutateAsync,
    updateQuizSet: updateQuizSetMutation.mutateAsync,
    deleteQuizSet: deleteQuizSetMutation.mutateAsync,
    publishQuizSet: publishQuizSetMutation.mutateAsync,
    duplicateQuizSet: duplicateQuizSetMutation.mutateAsync,

    // Mutation states
    isCreating: createQuizSetMutation.isPending,
    isUpdating: updateQuizSetMutation.isPending,
    isDeleting: deleteQuizSetMutation.isPending,
    isPublishing: publishQuizSetMutation.isPending,
    isDuplicating: duplicateQuizSetMutation.isPending,
  }
}
