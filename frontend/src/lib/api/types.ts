/**
 * API Types
 * 
 * Type definitions for API requests and responses.
 * Ensures type safety across all API calls.
 */

// ============================================================================
// COMMON TYPES
// ============================================================================



export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams extends Record<string, unknown> {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
}

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  acceptTerms: boolean;
}

export interface SignupResponse {
  user: User;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isCreator: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  bio?: string;
}

export enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  ADMIN = 'admin',
}

export interface UpdateProfileRequest {
  fullName?: string;
  bio?: string;
  avatar?: string;
}

export interface UserStats {
  totalQuizzes: number;
  totalGamesPlayed: number;
  totalGamesHosted: number;
  averageScore: number;
  totalPoints: number;
  rank: number;
}

// ============================================================================
// QUIZ TYPES
// ============================================================================

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  creatorId: string;
  creator?: User;
  isPublished: boolean;
  isFeatured: boolean;
  totalQuestions: number;
  totalPlays: number;
  averageScore: number;
  difficulty: QuizDifficulty;
  category?: string;
  tags: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export enum QuizDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  difficulty: QuizDifficulty;
  category?: string;
  tags?: string[];
  coverImage?: string;
}

export interface UpdateQuizRequest extends Partial<CreateQuizRequest> {
  isPublished?: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  order: number;
  timeLimit: number;
  points: number;
  answers: Answer[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  VIDEO = 'video',
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface CreateQuestionRequest {
  type: QuestionType;
  text: string;
  timeLimit: number;
  points: number;
  answers: Omit<Answer, 'id'>[];
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  explanation?: string;
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {
  order?: number;
}

export interface ReorderQuestionsRequest {
  questionIds: string[];
}

// ============================================================================
// GAME TYPES
// ============================================================================

export interface GameSession {
  id: string;
  pin: string;
  quizId: string;
  quiz?: Quiz;
  hostId: string;
  host?: User;
  state: GameState;
  currentQuestionIndex: number;
  totalPlayers: number;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export enum GameState {
  LOBBY = 'lobby',
  QUESTION = 'question',
  ANSWER = 'answer',
  LEADERBOARD = 'leaderboard',
  FINISHED = 'finished',
}

export interface CreateSessionRequest {
  quizId: string;
}

export interface CreateSessionResponse {
  session: GameSession;
  pin: string;
}

export interface JoinGameRequest {
  pin: string;
  playerName: string;
}

export interface JoinGameResponse {
  sessionId: string;
  playerId: string;
  playerName: string;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answerId: string;
  timeSpent: number;
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  points: number;
  correctAnswerId: string;
  explanation?: string;
}

export interface GamePlayer {
  id: string;
  sessionId: string;
  name: string;
  score: number;
  rank: number;
  correctAnswers: number;
  streak: number;
  joinedAt: string;
}

export interface Leaderboard {
  players: GamePlayer[];
  totalPlayers: number;
}

export interface GameResults {
  sessionId: string;
  quiz: Quiz;
  totalPlayers: number;
  leaderboard: GamePlayer[];
  questions: QuestionResult[];
  duration: number;
  completedAt: string;
}

export interface QuestionResult {
  question: Question;
  totalAnswers: number;
  correctAnswers: number;
  averageTime: number;
  answerDistribution: Record<string, number>;
}

// ============================================================================
// REPORT TYPES
// ============================================================================

export interface Report {
  id: string;
  sessionId: string;
  quizId: string;
  quiz?: Quiz;
  hostId: string;
  host?: User;
  totalPlayers: number;
  averageScore: number;
  completionRate: number;
  duration: number;
  createdAt: string;
}

export interface QuizAnalytics {
  quizId: string;
  totalPlays: number;
  totalPlayers: number;
  averageScore: number;
  averageCompletionTime: number;
  completionRate: number;
  questionAnalytics: QuestionAnalytics[];
  playerDemographics: Record<string, number>;
  playsByDate: Record<string, number>;
}

export interface QuestionAnalytics {
  questionId: string;
  question: Question;
  totalAnswers: number;
  correctAnswers: number;
  correctRate: number;
  averageTime: number;
  answerDistribution: Record<string, number>;
}

// ============================================================================
// UPLOAD TYPES
// ============================================================================

export interface UploadRequest {
  file: File;
  type: 'image' | 'video' | 'document';
}

export interface UploadResponse {
  fileId: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  GAME_INVITE = 'game_invite',
  QUIZ_PUBLISHED = 'quiz_published',
  NEW_FOLLOWER = 'new_follower',
  ACHIEVEMENT = 'achievement',
  SYSTEM = 'system',
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  gameInvites: boolean;
  quizUpdates: boolean;
  achievements: boolean;
  marketing: boolean;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface SystemStats {
  totalUsers: number;
  totalQuizzes: number;
  totalGames: number;
  activeUsers: number;
  newUsersToday: number;
  gamesPlayedToday: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  database: 'connected' | 'disconnected';
  cache: 'connected' | 'disconnected';
  storage: 'available' | 'unavailable';
  uptime: number;
  version: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}

