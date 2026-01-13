/**
 * Game Host Feature Types
 * 
 * Types aligned with backend API for real-time quiz hosting.
 * Based on FRONTEND_INTEGRATION_GUIDE_QUIZ_HOST.md
 */

// =============================================================================
// ENUMS
// =============================================================================

export enum GameStatus {
  Waiting = 'Waiting',
  InProgress = 'InProgress',
  Ended = 'Ended'
}

export enum ConnectionStatus {
  Connected = 1,
  Disconnected = 2
}

export enum QuestionType {
  SingleChoice = 1,
  MultipleChoice = 2,
  TrueFalse = 3,
  Matching = 4,
  Ordering = 5
}

// =============================================================================
// CORE INTERFACES
// =============================================================================

export interface GamePlayer {
  id: string
  nickname: string
  connectionStatus: ConnectionStatus
  totalPoints: number
  rank: number | null
}

export interface QuestionOption {
  index: number
  content: string
  imageUrl: string | null
}

export interface GameQuestion {
  id: string
  gameQuestionId: string
  content: string
  type: QuestionType
  timeLimit: number
  positionInGame: number
  videoUrl: string | null
  videoTimestamp: number | null
  options: QuestionOption[]
}

export interface GameSession {
  id: string
  hostUserId: string
  quizSetId: string
  pin: string
  status: GameStatus
  currentQuestionIndex: number
  totalQuestions: number
  currentQuestion: GameQuestion | null
  startedAt: string | null
  endedAt: string | null
  players: GamePlayer[]
}

export interface LeaderboardEntry {
  playerId: string
  nickname: string
  totalPoints: number
  correctAnswers: number
  rank: number
  accuracyPercentage: number
  totalTimeSpentMs?: number
}

export interface AnswerResult {
  isCorrect: boolean
  pointsEarned: number
  totalPoints: number
  currentRank: number
  responseTimeMs: number
}

// =============================================================================
// API REQUEST TYPES
// =============================================================================

export interface CreateGameSessionRequest {
  quizSetId: string
}

export interface JoinGameSessionRequest {
  pin: string
  nickname: string
}

export interface ReconnectRequest {
  pin: string
  playerId: string
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface CreateGameSessionResponse {
  id: string
  hostUserId: string
  quizSetId: string
  pin: string
  status: GameStatus
  currentQuestionIndex: number
  totalQuestions: number
  startedAt: string | null
  endedAt: string | null
  players: GamePlayer[]
  currentQuestion: GameQuestion | null
}

export interface JoinGameSessionResponse {
  playerId: string
  nickname: string
  pin: string
}

export interface StartGameResponse {
  id: string
  gameQuestionId: string
  content: string
  type: QuestionType
  timeLimit: number
  positionInGame: number
  videoUrl: string | null
  videoTimestamp: number | null
  options: QuestionOption[]
}

export interface NextQuestionResponse {
  hasMoreQuestions: boolean
  question: GameQuestion | null
  leaderboard: LeaderboardEntry[]
}

export interface EndGameResponse {
  gameSessionId: string
  totalQuestions: number
  totalPlayers: number
  startedAt: string
  endedAt: string
  duration: string
  finalLeaderboard: LeaderboardEntry[]
}

export interface ReconnectResponse {
  success: boolean
  gameSession: GameSession
  player: GamePlayer
  currentQuestion: GameQuestion | null
  leaderboard: LeaderboardEntry[]
}

// =============================================================================
// SIGNALR MESSAGE TYPES
// =============================================================================

export interface PlayerJoinedMessage {
  playerId: string
  nickname: string
  totalPlayers: number
}

export interface PlayerLeftMessage {
  playerId: string
  nickname: string
  totalPlayers: number
}

export interface LobbyUpdatedMessage {
  players: Array<{ id: string; nickname: string }>
}

export interface GameStartedMessage {
  gameSessionId: string
  totalQuestions: number
  totalPlayers: number
}

export interface QuestionOptionInfo {
  index: number
  content: string
  imageUrl: string | null
}

export interface MatchingItemInfo {
  id: number
  content: string
}

export interface OrderingItemInfo {
  id: number
  content: string
}

export interface QuestionStartedMessage {
  gameQuestionId: string
  questionId: string
  content: string
  questionType: string
  timeLimit: number
  endTime: string // Absolute UTC end time for time synchronization
  positionInGame: number
  totalQuestions: number
  videoUrl: string | null
  videoTimestamp: number | null
  audioUrl: string | null
  audioTimestamp: number | null
  options: QuestionOptionInfo[]
  matchingLeft: MatchingItemInfo[]
  matchingRight: MatchingItemInfo[]
  orderingItems: OrderingItemInfo[]
}

export interface QuestionEndedMessage {
  gameQuestionId: string
  correctOptionIndexes: number[]
  correctAnswerCount: number
  wrongAnswerCount: number
  topPlayers: LeaderboardEntry[]
}

export interface AnswerReceivedMessage {
  playerId: string
  answeredCount: number
  totalPlayers: number
}

export interface LeaderboardUpdatedMessage {
  leaderboard: LeaderboardEntry[]
}

export interface GameEndedMessage {
  gameSessionId: string
  totalQuestions: number
  totalPlayers: number
  duration: string
  finalLeaderboard: LeaderboardEntry[]
}

export interface ErrorMessage {
  code: string
  message: string
}

// =============================================================================
// GAME STATE TYPES
// =============================================================================

export type GamePhase =
  | 'idle'
  | 'creating'
  | 'lobby'
  | 'starting'
  | 'question'
  | 'question-result'
  | 'leaderboard'
  | 'ended'
  | 'error'

export interface HostGameState {
  phase: GamePhase
  session: GameSession | null
  currentQuestion: GameQuestion | null
  questionResult: QuestionEndedMessage | null
  leaderboard: LeaderboardEntry[]
  answeredCount: number
  error: string | null
  isConnected: boolean
}

export interface PlayerGameState {
  phase: GamePhase
  session: GameSession | null
  playerId: string | null
  nickname: string | null
  currentQuestion: QuestionStartedMessage | null
  answerResult: AnswerResult | null
  leaderboard: LeaderboardEntry[]
  totalPoints: number
  currentRank: number | null
  error: string | null
  isConnected: boolean
  hasAnswered: boolean
}

// =============================================================================
// LOCAL STORAGE TYPES
// =============================================================================

export interface StoredPlayerSession {
  pin: string
  playerId: string
  nickname: string
  timestamp: number
}

// =============================================================================
// SYNC TYPES (State Recovery)
// =============================================================================

export type SyncGameStatus = 'LOBBY' | 'IN_PROGRESS' | 'FINISHED' | 'UNKNOWN'

export interface SyncCurrentQuestion {
  id: string
  gameQuestionId: string
  content: string
  questionType: string
  endTime: string // Absolute UTC end time
  totalTimeSeconds: number
  positionInGame: number
  videoUrl: string | null
  videoTimestamp: number | null
  audioUrl: string | null
  audioTimestamp: number | null
  options: QuestionOptionInfo[]
  matchingLeft: MatchingItemInfo[]
  matchingRight: MatchingItemInfo[]
  orderingItems: OrderingItemInfo[]
}

export interface SyncPlayer {
  id: string
  nickname: string
  score: number
}

export interface SyncGameSessionResult {
  status: SyncGameStatus
  currentQuestion: SyncCurrentQuestion | null
  players: SyncPlayer[]
  isHost: boolean
  currentQuestionIndex: number
  totalQuestions: number
}


