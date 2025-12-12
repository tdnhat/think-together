/**
 * Game Host Feature Export
 * 
 * Real-time quiz hosting feature for creators.
 * Follows feature-based architecture pattern.
 */

// ============= Types =============
export * from './types'

// ============= API Service =============
export { gameSessionService } from './api/game-session.service'

// ============= Hooks =============
export { useGameHub } from './hooks/use-game-hub'
export type { GameHubCallbacks, GameHubState, GameHubActions } from './hooks/use-game-hub'
export { useHostSession } from './hooks/use-host-session'

// ============= Store & Selectors =============
export { 
  useHostGameStore,
  selectHostPhase,
  selectHostSession,
  selectHostCurrentQuestion,
  selectHostQuestionResult,
  selectHostLeaderboard,
  selectHostAnsweredCount,
  selectHostError,
  selectHostIsConnected,
  selectHostActions,
} from './store/host-game.store'

// ============= Components =============
export {
  PinDisplay,
  PlayerList,
  QuestionDisplay,
  QuestionResult,
  Leaderboard,
  GameEnded,
  HostLobby,
  HostGameScreen,
  HostPageLoading,
  HostPageError,
  HostPageResumeOption,
  HostPageNoQuiz,
} from './components'

// ============= Constants =============
export { GAME_HOST_CONSTANTS } from './constants'

// ============= Utilities =============
export {
  saveHostSession,
  getStoredHostSession,
  clearStoredHostSession,
} from './lib/session-storage'
export type { StoredHostSession } from './lib/session-storage'

