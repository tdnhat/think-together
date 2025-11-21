// Game Feature Public API

// Store
export {
  useGameStore,
  selectSession,
  selectIsHost,
  selectCurrentQuestion,
  selectLeaderboard,
  selectTimeRemaining,
  selectIsConnected,
  selectGameActions,
} from './store/game.store'

// API Service
export { gameService } from './api/game.service'

// Types
export type {
  Player,
  Question,
  GameSession,
  GameState,
  PlayerAnswer,
  GameResult,
} from './types'

