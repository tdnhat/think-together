// Game Feature Public API
// 
// NOTE: This feature has been replaced by game-host and game-player features.
// This file is kept for backward compatibility but exports nothing.
// Use @/features/game-host or @/features/game-player instead.

// Re-export from game-host for convenience
export { gameSessionService } from '../game-host/api/game-session.service'
export type {
  GameSession,
  GameQuestion,
  LeaderboardEntry,
  GameStatus,
  QuestionType,
} from '../game-host/types'

// ============= Constants =============
export { GAME_CONSTANTS } from './constants'
