'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toastSuccess, toastError } from '@/lib/utils/toast'

import { questionService } from '../api/question.service'
import { QUESTION_CONSTANTS } from '../constants'
import type { 
  CreateQuestionRequest, 
  UpdateQuestionRequest,
  ReorderQuestionsRequest,
  QuestionQueryParams,
} from '@/types/api'

const QUERY_KEYS = {
  QUESTIONS: (quizSetId: string, params?: QuestionQueryParams) => ['questions', quizSetId, params] as const,
  QUESTION: (quizSetId: string, questionId: string) => ['questions', quizSetId, questionId] as const,
}

export function useQuestions(quizSetId: string, params?: QuestionQueryParams) {
  const queryClient = useQueryClient()

  // Get all questions for a quiz set with pagination
  const {
    data: paginatedData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: QUERY_KEYS.QUESTIONS(quizSetId, params),
    queryFn: async () => {
      return questionService.getQuestionsByQuizSetId(quizSetId, params)
    },
    enabled: !!quizSetId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const questions = paginatedData?.data || []
  const pagination = paginatedData ? {
    total: paginatedData.total,
    page: paginatedData.page,
    pageSize: paginatedData.pageSize,
    totalPages: paginatedData.totalPages,
  } : undefined

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (data: CreateQuestionRequest) => {
      return questionService.createQuestion(data)
    },
    onSuccess: () => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['questions', quizSetId] })
      toastSuccess(QUESTION_CONSTANTS.MESSAGES.CREATE_SUCCESS)
    },
    onError: (error: Error) => {
      toastError(error.message || QUESTION_CONSTANTS.MESSAGES.CREATE_FAILED)
    },
  })

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: async (data: UpdateQuestionRequest) => {
      return questionService.updateQuestion(quizSetId, data)
    },
    onSuccess: () => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['questions', quizSetId] })
      toastSuccess(QUESTION_CONSTANTS.MESSAGES.UPDATE_SUCCESS)
    },
    onError: (error: Error) => {
      toastError(error.message || QUESTION_CONSTANTS.MESSAGES.UPDATE_FAILED)
    },
  })

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      await questionService.deleteQuestion(quizSetId, questionId)
      return questionId
    },
    onSuccess: () => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['questions', quizSetId] })
      toastSuccess(QUESTION_CONSTANTS.MESSAGES.DELETE_SUCCESS)
    },
    onError: (error: Error) => {
      toastError(error.message || QUESTION_CONSTANTS.MESSAGES.DELETE_FAILED)
    },
  })

  // Reorder questions mutation
  const reorderQuestionsMutation = useMutation({
    mutationFn: async (data: ReorderQuestionsRequest) => {
      await questionService.reorderQuestions(data)
      return data
    },
    onSuccess: () => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['questions', quizSetId] })
      toastSuccess(QUESTION_CONSTANTS.MESSAGES.REORDER_SUCCESS)
    },
    onError: (error: Error) => {
      toastError(error.message || QUESTION_CONSTANTS.MESSAGES.REORDER_FAILED)
    },
  })

  // Duplicate question mutation
  const duplicateQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      return questionService.duplicateQuestion(quizSetId, questionId)
    },
    onSuccess: () => {
      // Invalidate queries to refetch with current params
      queryClient.invalidateQueries({ queryKey: ['questions', quizSetId] })
      toastSuccess(QUESTION_CONSTANTS.MESSAGES.DUPLICATE_SUCCESS)
    },
    onError: (error: Error) => {
      toastError(error.message || QUESTION_CONSTANTS.MESSAGES.DUPLICATE_FAILED)
    },
  })

  return {
    // Data
    questions,
    pagination,
    isLoadingQuestions,
    questionsError,
    
    // Actions
    createQuestion: createQuestionMutation.mutateAsync,
    updateQuestion: updateQuestionMutation.mutateAsync,
    deleteQuestion: deleteQuestionMutation.mutateAsync,
    reorderQuestions: reorderQuestionsMutation.mutateAsync,
    duplicateQuestion: duplicateQuestionMutation.mutateAsync,
    refetchQuestions,
    
    // Loading states
    isCreating: createQuestionMutation.isPending,
    isUpdating: updateQuestionMutation.isPending,
    isDeleting: deleteQuestionMutation.isPending,
    isReordering: reorderQuestionsMutation.isPending,
    isDuplicating: duplicateQuestionMutation.isPending,
  }
}

export function useQuestion(quizSetId: string, questionId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.QUESTION(quizSetId, questionId),
    queryFn: async () => {
      return questionService.getQuestionById(quizSetId, questionId)
    },
    enabled: !!quizSetId && !!questionId,
    staleTime: 5 * 60 * 1000,
  })
}
