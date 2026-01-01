'use client'

import { useQuery } from '@tanstack/react-query'
import { quizSetService } from '../api/quiz-set.service'
import type { QuizSetQueryParams } from '@/types/api'

const QUERY_KEYS = {
  PUBLIC_QUIZ_SETS: (params?: QuizSetQueryParams) => ['public-quiz-sets', params] as const,
}

/**
 * Hook for fetching public published quiz sets for discovery
 * Provides read-only access to published quizzes
 */
export function usePublicQuizSets(params?: QuizSetQueryParams) {
  const {
    data: paginatedData,
    isLoading: isLoadingQuizSets,
    error: quizSetsError,
    refetch: refetchQuizSets,
  } = useQuery({
    queryKey: QUERY_KEYS.PUBLIC_QUIZ_SETS(params),
    queryFn: async () => {
      return quizSetService.getPublicQuizSets(params)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const quizSets = paginatedData?.data || []
  const pagination = paginatedData
    ? {
        total: paginatedData.total,
        page: paginatedData.page,
        pageSize: paginatedData.pageSize,
        totalPages: paginatedData.totalPages,
      }
    : undefined

  return {
    quizSets,
    pagination,
    isLoadingQuizSets,
    quizSetsError,
    refetchQuizSets,
  }
}
