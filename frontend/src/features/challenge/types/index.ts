/**
 * Challenge Feature Types
 * Type definitions for challenge-related data structures
 */

import type { QuestionDto, QuestionType } from '@/types/api'

// Challenge Status enum
export enum ChallengeStatus {
  Active = 'Active',
  Archived = 'Archived',
}

// Challenge Attempt Status enum
export enum AttemptStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Abandoned = 'Abandoned',
}

// Challenge DTO (from backend)
export interface ChallengeDto {
  id: string
  creatorId: string
  quizSetId: string
  title: string
  description?: string
  shareLink: string
  status: ChallengeStatus
  showLeaderboard: boolean
  playCount: number
  createdAt: string
  updatedAt?: string
}

// Challenge Attempt DTO (from backend API)
export interface ChallengeAttemptApiDto {
  id: string
  challengeId: string
  userId?: string
  nickname: string
  scoreAchieved: number
  correctAnswers: number
  totalQuestions: number
  completionTimeMs?: number
  completedAt: string
  startedAt: string
  status: AttemptStatus
  timeLimitMs?: number
  remainingTimeMs?: number
  questions: ChallengeQuestionApiDto[]
}

// Challenge Question DTO (from backend API)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ChallengeQuestionApiDto extends QuestionDto {
  // No additional properties - backend doesn't return isFlagged, isAnswered, or answer
}

// Challenge Attempt DTO with frontend state
export interface ChallengeAttemptDto extends ChallengeAttemptApiDto {
  currentQuestionIndex: number
  flaggedQuestionIds: string[]
  questions: ChallengeQuestionDto[]
}

export interface ChallengeQuestionDto extends ChallengeQuestionApiDto {
  isFlagged: boolean
  isAnswered: boolean
  answer?: ChallengeAnswerDto
}

// Challenge Question DTO
export interface ChallengeQuestionDto extends QuestionDto {
  isFlagged: boolean
  isAnswered: boolean
  answer?: ChallengeAnswerDto
}

// Challenge Answer DTO
export interface ChallengeAnswerDto {
  id: string
  questionId: string
  submissionTimeMs: number
  isCorrect: boolean
  pointsEarned: number
  selectedOptionIndexes: number[]
  matchingPairs: AnswerMatchingPairDto[]
  orderingItems: AnswerOrderingItemDto[]
}

// Matching Pair Answer DTO
export interface AnswerMatchingPairDto {
  leftContent: string
  rightContent: string
}

// Ordering Item Answer DTO
export interface AnswerOrderingItemDto {
  content: string
  position: number
}

// Challenge Leaderboard Entry DTO
export interface ChallengeLeaderboardEntryDto {
  attemptId: string
  userId?: string
  nickname: string
  score: number
  correctAnswers: number
  totalQuestions: number
  completionTimeMs?: number
  completedAt: string
  rank: number
}

// Challenge Leaderboard DTO
export interface ChallengeLeaderboardDto {
  challengeId: string
  entries: ChallengeLeaderboardEntryDto[]
  totalEntries: number
  page: number
  pageSize: number
  totalPages: number
}

// Challenge Stats DTO
export interface ChallengeStatsDto {
  challengeId: string
  totalAttempts: number
  completedAttempts: number
  totalParticipants: number
  averageScore: number
  averageAccuracy: number
  completionRate: number
  topScore: number
  recentActivityCount: number
}

// Request DTOs
export interface CreateChallengeRequest {
  quizSetId: string
  title: string
  description?: string
}

export interface UpdateChallengeRequest {
  id: string
  title?: string
  description?: string
  showLeaderboard?: boolean
}

export interface StartChallengeAttemptRequest {
  challengeId: string
  nickname: string
  userId?: string
  homeworkId?: string
}

export interface CompleteAttemptRequest {
  attemptId: string
  completionTimeMs: number
}

export interface FlagQuestionRequest {
  isFlagged: boolean
}

// Local state for challenge store
export interface ChallengeState {
  // Current challenge data
  currentChallenge: ChallengeDto | null
  currentAttempt: ChallengeAttemptDto | null

  // Question navigation
  currentQuestionIndex: number

  // Timer
  remainingTimeMs: number
  totalTimeMs: number

  // Answers
  answers: Record<string, ChallengeAnswerDto>

  // Flagged questions
  flaggedQuestionIds: Set<string>

  // Leaderboard
  leaderboard: ChallengeLeaderboardDto | null

  // UI state
  isLoading: boolean
  error: string | null
}

// Results summary
export interface ChallengeResultsSummary {
  attemptId: string
  challengeTitle: string
  score: number
  correctAnswers: number
  totalQuestions: number
  accuracy: number
  completionTimeMs?: number
  rank?: number
}
