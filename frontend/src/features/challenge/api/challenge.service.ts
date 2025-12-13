/**
 * Challenge API Service
 * Handles all API calls related to challenges
 */

import { apiClient } from '@/lib/api/client'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type {
  ChallengeDto,
  ChallengeAttemptDto,
  ChallengeLeaderboardDto,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  StartChallengeAttemptRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest,
  FlagQuestionRequest,
} from '../types'

const CHALLENGE_BASE_URL = '/api/challenges'

export const challengeService = {
  // Get all challenges for current user
  async getChallenges(
    page: number = 1,
    pageSize: number = 10,
    search?: string
  ): Promise<PaginatedResponse<ChallengeDto>> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())
    if (search) params.append('search', search)

    const response = await apiClient.get<PaginatedResponse<ChallengeDto>>(
      `${CHALLENGE_BASE_URL}?${params.toString()}`
    )
    return response
  },

  // Get single challenge by ID
  async getChallenge(id: string): Promise<ChallengeDto> {
    const response = await apiClient.get<ApiResponse<ChallengeDto>>(
      `${CHALLENGE_BASE_URL}/${id}`
    )
    return response.data!
  },

  // Get challenge by share link
  async getChallengeByShareLink(shareLink: string): Promise<ChallengeDto> {
    const response = await apiClient.get<ApiResponse<ChallengeDto>>(
      `${CHALLENGE_BASE_URL}/by-link/${shareLink}`
    )
    return response.data!
  },

  // Get challenge by quiz set ID (returns null if no challenge exists)
  async getChallengeByQuizSetId(quizSetId: string): Promise<ChallengeDto | null> {
    try {
      const response = await apiClient.get<ApiResponse<ChallengeDto>>(
        `${CHALLENGE_BASE_URL}/by-quiz/${quizSetId}`
      )
      return response.data ?? null
    } catch (error) {
      // 204 No Content or 404 means no challenge exists
      return null
    }
  },

  // Create challenge
  async createChallenge(data: CreateChallengeRequest): Promise<ChallengeDto> {
    const response = await apiClient.post<ApiResponse<ChallengeDto>>(
      CHALLENGE_BASE_URL,
      data
    )
    return response.data!
  },

  // Update challenge
  async updateChallenge(data: UpdateChallengeRequest): Promise<ChallengeDto> {
    const response = await apiClient.put<ApiResponse<ChallengeDto>>(
      `${CHALLENGE_BASE_URL}/${data.id}`,
      data
    )
    return response.data!
  },

  // Delete challenge
  async deleteChallenge(id: string): Promise<void> {
    await apiClient.delete(`${CHALLENGE_BASE_URL}/${id}`)
  },

  // Archive challenge
  async archiveChallenge(id: string): Promise<ChallengeDto> {
    const response = await apiClient.post<ApiResponse<ChallengeDto>>(
      `${CHALLENGE_BASE_URL}/${id}/archive`,
      {}
    )
    return response.data!
  },

  // Activate challenge
  async activateChallenge(id: string): Promise<ChallengeDto> {
    const response = await apiClient.post<ApiResponse<ChallengeDto>>(
      `${CHALLENGE_BASE_URL}/${id}/activate`,
      {}
    )
    return response.data!
  },

  // Start attempt
  async startAttempt(
    challengeId: string,
    data: StartChallengeAttemptRequest
  ): Promise<ChallengeAttemptDto> {
    const response = await apiClient.post<ApiResponse<ChallengeAttemptDto>>(
      `${CHALLENGE_BASE_URL}/${challengeId}/attempts`,
      data
    )
    return response.data!
  },

  // Get attempt details
  async getAttempt(attemptId: string): Promise<ChallengeAttemptDto> {
    const response = await apiClient.get<ApiResponse<ChallengeAttemptDto>>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}`
    )
    return response.data!
  },

  // Submit answer
  async submitAnswer(
    attemptId: string,
    data: SubmitAnswerRequest
  ): Promise<ChallengeAttemptDto> {
    const response = await apiClient.post<ApiResponse<ChallengeAttemptDto>>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}/answers`,
      data
    )
    return response.data!
  },

  // Submit all answers at once
  async submitAnswers(
    attemptId: string,
    answers: Array<{
      questionId: string
      selectedOptionIndexes?: number[]
      matchingPairs?: Array<{ leftContent: string; rightContent: string }>
      orderingItems?: Array<{ content: string; position: number }>
    }>
  ): Promise<ChallengeAttemptDto> {
    const response = await apiClient.post<ApiResponse<ChallengeAttemptDto>>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}/submit-answers`,
      { answers }
    )
    return response.data!
  },

  // Complete attempt
  async completeAttempt(
    attemptId: string,
    data: CompleteAttemptRequest
  ): Promise<ChallengeAttemptDto> {
    const response = await apiClient.post<ApiResponse<ChallengeAttemptDto>>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}/complete`,
      data
    )
    return response.data!
  },

  // Abandon attempt
  async abandonAttempt(attemptId: string): Promise<ChallengeAttemptDto> {
    const response = await apiClient.post<ApiResponse<ChallengeAttemptDto>>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}/abandon`,
      {}
    )
    return response.data!
  },

  // Flag question
  async flagQuestion(
    attemptId: string,
    questionId: string,
    data: FlagQuestionRequest
  ): Promise<void> {
    await apiClient.put(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}/questions/${questionId}/flag`,
      data
    )
  },

  // Get leaderboard
  async getLeaderboard(challengeId: string, limit: number = 50): Promise<ChallengeLeaderboardDto> {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())

    const response = await apiClient.get<ApiResponse<ChallengeLeaderboardDto>>(
      `${CHALLENGE_BASE_URL}/${challengeId}/leaderboard?${params.toString()}`
    )
    return response.data!
  },
}

