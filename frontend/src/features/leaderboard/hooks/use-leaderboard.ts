/**
 * useLeaderboard Hook
 * Custom hook for fetching and managing leaderboard data
 */

import { useState, useEffect } from 'react'
import { getLeaderboard, getLeaderboardStats } from '../api/leaderboard.service'
import type {
  LeaderboardDto,
  LeaderboardQueryParams,
  LeaderboardStatsDto,
} from '../types'

interface UseLeaderboardOptions {
  params?: LeaderboardQueryParams
  enabled?: boolean
}

interface UseLeaderboardReturn {
  data: LeaderboardDto | null
  stats: LeaderboardStatsDto | null
  isLoading: boolean
  isLoadingStats: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useLeaderboard(
  options: UseLeaderboardOptions = {}
): UseLeaderboardReturn {
  const { params = {}, enabled = true } = options
  const [data, setData] = useState<LeaderboardDto | null>(null)
  const [stats, setStats] = useState<LeaderboardStatsDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await getLeaderboard(params)
      setData(result)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Không thể tải bảng xếp hạng'
      setError(errorMessage)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!enabled) return

    setIsLoadingStats(true)

    try {
      const result = await getLeaderboardStats(params)
      setStats(result)
    } catch (err) {
      // Stats error doesn't block the page
      console.error('Failed to load stats:', err)
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    fetchLeaderboard()
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.quizSetId,
    params.challengeId,
    params.timePeriod,
    params.sortBy,
    params.sortOrder,
    params.page,
    params.pageSize,
    params.isHomework,
    params.classId,
    params.homeworkId,
    enabled,
  ])

  return {
    data,
    stats,
    isLoading,
    isLoadingStats,
    error,
    refetch: fetchLeaderboard,
  }
}
