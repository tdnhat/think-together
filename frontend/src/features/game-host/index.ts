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

// ============= Session Storage =============
export { saveHostSession, getStoredHostSession, clearStoredHostSession } from './lib/session-storage'
export type { StoredHostSession } from './lib/session-storage'

// ============= SignalR Service =============
export { gameSignalR } from './services/signalr.service'
export type {
  SignalREvents,
  ConnectionState,
  PlayerJoinedEvent,
  PlayerLeftEvent,
  GameStartedEvent,
  QuestionStartedEvent,
  QuestionEndedEvent,
  AnswerReceivedEvent,
  LeaderboardUpdatedEvent,
  GameEndedEvent,
  ErrorEvent,
} from './services/signalr.service'

// ============= Hooks =============
export { useHostGame } from './hooks/use-host-game'
export type { UseHostGameOptions, UseHostGameReturn } from './hooks/use-host-game'

// ============= Store & Selectors =============
export { 
  useHostGameStore,
  selectHostPhase,
  selectHostSession,
  selectHostCurrentQuestion,
  selectHostQuestionResult,
  selectHostLeaderboard,
  selectHostAnsweredCount,
  selectHostTotalPlayers,
  selectHostConnectionState,
  selectHostError,
  selectHostIsConnected,
  selectHostActions,
} from './store/host-game-store'
export type { HostPhase, HostGameState } from './store/host-game-store'

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

