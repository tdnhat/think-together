/**
 * Leaderboard API Service
 * Handles API calls for leaderboard data
 */

import { api } from '@/lib/api/client'
import { LEADERBOARD_ENDPOINTS, buildQueryString } from '@/lib/api/endpoints'
import type { ApiResponse } from '@/lib/api/types'
import type {
  LeaderboardDto,
  LeaderboardEntryDto,
  LeaderboardQueryParams,
  LeaderboardStatsDto,
} from '../types'

/**
 * Get leaderboard entries
 */
export async function getLeaderboard(
  params: LeaderboardQueryParams
): Promise<LeaderboardDto> {
  const queryParams: Record<string, unknown> = {
    page: params.page || 1,
    pageSize: params.pageSize || 20,
  }

  if (params.quizSetId) {
    queryParams.quizSetId = params.quizSetId
  }

  if (params.challengeId) {
    queryParams.challengeId = params.challengeId
  }

  if (params.timePeriod) {
    queryParams.timePeriod = params.timePeriod
  }

  if (params.sortBy) {
    queryParams.sortBy = params.sortBy
  }

  if (params.sortOrder) {
    queryParams.sortOrder = params.sortOrder
  }

  if (params.isHomework !== undefined) {
    queryParams.isHomework = params.isHomework
  }

  if (params.classId) {
    queryParams.classId = params.classId
  }

  if (params.homeworkId) {
    queryParams.homeworkId = params.homeworkId
  }

  const queryString = buildQueryString(queryParams)
  const response = await api.get<ApiResponse<LeaderboardDto>>(
    `${LEADERBOARD_ENDPOINTS.GET_LEADERBOARD}${queryString}`
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải bảng xếp hạng')
  }

  return response.data
}

/**
 * Get leaderboard entry by attempt ID
 * 
 * TODO: Replace with actual API call when ready
 */
export async function getLeaderboardEntry(
  attemptId: string
): Promise<LeaderboardEntryDto | null> {
  // Mock implementation
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  return {
    attemptId,
    userId: 'user-1',
    nickname: 'Người chơi mẫu',
    score: 85,
    correctAnswers: 8,
    totalQuestions: 10,
    completionTimeMs: 120000,
    completedAt: new Date().toISOString(),
    rank: 1,
  }
}

/**
 * Get leaderboard statistics
 */
export async function getLeaderboardStats(
  params?: LeaderboardQueryParams
): Promise<LeaderboardStatsDto> {
  const queryParams: Record<string, unknown> = {}

  if (params?.quizSetId) {
    queryParams.quizSetId = params.quizSetId
  }

  if (params?.challengeId) {
    queryParams.challengeId = params.challengeId
  }

  if (params?.timePeriod) {
    queryParams.timePeriod = params.timePeriod
  }

  const queryString = buildQueryString(queryParams)
  const response = await api.get<ApiResponse<LeaderboardStatsDto>>(
    `${LEADERBOARD_ENDPOINTS.GET_LEADERBOARD}/stats${queryString}`
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải thống kê bảng xếp hạng')
  }

  return response.data
}
