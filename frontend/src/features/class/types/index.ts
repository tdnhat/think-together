/**
 * Class Feature Types
 * Type definitions for class-related data structures
 */

// Class DTO
export interface ClassDto {
  id: string
  teacherId: string
  teacherName?: string
  name: string
  description?: string
  joinCode: string
  coverImageUrl?: string
  memberCount?: number
  homeworkCount?: number
  createdAt: string
  updatedAt?: string
}

// Class Member DTO
export interface ClassMemberDto {
  id: string
  classId: string
  userId: string
  userName?: string
  userEmail?: string
  joinedAt: string
  leftAt?: string
}

// Homework DTO
export interface HomeworkDto {
  id: string
  classId: string
  quizSetId: string
  quizSetTitle?: string
  title: string
  dueDate?: string
  assignedAt: string
  submissionCount?: number
  isOverdue?: boolean
  hasSubmission?: boolean
  submissionId?: string
}

// Homework Submission DTO
export interface HomeworkSubmissionDto {
  id: string
  homeworkId: string
  studentId: string
  studentName?: string
  challengeAttemptId: string
  score: number
  submittedAt: string
  status: 'NotSubmitted' | 'Submitted' | 'Late'
}

// Class Query Parameters
export interface ClassQueryParams {
  search?: string
  page?: number
  pageSize?: number
}

// Homework Query Parameters
export interface HomeworkQueryParams {
  classId: string
  page?: number
  pageSize?: number
}

// Create Class Request
export interface CreateClassRequest {
  name: string
  description?: string
  coverImageUrl?: string
}

// Update Class Request
export interface UpdateClassRequest {
  name?: string
  description?: string
  coverImageUrl?: string
}

// Join Class Request
export interface JoinClassRequest {
  joinCode: string
}

// Create Homework Request
export interface CreateHomeworkRequest {
  classId: string
  quizSetId: string
  title: string
  dueDate?: string
}

// Update Homework Request
export interface UpdateHomeworkRequest {
  title?: string
  dueDate?: string
}

// Class Response DTO
export interface ClassResponseDto {
  data: ClassDto[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Homework Response DTO
export interface HomeworkResponseDto {
  data: HomeworkDto[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Class Detail DTO (includes members and homeworks)
export interface ClassDetailDto extends ClassDto {
  members: ClassMemberDto[]
  homeworks: HomeworkDto[]
}

// Homework Detail DTO (includes submissions)
export interface HomeworkDetailDto extends HomeworkDto {
  submissions: HomeworkSubmissionDto[]
}

// Homework Submission Question DTO (extends QuestionDto with student answer)
export interface HomeworkSubmissionQuestionDto {
  id: string
  quizSetId: string
  content: string
  type: import('@/types/api').QuestionType
  timeLimit: number
  displayOrder: number
  createdAt: string
  updatedAt?: string

  // Type-specific data
  options?: import('@/types/api').QuestionOptionDto[]
  matchingPairs?: import('@/types/api').MatchingPairDto[]
  orderingItems?: import('@/types/api').OrderingItemDto[]
  videoUrl?: string
  videoTimestamp?: number
  audioUrl?: string
  audioTimestamp?: number

  // Student's answer
  studentAnswer?: StudentAnswerDto
}

// Student Answer DTO for homework submissions
export interface StudentAnswerDto {
  answerId: string
  isCorrect: boolean
  pointsEarned: number
  submissionTimeMs: number
  selectedOptionIndexes?: number[]
  matchingPairs?: import('@/features/challenge/types').AnswerMatchingPairDto[]
  orderingItems?: import('@/features/challenge/types').AnswerOrderingItemDto[]
}

// Homework Submission Attempt DTO (modified version with submission questions)
export interface HomeworkSubmissionAttemptDto {
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
  status: import('@/features/challenge/types').AttemptStatus
  timeLimitMs?: number
  remainingTimeMs?: number
  questions: HomeworkSubmissionQuestionDto[]
}

// Homework Submission Detail DTO (includes challenge attempt with questions and answers)
export interface HomeworkSubmissionDetailDto {
  submission: HomeworkSubmissionDto
  attempt: HomeworkSubmissionAttemptDto
  homework: HomeworkDto
}

// Per-question statistics for homework
export interface QuestionStatisticsDto {
  questionId: string
  questionContent: string
  displayOrder: number
  correctAnswerCount: number
  wrongAnswerCount: number
  correctPercentage: number
  totalAnswers: number
}

// Homework Statistics DTO (for teachers)
export interface HomeworkStatisticsDto {
  homework: HomeworkDto
  totalStudents: number
  submittedCount: number
  notSubmittedCount: number
  completionRate: number
  averageScore: number
  highestScore: number
  lowestScore: number
  questionStatistics: QuestionStatisticsDto[]
  studentSubmissions: HomeworkSubmissionDto[]
}
