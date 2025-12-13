/**
 * Challenge Hooks
 * Custom React hooks for challenge operations
 */

'use client'

import { useCallback, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { challengeService } from '../api/challenge.service'
import { useChallengeStore } from '../store/challenge.store'
import { CHALLENGE_CONSTANTS } from '../constants'
import type {
  ChallengeDto,
  ChallengeAttemptDto,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest,
  FlagQuestionRequest,
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
    }: {
      challengeId: string
      nickname: string
    }) => {
      return challengeService.startAttempt(challengeId, { challengeId, nickname })
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
    queryFn: () => {
      if (!attemptId) throw new Error('Attempt ID is required')
      return challengeService.getAttempt(attemptId)
    },
    enabled: !!attemptId,
  })
}

/**
 * Hook for submitting an answer
 */
export function useSubmitAnswer() {
  const setAnswer = useChallengeStore((s) => s.setAnswer)

  return useMutation({
    mutationFn: async ({
      attemptId,
      data,
    }: {
      attemptId: string
      data: SubmitAnswerRequest
    }) => {
      return challengeService.submitAnswer(attemptId, data)
    },
    onSuccess: (attempt, variables) => {
      // Store the answer in the store if it exists
      if (attempt.questions && variables.data.questionId) {
        const question = attempt.questions.find((q) => q.id === variables.data.questionId)
        if (question && question.answer) {
          setAnswer(variables.data.questionId, question.answer)
        }
      }
    },
    onError: (error) => {
      console.error('Submit answer error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.SUBMIT_ANSWER_FAILED)
    },
  })
}

/**
 * Hook for submitting all answers at once
 */
export function useSubmitAnswers() {
  const setAnswer = useChallengeStore((s) => s.setAnswer)

  return useMutation({
    mutationFn: async ({
      attemptId,
      answers,
    }: {
      attemptId: string
      answers: Array<{
        questionId: string
        selectedOptionIndexes?: number[]
        matchingPairs?: Array<{ leftContent: string; rightContent: string }>
        orderingItems?: Array<{ content: string; position: number }>
      }>
    }) => {
      return challengeService.submitAnswers(attemptId, answers)
    },
    onSuccess: (attempt) => {
      // Store all answers in the store
      attempt.questions.forEach((question) => {
        if (question.answer) {
          setAnswer(question.id, question.answer)
        }
      })
      toast.success('Đã lưu tất cả câu trả lời')
    },
    onError: (error) => {
      console.error('Submit answers error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.SUBMIT_ANSWER_FAILED)
    },
  })
}

/**
 * Hook for completing an attempt
 */
export function useCompleteAttempt() {
  return useMutation({
    mutationFn: async ({
      attemptId,
      completionTimeMs,
    }: {
      attemptId: string
      completionTimeMs: number
    }) => {
      return challengeService.completeAttempt(attemptId, {
        attemptId,
        completionTimeMs,
      })
    },
    onSuccess: () => {
      toast.success(CHALLENGE_CONSTANTS.MESSAGES.COMPLETE_SUCCESS)
    },
    onError: (error) => {
      console.error('Complete attempt error:', error)
      toast.error(CHALLENGE_CONSTANTS.MESSAGES.COMPLETE_FAILED)
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
 * Hook for flagging/unflagging a question
 */
export function useFlagQuestion() {
  const toggleFlag = useChallengeStore((s) => s.toggleFlagQuestion)

  return useMutation({
    mutationFn: async ({
      attemptId,
      questionId,
      isFlagged,
    }: {
      attemptId: string
      questionId: string
      isFlagged: boolean
    }) => {
      await challengeService.flagQuestion(attemptId, questionId, {
        isFlagged,
      })
    },
    onSuccess: (_, variables) => {
      toggleFlag(variables.questionId)
    },
    onError: (error) => {
      console.error('Flag question error:', error)
      toast.error('Không thể đánh dấu câu hỏi')
    },
  })
}

/**
 * Hook for getting leaderboard
 */
export function useLeaderboard(challengeId: string | undefined, limit: number = 50) {
  return useQuery({
    queryKey: ['leaderboard', challengeId, limit],
    queryFn: () => {
      if (!challengeId) throw new Error('Challenge ID is required')
      return challengeService.getLeaderboard(challengeId, limit)
    },
    enabled: !!challengeId,
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

