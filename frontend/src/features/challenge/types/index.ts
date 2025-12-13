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

// Challenge Attempt DTO (from backend)
export interface ChallengeAttemptDto {
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
  currentQuestionIndex: number
  status: AttemptStatus
  timeLimitMs?: number
  remainingTimeMs?: number
  questions: ChallengeQuestionDto[]
  flaggedQuestionIds: string[]
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
}

export interface SubmitAnswerRequest {
  challengeId: string
  attemptId: string
  questionId: string
  selectedOptionIndexes?: number[]
  matchingPairs?: Array<{ leftIndex: number; rightIndex: number }>
  orderingItems?: Array<{ itemId: string; position: number }>
  submissionTimeMs: number
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

