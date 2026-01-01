import { useQuery } from '@tanstack/react-query'
import { quizSetService } from '../api/quiz-set.service'
import type { QuizSetDto } from '@/types/api'

const QUERY_KEYS = {
  QUIZ_SET: (id: string) => ['quiz-sets', id] as const,
}

/**
 * Hook for fetching a single quiz set
 */
export function useQuizSet(id: string) {
  const {
    data: quizSet,
    isLoading: isLoadingQuizSet,
    error: quizSetError,
    refetch: refetchQuizSet,
  } = useQuery({
    queryKey: QUERY_KEYS.QUIZ_SET(id),
    queryFn: async () => {
      return await quizSetService.getQuizSetById(id)
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    quizSet,
    isLoadingQuizSet,
    quizSetError,
    refetchQuizSet,
  }
}

