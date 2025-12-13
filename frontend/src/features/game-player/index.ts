/**
 * Game Player Feature Export
 * 
 * Player-side real-time quiz game experience.
 * Follows feature-based architecture pattern.
 */

// ============= Types =============
export * from './types'

// ============= Hooks =============
export { usePlayerGame } from './hooks/use-player-game'
export type { UsePlayerGameOptions, UsePlayerGameReturn } from './hooks/use-player-game'
export { useJoinGame } from './hooks/use-join-game'

// ============= Store & Selectors =============
export {
  usePlayerGameStore,
  selectPlayerPhase,
  selectPlayerPin,
  selectPlayerPlayerId,
  selectPlayerNickname,
  selectPlayerSessionId,
  selectPlayerCurrentQuestion,
  selectPlayerSelectedAnswers,
  selectPlayerHasAnswered,
  selectPlayerLeaderboard,
  selectPlayerTotalPoints,
  selectPlayerCurrentRank,
  selectPlayerTotalQuestions,
  selectPlayerConnectionState,
  selectPlayerError,
  selectPlayerIsConnected,
  selectPlayerActions,
} from './store/player-game-store'
// Types from store are available via './types' re-export or direct import

// ============= Components =============
export {
  JoinForm,
  PlayerWaiting,
  PlayerQuestion,
  PlayerAnswerResult,
  PlayerFinalResult,
  PlayerGameScreen,
  PlayerPageLoading,
  PlayerPageError,
  PlayerPageHeader,
} from './components'

// ============= Constants =============
export { GAME_PLAYER_CONSTANTS } from './constants'

