/**
 * Game Player Feature Export
 * 
 * Player-side real-time quiz game experience.
 * Follows feature-based architecture pattern.
 */

// ============= Types =============
export * from './types'

// ============= Hooks =============
export { usePlayerSession } from './hooks/use-player-session'
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
  selectPlayerAnswerResult,
  selectPlayerSelectedAnswers,
  selectPlayerHasAnswered,
  selectPlayerLeaderboard,
  selectPlayerTotalPoints,
  selectPlayerCurrentRank,
  selectPlayerError,
  selectPlayerIsConnected,
  selectPlayerActions,
} from './store/player-game.store'

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

