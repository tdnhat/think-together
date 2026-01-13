/**
 * usePlayerGame Hook (v2)
 *
 * Main hook for player game functionality.
 * Handles SignalR connection, joining, and gameplay.
 */

'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { gameSignalR, type SignalREvents } from '@/features/game-host/services/signalr.service'
import { gameSessionService } from '@/features/game-host/api/game-session.service'
import {
  usePlayerGameStore,
  selectPlayerPhase,
  selectPlayerCurrentQuestion,
  selectPlayerSelectedAnswers,
  selectPlayerHasAnswered,
  selectPlayerLeaderboard,
  selectPlayerTotalPoints,
  selectPlayerCurrentRank,
  selectPlayerTotalQuestions,
  selectPlayerConnectionState,
  selectPlayerError,
  selectPlayerActions,
} from '../store/player-game-store'
import { toastError, toastSuccess, toastInfo } from '@/lib/utils/toast'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { savePlayerSession, clearPlayerSession } from '../lib/player-session-storage'

// =============================================================================
// TYPES
// =============================================================================

export interface UsePlayerGameOptions {
  /** Required: PIN to join */
  pin: string
  /** Required: Player ID (from join response) */
  playerId: string
  /** Required: Player nickname */
  nickname: string
  /** Required: Session ID */
  sessionId: string
}

export interface UsePlayerGameReturn {
  // State
  phase: ReturnType<typeof selectPlayerPhase>
  currentQuestion: ReturnType<typeof selectPlayerCurrentQuestion>
  selectedAnswers: number[]
  hasAnswered: boolean
  leaderboard: ReturnType<typeof selectPlayerLeaderboard>
  totalPoints: number
  currentRank: number | null
  totalQuestions: number
  connectionState: ReturnType<typeof selectPlayerConnectionState>
  error: string | null

  // Loading states
  isSubmitting: boolean

  // Actions
  selectAnswer: (index: number) => void
  submitAnswer: () => Promise<void>
}

// =============================================================================
// HOOK
// =============================================================================

export function usePlayerGame(options: UsePlayerGameOptions): UsePlayerGameReturn {
  const { pin, playerId, nickname, sessionId } = options

  // Refs
  const isInitializedRef = useRef(false)
  const isJoiningRef = useRef(false)

  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Store selectors
  const phase = usePlayerGameStore(selectPlayerPhase)
  const currentQuestion = usePlayerGameStore(selectPlayerCurrentQuestion)
  const selectedAnswers = usePlayerGameStore(selectPlayerSelectedAnswers)
  const hasAnswered = usePlayerGameStore(selectPlayerHasAnswered)
  const leaderboard = usePlayerGameStore(selectPlayerLeaderboard)
  const totalPoints = usePlayerGameStore(selectPlayerTotalPoints)
  const currentRank = usePlayerGameStore(selectPlayerCurrentRank)
  const totalQuestions = usePlayerGameStore(selectPlayerTotalQuestions)
  const connectionState = usePlayerGameStore(selectPlayerConnectionState)
  const error = usePlayerGameStore(selectPlayerError)
  const actions = usePlayerGameStore(selectPlayerActions)

  // =============================================================================
  // SIGNALR EVENT HANDLERS
  // =============================================================================

  const setupSignalREvents = useCallback((): SignalREvents => ({
    onStateChange: (state) => {
      console.log('[Player] Connection state:', state)
      actions.setConnectionState(state)
    },
    onGameStarted: (event) => {
      console.log('[Player] Game started:', event.totalQuestions, 'questions')
      actions.handleGameStarted({ totalQuestions: event.totalQuestions })
      toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.GAME_STARTED)
    },
    onQuestionStarted: (event) => {
      console.log('[Player] Question started:', event.positionInGame, '/', event.totalQuestions)
      actions.handleQuestionStarted(event)
    },
    onQuestionEnded: (event) => {
      console.log('[Player] Question ended')
      actions.handleQuestionEnded(event)
    },
    onLeaderboardUpdated: (event) => {
      console.log('[Player] Leaderboard updated')
      actions.handleLeaderboardUpdated(event)
    },
    onGameEnded: (event) => {
      console.log('[Player] Game ended')
      actions.handleGameEnded(event)
      toastInfo(GAME_PLAYER_CONSTANTS.MESSAGES.GAME_ENDED)
    },
    onStateSynced: (event) => {
      console.log('[Player] State synced from server:', event.status)
      // Full state sync after reconnect
      if (event.currentQuestion) {
        actions.handleQuestionStarted(event.currentQuestion)
      }
      if (event.leaderboard?.length > 0) {
        actions.handleLeaderboardUpdated({ leaderboard: event.leaderboard })
      }
    },
    onError: (event) => {
      console.error('[Player] SignalR error:', event)

      // Handle cases where event might be malformed
      if (!event || typeof event !== 'object') {
        console.error('[Player] Invalid error event format:', event)
        const errorMessage = 'An unknown connection error occurred'
        actions.setError(errorMessage)
        toastError(errorMessage)
        return
      }

      // Handle reconnect failure specially
      if ('code' in event && event.code === 'RECONNECT_FAILED') {
        console.log('[Player] Reconnect failed, will try joining as new player')
        // Don't show error - we'll handle it in the connection logic
        return
      }

      // Extract error message safely
      const errorMessage = 'message' in event && typeof event.message === 'string'
        ? event.message
        : 'An unknown SignalR error occurred'

      actions.setError(errorMessage)
      toastError(errorMessage)
    },
  }), [actions])

  // =============================================================================
  // CONNECTION & JOIN
  // =============================================================================

  const joinGame = useCallback(async () => {
    if (isJoiningRef.current) return
    isJoiningRef.current = true

    try {
      // Service will ensure connection before invoking
      await gameSignalR.joinGame(pin, nickname)
      console.log('[Player] Joined game successfully')

      // Save session to localStorage for reconnect
      savePlayerSession({
        pin,
        playerId,
        nickname,
        sessionId,
        joinedAt: new Date().toISOString(),
      })

      actions.setPhase('lobby')
    } catch (err) {
      console.error('[Player] Failed to join game:', err)
      throw err
    } finally {
      isJoiningRef.current = false
    }
  }, [pin, playerId, nickname, sessionId, actions])

  const connectAndJoin = useCallback(async () => {
    console.log('[Player] Initializing connection...')

    try {
      // First, set up event handlers by connecting
      // The service will establish connection if not already connected
      await gameSignalR.connect(setupSignalREvents())
      console.log('[Player] SignalR connection ready')

      // Try reconnect first (in case returning player)
      try {
        console.log('[Player] Attempting reconnect...')
        await gameSignalR.reconnect(pin, playerId)
        console.log('[Player] Reconnected successfully')

        // Reconnected - sync state from API
        const syncResponse = await gameSessionService.syncGameSession(sessionId, playerId)
        const syncData = syncResponse

        if (syncData.status === 'IN_PROGRESS' && syncData.currentQuestion) {
          // Game in progress - update question
          actions.handleQuestionStarted({
            gameQuestionId: syncData.currentQuestion.gameQuestionId,
            questionId: syncData.currentQuestion.id,
            content: syncData.currentQuestion.content,
            questionType: syncData.currentQuestion.questionType,
            timeLimit: syncData.currentQuestion.totalTimeSeconds,
            endTime: syncData.currentQuestion.endTime,
            positionInGame: syncData.currentQuestion.positionInGame,
            totalQuestions: syncData.totalQuestions,
            videoUrl: syncData.currentQuestion.videoUrl,
            videoTimestamp: syncData.currentQuestion.videoTimestamp,
            options: syncData.currentQuestion.options,
          })
        } else if (syncData.status === 'FINISHED') {
          actions.setPhase('ended')
        } else {
          actions.setPhase('lobby')
        }

        toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.RECONNECTED)
      } catch (reconnectErr) {
        // Reconnect failed - try joining as new player
        console.log('[Player] Reconnect failed, joining as new player...', reconnectErr)
        await joinGame()
        toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.JOINED)
      }
    } catch (err) {
      console.error('[Player] Connection error:', err)
      const message = err instanceof Error ? err.message : GAME_PLAYER_CONSTANTS.ERRORS.CONNECTION_FAILED
      actions.setError(message)
      toastError(message)
    }
  }, [pin, playerId, sessionId, setupSignalREvents, joinGame, actions])

  // =============================================================================
  // ANSWER SUBMISSION
  // =============================================================================

  const selectAnswer = useCallback((index: number) => {
    if (!hasAnswered) {
      actions.selectAnswer(index)
    }
  }, [hasAnswered, actions])

  const submitAnswer = useCallback(async () => {
    if (!currentQuestion || selectedAnswers.length === 0 || hasAnswered) {
      return
    }

    setIsSubmitting(true)
    actions.setHasAnswered(true)

    try {
      const responseTimeMs = actions.getResponseTimeMs()

      await gameSignalR.submitAnswer(
        sessionId,
        playerId,
        currentQuestion.gameQuestionId,
        selectedAnswers,
        responseTimeMs
      )

      console.log('[Player] Answer submitted')
      toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.SUBMITTED)
      actions.setPhase('answered')
    } catch (err) {
      console.error('[Player] Submit answer error:', err)
      const message = err instanceof Error ? err.message : GAME_PLAYER_CONSTANTS.ERRORS.SUBMIT_FAILED
      toastError(message)
      actions.setHasAnswered(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [currentQuestion, selectedAnswers, hasAnswered, sessionId, playerId, actions])

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    console.log('[Player] Initializing with:', { pin, playerId, nickname, sessionId })

    // Store player info
    actions.setPlayerInfo({ pin, playerId, nickname, sessionId })
    actions.setPhase('lobby')

    // Connect and join
    connectAndJoin()

    return () => {
      // Cleanup on unmount
      gameSignalR.disconnect()
    }
  }, [pin, playerId, nickname, sessionId, actions, connectAndJoin])

  // Update SignalR events when callbacks change
  useEffect(() => {
    if (gameSignalR.isConnected()) {
      gameSignalR.updateEvents(setupSignalREvents())
    }
  }, [setupSignalREvents])

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && connectionState === 'disconnected') {
        console.log('[Player] Tab became visible, attempting reconnect...')
        connectAndJoin()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [connectionState, connectAndJoin])

  // Cleanup session on game end
  useEffect(() => {
    if (phase === 'ended') {
      clearPlayerSession()
    }
  }, [phase])

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // State
    phase,
    currentQuestion,
    selectedAnswers,
    hasAnswered,
    leaderboard,
    totalPoints,
    currentRank,
    totalQuestions,
    connectionState,
    error,

    // Loading
    isSubmitting,

    // Actions
    selectAnswer,
    submitAnswer,
  }
}
