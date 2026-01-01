// API Response Types

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface QuizSetQueryParams {
  search?: string
  sortBy?: 'newest' | 'oldest' | 'title' | 'questions'
  filterBy?: 'all' | 'published' | 'draft'
  page?: number
  pageSize?: number
}

export interface QuestionQueryParams {
  search?: string
  filterBy?: 'all' | string // QuestionType enum value
  sortBy?: 'order' | 'createdAt' | 'type'
  page?: number
  pageSize?: number
}

// ProblemDetails format from backend (RFC 7807)
export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  errors?: Record<string, string[]>
}

// Validation error response structure
export interface ValidationErrorResponse {
  errors: Record<string, string[]>
}

// User Role enum
export type UserRole = 'User' | 'Creator' | 'Administrator'

// Backend DTOs
export interface AuthTokenDto {
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isEmailVerified: boolean
  isActive: boolean
  avatarUrl?: string | null
  bio?: string | null
  createdAt?: string | null
}

export interface GetUsersRequest {
  search?: string
  role?: UserRole
  sortBy?: 'newest' | 'oldest' | 'name' | 'email'
  page?: number
  pageSize?: number
}

export interface UpdateUserRequest {
  id: string
  firstName: string
  lastName: string
  role: UserRole
  bio?: string
}

// Request DTOs
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface ConfirmEmailRequest {
  token: string
}

export interface ResendEmailConfirmationRequest {
  email: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

// Category DTOs
export interface CategoryDto {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  isActive?: boolean
}

export interface UpdateCategoryRequest {
  id: string
  name?: string
  description?: string
  isActive?: boolean
}

// Quiz Set DTOs
export interface QuizSetDto {
  id: string
  title: string
  description?: string
  coverImageUrl?: string
  categoryId?: string
  categoryName?: string
  isPublished: boolean
  questionCount?: number
  createdAt: string
  updatedAt: string
  creatorId: string
  creatorName?: string
}

export interface CreateQuizSetRequest {
  title: string
  description?: string
  coverImageUrl?: string
  categoryId?: string
}

export interface UpdateQuizSetRequest {
  id: string
  title: string
  description?: string
  coverImageUrl?: string
  categoryId?: string
}

export interface PublishQuizSetRequest {
  id: string
}

// Question Types
export enum QuestionType {
  SINGLE_CHOICE = 'SingleChoice',
  TRUE_FALSE = 'TrueFalse',
  MULTIPLE_CHOICE = 'MultipleChoice',
  MATCHING = 'Matching',
  ORDERING = 'Ordering',
  VIDEO = 'Video',
  AUDIO = 'Audio'
}

// Question Option (for Multiple Choice, Single Choice, True/False)
export interface QuestionOptionDto {
  id: string
  content: string
  isCorrect: boolean
  displayOrder: number
  imageUrl?: string
}

// Matching Pair (for Matching questions)
export interface MatchingPairDto {
  id: string
  leftContent: string
  rightContent: string
  displayOrder: number
}

// Ordering Item (for Ordering questions)
export interface OrderingItemDto {
  id: string
  content: string
  correctPosition: number
}

// Question DTO
export interface QuestionDto {
  id: string
  quizSetId: string
  content: string
  type: QuestionType
  timeLimit: number
  displayOrder: number
  createdAt: string
  updatedAt?: string

  // Type-specific data
  options?: QuestionOptionDto[]
  matchingPairs?: MatchingPairDto[]
  orderingItems?: OrderingItemDto[]
  videoUrl?: string
  videoTimestamp?: number
  audioUrl?: string
  audioTimestamp?: number
}

// Create Question Request
export interface CreateQuestionRequest {
  quizSetId: string
  content: string
  type: QuestionType
  timeLimit: number
  displayOrder?: number

  // Type-specific data
  options?: Omit<QuestionOptionDto, 'id'>[]
  matchingPairs?: Omit<MatchingPairDto, 'id'>[]
  orderingItems?: Omit<OrderingItemDto, 'id'>[]
  videoUrl?: string
  videoTimestamp?: number
  audioUrl?: string
  audioTimestamp?: number
}

// Update Question Request
export interface UpdateQuestionRequest {
  id: string
  content?: string
  timeLimit?: number
  displayOrder?: number

  // Type-specific data
  options?: QuestionOptionDto[]
  matchingPairs?: MatchingPairDto[]
  orderingItems?: OrderingItemDto[]
  videoUrl?: string
  videoTimestamp?: number
  audioUrl?: string
  audioTimestamp?: number
}

// Reorder Questions Request
export interface ReorderQuestionsRequest {
  quizSetId: string
  questionOrders: Array<{ id: string; displayOrder: number }>
}

export interface ChartDataDto {
  label: string
  value: number
}

export interface CategoryDistributionDto {
  name: string
  value: number
}

export interface DashboardCountsDto {
  totalQuizzes: number
  newQuizzesToday: number
  totalUsers: number
  newUsersToday: number
  totalCategories: number
  activeUsersToday: number
}

export interface DashboardChartsDto {
  quizTrends: ChartDataDto[]
  userTrends: ChartDataDto[]
  categoryDistribution: CategoryDistributionDto[]
}
