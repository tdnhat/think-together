/**
 * Leaderboard Feature Types
 * Type definitions for leaderboard-related data structures
 */

// Global Leaderboard Entry DTO (matches backend GlobalLeaderboardEntryDto)
export interface LeaderboardEntryDto {
  attemptId: string
  userId?: string
  nickname: string
  score: number
  correctAnswers: number
  totalQuestions: number
  completionTimeMs?: number
  completedAt: string
  quizSetId?: string
  quizSetTitle?: string
  challengeId?: string
  challengeTitle?: string
  rank: number
  // Homework/Class related fields
  isHomework?: boolean
  homeworkId?: string
  homeworkTitle?: string
  classId?: string
  className?: string
  submissionStatus?: 'Submitted' | 'Late'
}

// Leaderboard Query Parameters
export interface LeaderboardQueryParams {
  quizSetId?: string
  challengeId?: string
  timePeriod?: 'today' | 'week' | 'month' | 'all'
  sortBy?: 'score' | 'accuracy' | 'time' | 'completedAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
  isHomework?: boolean
  classId?: string
  homeworkId?: string
}

// Leaderboard Response DTO
export interface LeaderboardDto {
  entries: LeaderboardEntryDto[]
  totalEntries: number
  page: number
  pageSize: number
  totalPages: number
}

// Leaderboard Filter Options
export interface LeaderboardFilters {
  quizSetId?: string
  challengeId?: string
  timePeriod: 'today' | 'week' | 'month' | 'all'
  sortBy: 'score' | 'accuracy' | 'time' | 'completedAt'
  sortOrder: 'asc' | 'desc'
  isHomework?: boolean // Filter by homework vs public challenge
  classId?: string // Filter by class
  homeworkId?: string // Filter by specific homework
}

// Leaderboard Statistics DTO
export interface LeaderboardStatsDto {
  totalAttempts: number
  totalParticipants: number
  averageScore: number
  averageAccuracy: number
  averageCompletionTimeMs?: number
  completionRate: number
  topScore: number
  recentActivityCount: number
}

// Quiz Set Summary for Leaderboard
export interface QuizSetSummaryDto {
  id: string
  title: string
  totalAttempts: number
  averageScore: number
  averageAccuracy: number
  topScore: number
}
