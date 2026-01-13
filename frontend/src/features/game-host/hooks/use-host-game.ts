/**
 * useHostGame Hook (v2)
 *
 * Main hook for host game functionality.
 * Combines SignalR connection, API calls, and store updates.
 */

'use client'

import { useEffect, useCallback, useRef } from 'react'
import { gameSignalR, type SignalREvents } from '../services/signalr.service'
import { gameSessionService } from '../api/game-session.service'
import {
  useHostGameStore,
  selectHostSession,
  selectHostPhase,
  selectHostCurrentQuestion,
  selectHostLeaderboard,
  selectHostAnsweredCount,
  selectHostTotalPlayers,
  selectHostConnectionState,
  selectHostIsLoading,
  selectHostIsStarting,
  selectHostIsLoadingNext,
  selectHostError,
  selectHostActions,
} from '../store/host-game-store'
import { saveHostSession, clearStoredHostSession } from '../lib/session-storage'
import { toastError, toastSuccess, toastInfo } from '@/lib/utils/toast'
import { GAME_HOST_CONSTANTS } from '../constants'
import { GameStatus, type GameSession } from '../types'

// =============================================================================
// MODULE-LEVEL GUARDS (survive React lifecycle)
// =============================================================================

// Track active operations to prevent duplicates across React remounts
const activeOperations = {
  resumingSessionId: null as string | null,
  creatingForQuizId: null as string | null,
}

// =============================================================================
// TYPES
// =============================================================================

export interface UseHostGameOptions {
  /** Quiz ID for creating new sessions */
  quizId?: string
  /** Session ID for resuming existing sessions */
  sessionId?: string
}

export interface UseHostGameReturn {
  // State
  session: GameSession | null
  phase: ReturnType<typeof selectHostPhase>
  currentQuestion: ReturnType<typeof selectHostCurrentQuestion>
  leaderboard: ReturnType<typeof selectHostLeaderboard>
  answeredCount: number
  totalPlayers: number
  connectionState: ReturnType<typeof selectHostConnectionState>
  error: string | null

  // Loading states
  isLoading: boolean
  isStarting: boolean
  isLoadingNext: boolean

  // Actions
  createSession: () => Promise<void>
  resumeSession: (sessionId: string) => Promise<void>
  startGame: () => Promise<void>
  nextQuestion: () => Promise<void>
  showLeaderboard: () => void
  endGame: () => Promise<void>
  abandonSession: () => Promise<void>
  reset: () => void
}

// =============================================================================
// HOOK
// =============================================================================

export function useHostGame(options: UseHostGameOptions = {}): UseHostGameReturn {
  const { quizId, sessionId } = options

  // Refs for connection tracking
  const connectingSessionIdRef = useRef<string | null>(null)
  const isConnectingRef = useRef(false)

  // Store selectors
  const session = useHostGameStore(selectHostSession)
  const phase = useHostGameStore(selectHostPhase)
  const currentQuestion = useHostGameStore(selectHostCurrentQuestion)
  const leaderboard = useHostGameStore(selectHostLeaderboard)
  const answeredCount = useHostGameStore(selectHostAnsweredCount)
  const totalPlayers = useHostGameStore(selectHostTotalPlayers)
  const connectionState = useHostGameStore(selectHostConnectionState)
  const isLoading = useHostGameStore(selectHostIsLoading)
  const isStarting = useHostGameStore(selectHostIsStarting)
  const isLoadingNext = useHostGameStore(selectHostIsLoadingNext)
  const error = useHostGameStore(selectHostError)
  const actions = useHostGameStore(selectHostActions)

  // =============================================================================
  // SIGNALR EVENT HANDLERS
  // =============================================================================

  const setupSignalREvents = useCallback((): SignalREvents => ({
    onStateChange: (state) => {
      actions.setConnectionState(state)
    },
    onPlayerJoined: (event) => {
      actions.handlePlayerJoined(event)
    },
    onPlayerLeft: (event) => {
      actions.handlePlayerLeft(event)
    },
    onPlayerDisconnected: (event) => {
      // Player temporarily disconnected - can still reconnect
      toastInfo(`${event.nickname} đã mất kết nối`)
    },
    onPlayerReconnected: (event) => {
      // Player reconnected
      toastSuccess(`${event.nickname} đã kết nối lại`)
    },
    onGameStarted: (event) => {
      actions.handleGameStarted(event)
    },
    onQuestionStarted: (event) => {
      actions.handleQuestionStarted(event)
    },
    onQuestionEnded: (event) => {
      actions.handleQuestionEnded(event)
    },
    onAnswerReceived: (event) => {
      actions.handleAnswerReceived(event)
    },
    onLeaderboardUpdated: (event) => {
      actions.handleLeaderboardUpdated(event)
    },
    onGameEnded: (event) => {
      actions.handleGameEnded(event)
      clearStoredHostSession()
    },
    onError: (event) => {
      actions.setError(event.message)
      toastError(event.message)
    },
  }), [actions])

  // =============================================================================
  // CONNECTION
  // =============================================================================

  const connectAndJoin = useCallback(async (gameSession: GameSession) => {
    // Prevent multiple simultaneous connection attempts for the same session
    if (isConnectingRef.current && connectingSessionIdRef.current === gameSession.id) {
      return
    }

    // If already connected to this session, skip
    if (gameSignalR.isConnected() && connectingSessionIdRef.current === gameSession.id) {
      return
    }

    isConnectingRef.current = true
    connectingSessionIdRef.current = gameSession.id

    try {
      // Connect with event handlers
      await gameSignalR.connect(setupSignalREvents())

      // Join as host
      await gameSignalR.joinAsHost(gameSession.id, gameSession.pin)
    } catch (err) {
      const message = err instanceof Error ? err.message : GAME_HOST_CONSTANTS.ERRORS.CONNECTION_FAILED
      toastError(message)
      // Reset connection refs on error so we can retry
      isConnectingRef.current = false
      connectingSessionIdRef.current = null
      throw err
    } finally {
      // Only reset if we're still connecting to this session
      if (connectingSessionIdRef.current === gameSession.id) {
        isConnectingRef.current = false
      }
    }
  }, [setupSignalREvents])

  // =============================================================================
  // SESSION MANAGEMENT
  // =============================================================================

  const createSession = useCallback(async () => {
    if (!quizId) {
      toastError('Không có quiz ID')
      return
    }

    // Module-level guard (survives React remounts)
    if (activeOperations.creatingForQuizId === quizId) {
      return
    }

    // Set module-level guard IMMEDIATELY
    activeOperations.creatingForQuizId = quizId
    actions.setIsLoading(true)
    actions.setError(null)
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.CREATING_SESSION)

    try {
      // Abandon any existing session first
      await gameSessionService.abandonActiveSession().catch(() => { })

      const response = await gameSessionService.createSession({ quizSetId: quizId })

      const newSession = response as GameSession

      // Save to storage and store
      clearStoredHostSession()
      saveHostSession(newSession)
      actions.setSession(newSession)
      actions.setPhase('lobby')

      // Connect to SignalR
      await connectAndJoin(newSession)

      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.SESSION_CREATED)
    } catch (err) {
      const message = err instanceof Error ? err.message : GAME_HOST_CONSTANTS.ERRORS.CREATE_SESSION_FAILED
      actions.setError(message)
      toastError(message)
    } finally {
      activeOperations.creatingForQuizId = null
      actions.setIsLoading(false)
    }
  }, [quizId, actions, connectAndJoin])

  const resumeSession = useCallback(async (resumeSessionId: string) => {
    // Module-level guard (survives React remounts)
    if (activeOperations.resumingSessionId === resumeSessionId) {
      return
    }

    // Also check if store already has this session loaded
    const currentSession = useHostGameStore.getState().session
    if (currentSession?.id === resumeSessionId) {
      return
    }

    // Set module-level guard IMMEDIATELY before any async work
    activeOperations.resumingSessionId = resumeSessionId

    // Then update store state
    actions.setIsLoading(true)
    actions.setError(null)

    try {
      const response = await gameSessionService.getSessionById(resumeSessionId)

      const resumedSession = response

      // Check session status
      if (resumedSession.status === GameStatus.Ended) {
        clearStoredHostSession()
        throw new Error(GAME_HOST_CONSTANTS.ERRORS.GAME_ALREADY_ENDED)
      }

      // Save and update store
      saveHostSession(resumedSession)
      actions.setSession(resumedSession)

      // Determine phase based on status
      if (resumedSession.status === GameStatus.InProgress && resumedSession.currentQuestion) {
        actions.setCurrentQuestion(resumedSession.currentQuestion)
        actions.setPhase('question')
      } else {
        actions.setPhase('lobby')
      }

      // Connect to SignalR
      await connectAndJoin(resumedSession)
      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.SESSION_RESUMED)
    } catch (err) {
      const message = err instanceof Error ? err.message : GAME_HOST_CONSTANTS.ERRORS.RESUME_SESSION_FAILED
      actions.setError(message)
      toastError(message)
      clearStoredHostSession()
      // Reset guard on error so user can retry
      activeOperations.resumingSessionId = null
    } finally {
      actions.setIsLoading(false)
    }
  }, [actions, connectAndJoin])

  const abandonSession = useCallback(async () => {
    try {
      await gameSessionService.abandonActiveSession()
      clearStoredHostSession()
      actions.reset()
      toastInfo(GAME_HOST_CONSTANTS.MESSAGES.SESSION_ABANDONED)
    } catch {
      // Silently ignore - session might already be abandoned
    }
  }, [actions])

  // =============================================================================
  // GAME FLOW
  // =============================================================================

  const startGame = useCallback(async () => {
    if (!session) return

    actions.setIsStarting(true)
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.STARTING_GAME)

    try {
      const response = await gameSessionService.startGame(session.id)


      // Backend will send QuestionStarted via SignalR
      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_STARTED)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể bắt đầu trò chơi'
      actions.setError(message)
      toastError(message)
    } finally {
      actions.setIsStarting(false)
    }
  }, [session, actions])

  const showLeaderboard = useCallback(() => {
    actions.setPhase('leaderboard')

    // Fetch latest leaderboard
    if (session) {
      gameSessionService.getLeaderboard(session.id)
        .then(response => {
          actions.setLeaderboard(response)
        })
        .catch(() => { })
    }
  }, [session, actions])

  const nextQuestion = useCallback(async () => {
    if (!session) return

    actions.setIsLoadingNext(true)

    try {
      const response = await gameSessionService.nextQuestion(session.id)

      const { hasMoreQuestions, leaderboard: newLeaderboard } = response

      // Update leaderboard
      if (newLeaderboard) {
        actions.setLeaderboard(newLeaderboard)
      }

      if (!hasMoreQuestions) {
        // End game
        await endGame()
      } else {
        // Move to question phase - QuestionStarted will come via SignalR
        actions.setPhase('question')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể chuyển câu hỏi'
      toastError(message)
    } finally {
      actions.setIsLoadingNext(false)
    }
  }, [session, actions])

  const endGame = useCallback(async () => {
    if (!session) return

    try {
      const response = await gameSessionService.endGame(session.id)

      actions.handleGameEnded({
        gameSessionId: session.id,
        totalQuestions: response.totalQuestions,
        totalPlayers: response.totalPlayers,
        duration: response.duration,
        finalLeaderboard: response.finalLeaderboard.map(e => ({
          playerId: e.playerId,
          nickname: e.nickname,
          totalPoints: e.totalPoints,
          correctAnswers: e.correctAnswers,
          rank: e.rank,
        })),
      })
      clearStoredHostSession()
      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_ENDED)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể kết thúc trò chơi'
      toastError(message)
    }
  }, [session, actions])

  const reset = useCallback(() => {
    gameSignalR.disconnect()
    actions.reset()
    clearStoredHostSession()
    // Reset module-level guards
    activeOperations.resumingSessionId = null
    activeOperations.creatingForQuizId = null
    // Reset refs
    isConnectingRef.current = false
    connectingSessionIdRef.current = null
  }, [actions])

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  useEffect(() => {
    // Auto-resume if sessionId provided
    // The module-level guard in resumeSession prevents duplicate calls
    if (sessionId) {
      // Check if already resuming this session (module-level check)
      if (activeOperations.resumingSessionId === sessionId) {
        return
      }

      // Check if session already loaded in store
      const currentSession = useHostGameStore.getState().session
      if (currentSession?.id === sessionId) {
        return
      }

      resumeSession(sessionId).catch(() => { })
    }

    return () => {
      // Cleanup on unmount - disconnect SignalR
      gameSignalR.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]) // Only depend on sessionId

  // Update SignalR events when callbacks change
  // Only update if connected and not currently connecting
  useEffect(() => {
    if (gameSignalR.isConnected() && !isConnectingRef.current) {
      gameSignalR.updateEvents(setupSignalREvents())
    }
  }, [setupSignalREvents])

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // State
    session,
    phase,
    currentQuestion,
    leaderboard,
    answeredCount,
    totalPlayers,
    connectionState,
    error,

    // Loading states
    isLoading,
    isStarting,
    isLoadingNext,

    // Actions
    createSession,
    resumeSession,
    startGame,
    nextQuestion,
    showLeaderboard,
    endGame,
    abandonSession,
    reset,
  }
}
