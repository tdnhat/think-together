/**
 * Game Player Feature Types
 * 
 * Types for player-side game experience.
 * Reuses types from game-host where applicable.
 */

export type {
  GameStatus,
  ConnectionStatus,
  QuestionType,
  GamePlayer,
  QuestionOption,
  GameQuestion,
  GameSession,
  LeaderboardEntry,
  AnswerResult,
  JoinGameSessionRequest,
  JoinGameSessionResponse,
  ReconnectRequest,
  ReconnectResponse,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  GameStartedMessage,
  QuestionStartedMessage,
  QuestionEndedMessage,
  LeaderboardUpdatedMessage,
  GameEndedMessage,
  ErrorMessage,
  StoredPlayerSession,
} from '@/features/game-host/types'

// Player-specific state
export interface PlayerGameState {
  phase: PlayerPhase
  pin: string | null
  playerId: string | null
  nickname: string | null
  sessionId: string | null
  currentQuestion: import('@/features/game-host/types').QuestionStartedMessage | null
  answerResult: import('@/features/game-host/types').AnswerResult | null
  selectedAnswers: number[]
  hasAnswered: boolean
  answerStartTime: number | null
  leaderboard: import('@/features/game-host/types').LeaderboardEntry[]
  totalPoints: number
  currentRank: number | null
  error: string | null
  isConnected: boolean
}

export type PlayerPhase = 
  | 'idle'
  | 'joining'
  | 'lobby'
  | 'starting'
  | 'question'
  | 'answered'
  | 'question-result'
  | 'leaderboard'
  | 'ended'
  | 'error'

