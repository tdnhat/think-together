/**
 * Challenge Hooks
 * Custom React hooks for challenge operations
 */

'use client'

import { useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { challengeService } from '../api/challenge.service'
import { useChallengeStore } from '../store/challenge.store'
import { CHALLENGE_CONSTANTS } from '../constants'
import type {
  ChallengeDto,
  ChallengeAttemptDto,
  ChallengeAttemptApiDto,
  CreateChallengeRequest,
  UpdateChallengeRequest,
} from '../types'

/**
 * Hook for getting a single challenge
 */
export function useChallenge(id: string | undefined) {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: () => {
      if (!id) throw new Error('Challenge ID is required')
      return challengeService.getChallenge(id)
    },
    enabled: !!id,
  })
}

/**
 * Hook for getting challenge by share link
 */
export function useChallengeLinkResolver(shareLink: string | undefined) {
  return useQuery({
    queryKey: ['challenge-by-link', shareLink],
    queryFn: () => {
      if (!shareLink) throw new Error('Share link is required')
      return challengeService.getChallengeByShareLink(shareLink)
    },
    enabled: !!shareLink,
  })
}

/**
 * Hook for getting challenge by quiz set ID
 * Returns null if no challenge exists for this quiz
 */
export function useChallengeByQuizSetId(quizSetId: string | undefined) {
  return useQuery({
    queryKey: ['challenge-by-quiz', quizSetId],
    queryFn: () => {
      if (!quizSetId) return null
      return challengeService.getChallengeByQuizSetId(quizSetId)
    },
    enabled: !!quizSetId,
  })
}

/**
 * Hook for getting user's challenges
 */
export function useChallenges(page: number = 1, pageSize: number = 10, search?: string) {
  return useQuery({
    queryKey: ['challenges', page, pageSize, search],
    queryFn: () => challengeService.getChallenges(page, pageSize, search),
  })
}

/**
 * Hook for creating a challenge
 */
export function useCreateChallenge() {
  return useMutation({
    mutationFn: (data: CreateChallengeRequest) => challengeService.createChallenge(data),
    onSuccess: () => {
      toast.success(CHALLENGE_CONSTANTS.MESSAGES.CREATE_SUCCESS)
    },
    onError: (error) => {
      console.error('Create challenge error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.CREATE_FAILED)
    },
  })
}

/**
 * Hook for updating a challenge
 */
export function useUpdateChallenge() {
  return useMutation({
    mutationFn: (data: UpdateChallengeRequest) => challengeService.updateChallenge(data),
    onSuccess: () => {
      toast.success(CHALLENGE_CONSTANTS.MESSAGES.UPDATE_SUCCESS)
    },
    onError: (error) => {
      console.error('Update challenge error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.UPDATE_FAILED)
    },
  })
}

/**
 * Hook for deleting a challenge
 */
export function useDeleteChallenge() {
  return useMutation({
    mutationFn: (id: string) => challengeService.deleteChallenge(id),
    onSuccess: () => {
      toast.success(CHALLENGE_CONSTANTS.MESSAGES.DELETE_SUCCESS)
    },
    onError: (error) => {
      console.error('Delete challenge error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.DELETE_FAILED)
    },
  })
}

/**
 * Hook for starting a challenge attempt
 */
export function useStartAttempt() {
  const setCurrentAttempt = useChallengeStore((s) => s.setCurrentAttempt)

  return useMutation({
    mutationFn: async ({
      challengeId,
      nickname,
      userId,
      homeworkId,
    }: {
      challengeId: string
      nickname: string
      userId?: string
      homeworkId?: string
    }): Promise<ChallengeAttemptDto> => {
      const apiAttempt = await challengeService.startAttempt(challengeId, { 
        challengeId, 
        nickname,
        userId,
        homeworkId,
      })
      // Map API response to internal type with default frontend state
      return {
        ...apiAttempt,
        currentQuestionIndex: 0,
        flaggedQuestionIds: [],
        questions: apiAttempt.questions.map(q => ({
          ...q,
          isFlagged: false,
          isAnswered: false,
          answer: undefined,
        })),
      }
    },
    onSuccess: (attempt) => {
      setCurrentAttempt(attempt)
      toast.success(CHALLENGE_CONSTANTS.MESSAGES.START_SUCCESS)
    },
    onError: (error) => {
      console.error('Start attempt error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.START_FAILED)
    },
  })
}

/**
 * Hook for getting attempt details
 */
export function useAttempt(attemptId: string | undefined) {
  return useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: async (): Promise<ChallengeAttemptDto> => {
      if (!attemptId) throw new Error('Attempt ID is required')
      const apiAttempt = await challengeService.getAttempt(attemptId)
      // Map API response to internal type with default frontend state
      return {
        ...apiAttempt,
        currentQuestionIndex: 0, // Frontend manages this
        flaggedQuestionIds: [], // Frontend manages this
        questions: apiAttempt.questions.map(q => ({
          ...q,
          isFlagged: false, // Frontend manages this
          isAnswered: false, // Frontend manages this
          answer: undefined, // Not returned by API
        })),
      }
    },
    enabled: !!attemptId,
  })
}

/**
 * Hook for submitting all answers at once
 * Returns the completed attempt immediately (grading is done synchronously on server)
 */
export function useSubmitAnswers() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({
      attemptId,
      answers,
      homeworkId,
    }: {
      attemptId: string
      answers: Array<{
        questionId: string
        selectedOptionIndexes?: number[]
        matchingPairs?: Array<{ leftContent: string; rightContent: string }>
        orderingItems?: Array<{ content: string; position: number }>
      }>
      homeworkId?: string
    }): Promise<ChallengeAttemptApiDto> => {
      return challengeService.submitAnswers(attemptId, answers, homeworkId)
    },
    onSuccess: (completedAttempt) => {
      // Map API response to match the ChallengeAttemptDto type expected by the cache
      const mappedAttempt: ChallengeAttemptDto = {
        ...completedAttempt,
        currentQuestionIndex: 0,
        flaggedQuestionIds: [],
        questions: completedAttempt.questions.map(q => ({
          ...q,
          isFlagged: false,
          isAnswered: true,
          answer: undefined,
        })),
      }
      
      // Update the query cache with the completed attempt data
      queryClient.setQueryData(['attempt', completedAttempt.id], mappedAttempt)
      
      toast.success('Đã nộp bài và chấm điểm thành công!')
    },
    onError: (error) => {
      console.error('Submit answers error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.SUBMIT_ANSWER_FAILED)
    },
  })
}

/**
 * Hook for abandoning an attempt
 */
export function useAbandonAttempt() {
  return useMutation({
    mutationFn: async ({
      attemptId,
    }: {
      attemptId: string
    }) => {
      return challengeService.abandonAttempt(attemptId)
    },
    onError: (error) => {
      console.error('Abandon attempt error:', error)
    },
  })
}

/**
 * Hook for getting leaderboard
 */
export function useLeaderboard(
  challengeId: string | undefined,
  page: number = 1,
  pageSize: number = 20
) {
  return useQuery({
    queryKey: ['leaderboard', challengeId, page, pageSize],
    queryFn: () => {
      if (!challengeId) throw new Error('Challenge ID is required')
      return challengeService.getLeaderboard(challengeId, page, pageSize)
    },
    enabled: !!challengeId,
  })
}

/**
 * Hook for getting challenge statistics
 */
export function useChallengeStats(challengeId: string | undefined) {
  return useQuery({
    queryKey: ['challenge-stats', challengeId],
    queryFn: () => {
      if (!challengeId) throw new Error('Challenge ID is required')
      return challengeService.getChallengeStats(challengeId)
    },
    enabled: !!challengeId,
  })
}

/**
 * Hook for polling attempt status until completion
 */
export function usePollAttemptCompletion(attemptId: string | undefined, enabled: boolean = false) {
  return useQuery({
    queryKey: ['attempt-completion', attemptId],
    queryFn: async (): Promise<ChallengeAttemptDto> => {
      if (!attemptId) throw new Error('Attempt ID is required')
      const apiAttempt = await challengeService.getAttempt(attemptId)
      // Map API response to internal type with default frontend state
      return {
        ...apiAttempt,
        currentQuestionIndex: 0, // Frontend manages this
        flaggedQuestionIds: [], // Frontend manages this
        questions: apiAttempt.questions.map(q => ({
          ...q,
          isFlagged: false, // Frontend manages this
          isAnswered: false, // Frontend manages this
          answer: undefined, // Not returned by API
        })),
      }
    },
    enabled: !!attemptId && enabled,
    refetchInterval: (query) => {
      // Stop polling when attempt is completed or failed
      if (query.state.data && (query.state.data.status === 'Completed' || query.state.data.status === 'Abandoned')) {
        return false
      }
      // Poll every 2 seconds while processing
      return 2000
    },
    refetchIntervalInBackground: false,
  })
}

/**
 * Hook for managing timer
 */
export function useChallengeTimer(timeLimitMs?: number) {
  const { remainingTimeMs, setRemainingTime } = useChallengeStore()

  useEffect(() => {
    if (!timeLimitMs) return

    setRemainingTime(timeLimitMs)

    const interval = setInterval(() => {
      setRemainingTime(Math.max(0, remainingTimeMs - 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLimitMs])

  return {
    remainingTimeMs,
    isTimeUp: remainingTimeMs <= 0,
    isWarning: remainingTimeMs <= CHALLENGE_CONSTANTS.TIMER.WARNING_THRESHOLD,
    isCritical: remainingTimeMs <= CHALLENGE_CONSTANTS.TIMER.CRITICAL_THRESHOLD,
  }
}
