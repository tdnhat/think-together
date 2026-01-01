/**
 * Challenge API Service
 * Handles all API calls related to challenges
 */

import { apiClient } from '@/lib/api/client'
import type {  PaginatedResponse } from '@/types/api'
import type {
  ChallengeDto,
  ChallengeAttemptApiDto,
  ChallengeLeaderboardDto,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  StartChallengeAttemptRequest,
  ChallengeStatsDto,
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
    return apiClient.get<ChallengeDto>(
      `${CHALLENGE_BASE_URL}/${id}`
    )
  },

  // Get challenge by share link
  async getChallengeByShareLink(shareLink: string): Promise<ChallengeDto> {
    return apiClient.get<ChallengeDto>(
      `${CHALLENGE_BASE_URL}/by-link/${shareLink}`
    )
  },

  // Get challenge by quiz set ID (returns null if no challenge exists)
  async getChallengeByQuizSetId(quizSetId: string): Promise<ChallengeDto | null> {
    try {
      return await apiClient.get<ChallengeDto>(
        `${CHALLENGE_BASE_URL}/by-quiz/${quizSetId}`
      )
    } catch (error) {
      // 204 No Content or 404 means no challenge exists
      return null
    }
  },

  // Create challenge
  async createChallenge(data: CreateChallengeRequest): Promise<ChallengeDto> {
    return apiClient.post<ChallengeDto>(
      CHALLENGE_BASE_URL,
      data
    )
  },

  // Update challenge
  async updateChallenge(data: UpdateChallengeRequest): Promise<ChallengeDto> {
    return apiClient.put<ChallengeDto>(
      `${CHALLENGE_BASE_URL}/${data.id}`,
      data
    )
  },

  // Delete challenge
  async deleteChallenge(id: string): Promise<void> {
    await apiClient.delete(`${CHALLENGE_BASE_URL}/${id}`)
  },

  // Archive challenge
  async archiveChallenge(id: string): Promise<ChallengeDto> {
    return apiClient.post<ChallengeDto>(
      `${CHALLENGE_BASE_URL}/${id}/archive`,
      {}
    )
  },

  // Activate challenge
  async activateChallenge(id: string): Promise<ChallengeDto> {
    return apiClient.post<ChallengeDto>(
      `${CHALLENGE_BASE_URL}/${id}/activate`,
      {}
    )
  },

  // Start attempt
  async startAttempt(
    challengeId: string,
    data: StartChallengeAttemptRequest
  ): Promise<ChallengeAttemptApiDto> {
    return apiClient.post<ChallengeAttemptApiDto>(
      `${CHALLENGE_BASE_URL}/${challengeId}/attempts`,
      data
    )
  },

  // Get attempt details
  async getAttempt(attemptId: string): Promise<ChallengeAttemptApiDto> {
    return apiClient.get<ChallengeAttemptApiDto>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}`
    )
  },

  // Submit all answers at once (now returns completed attempt immediately)
  async submitAnswers(
    attemptId: string,
    answers: Array<{
      questionId: string
      selectedOptionIndexes?: number[]
      matchingPairs?: Array<{ leftContent: string; rightContent: string }>
      orderingItems?: Array<{ content: string; position: number }>
    }>,
    homeworkId?: string
  ): Promise<ChallengeAttemptApiDto> {
    return apiClient.post<ChallengeAttemptApiDto>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}/submit-answers`,
      { answers, homeworkId }
    )
  },

  // Abandon attempt
  async abandonAttempt(attemptId: string): Promise<ChallengeAttemptApiDto> {
    return apiClient.post<ChallengeAttemptApiDto>(
      `${CHALLENGE_BASE_URL}/attempts/${attemptId}/abandon`,
      {}
    )
  },

  // Get leaderboard
  async getLeaderboard(
    challengeId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ChallengeLeaderboardDto> {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())

    return apiClient.get<ChallengeLeaderboardDto>(
      `${CHALLENGE_BASE_URL}/${challengeId}/leaderboard?${params.toString()}`
    )
  },

  // Get challenge statistics
  async getChallengeStats(challengeId: string): Promise<ChallengeStatsDto> {
    return apiClient.get<ChallengeStatsDto>(
      `${CHALLENGE_BASE_URL}/${challengeId}/stats`
    )
  },
}
