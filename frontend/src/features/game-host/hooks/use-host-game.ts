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
  selectHostQuestionResult,
  selectHostLeaderboard,
  selectHostAnsweredCount,
  selectHostTotalPlayers,
  selectHostConnectionState,
  selectHostError,
  selectHostActions,
} from '../store/host-game-store'
import { saveHostSession, clearStoredHostSession } from '../lib/session-storage'
import { toastError, toastSuccess, toastInfo } from '@/lib/utils/toast'
import { GAME_HOST_CONSTANTS } from '../constants'
import { GameStatus, type GameSession } from '../types'

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
  questionResult: ReturnType<typeof selectHostQuestionResult>
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

  // Refs
  const isInitializedRef = useRef(false)
  const isLoadingRef = useRef(false)
  const isStartingRef = useRef(false)
  const isLoadingNextRef = useRef(false)

  // Store selectors
  const session = useHostGameStore(selectHostSession)
  const phase = useHostGameStore(selectHostPhase)
  const currentQuestion = useHostGameStore(selectHostCurrentQuestion)
  const questionResult = useHostGameStore(selectHostQuestionResult)
  const leaderboard = useHostGameStore(selectHostLeaderboard)
  const answeredCount = useHostGameStore(selectHostAnsweredCount)
  const totalPlayers = useHostGameStore(selectHostTotalPlayers)
  const connectionState = useHostGameStore(selectHostConnectionState)
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
      console.log('[Host] Player joined:', event.nickname)
      actions.handlePlayerJoined(event)
    },
    onPlayerLeft: (event) => {
      console.log('[Host] Player left:', event.nickname)
      actions.handlePlayerLeft(event)
    },
    onGameStarted: () => {
      console.log('[Host] Game started')
      actions.handleGameStarted()
    },
    onQuestionStarted: (event) => {
      console.log('[Host] Question started:', event.positionInGame)
      actions.handleQuestionStarted(event)
    },
    onQuestionEnded: (event) => {
      console.log('[Host] Question ended')
      actions.handleQuestionEnded(event)
    },
    onAnswerReceived: (event) => {
      actions.handleAnswerReceived(event)
    },
    onLeaderboardUpdated: (event) => {
      actions.handleLeaderboardUpdated(event)
    },
    onGameEnded: (event) => {
      console.log('[Host] Game ended')
      actions.handleGameEnded(event)
      clearStoredHostSession()
    },
    onError: (event) => {
      console.error('[Host] SignalR error:', event)
      actions.setError(event.message)
      toastError(event.message)
    },
  }), [actions])

  // =============================================================================
  // CONNECTION
  // =============================================================================

  const connectAndJoin = useCallback(async (gameSession: GameSession) => {
    try {
      // Connect with event handlers
      await gameSignalR.connect(setupSignalREvents())

      // Join as host
      await gameSignalR.joinAsHost(gameSession.id, gameSession.pin)
      console.log('[Host] Joined as host for session:', gameSession.id)
    } catch (err) {
      console.error('[Host] Failed to connect:', err)
      const message = err instanceof Error ? err.message : GAME_HOST_CONSTANTS.ERRORS.CONNECTION_FAILED
      toastError(message)
      throw err
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

    isLoadingRef.current = true
    actions.setError(null)
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.CREATING_SESSION)

    try {
      // Abandon any existing session first
      await gameSessionService.abandonActiveSession().catch(() => {})

      const response = await gameSessionService.createSession({ quizSetId: quizId })

      if (!response.success || !response.data) {
        throw new Error(response.message || GAME_HOST_CONSTANTS.ERRORS.CREATE_SESSION_FAILED)
      }

      const newSession = response.data as GameSession

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
      isLoadingRef.current = false
    }
  }, [quizId, actions, connectAndJoin])

  const resumeSession = useCallback(async (resumeSessionId: string) => {
    isLoadingRef.current = true
    actions.setError(null)

    try {
      const response = await gameSessionService.getSessionById(resumeSessionId)

      if (!response.success || !response.data) {
        throw new Error(GAME_HOST_CONSTANTS.ERRORS.SESSION_NOT_FOUND)
      }

      const resumedSession = response.data

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
    } finally {
      isLoadingRef.current = false
    }
  }, [actions, connectAndJoin])

  const abandonSession = useCallback(async () => {
    try {
      await gameSessionService.abandonActiveSession()
      clearStoredHostSession()
      actions.reset()
      toastInfo(GAME_HOST_CONSTANTS.MESSAGES.SESSION_ABANDONED)
    } catch (err) {
      console.error('[Host] Failed to abandon session:', err)
    }
  }, [actions])

  // =============================================================================
  // GAME FLOW
  // =============================================================================

  const startGame = useCallback(async () => {
    if (!session) return

    isStartingRef.current = true
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.STARTING_GAME)

    try {
      const response = await gameSessionService.startGame(session.id)

      if (!response.success) {
        throw new Error(response.message || 'Không thể bắt đầu trò chơi')
      }

      // Backend will send QuestionStarted via SignalR
      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_STARTED)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể bắt đầu trò chơi'
      actions.setError(message)
      toastError(message)
    } finally {
      isStartingRef.current = false
    }
  }, [session, actions])

  const showLeaderboard = useCallback(() => {
    actions.setPhase('leaderboard')

    // Fetch latest leaderboard
    if (session) {
      gameSessionService.getLeaderboard(session.id)
        .then(response => {
          if (response.success && response.data) {
            actions.setLeaderboard(response.data)
          }
        })
        .catch(console.error)
    }
  }, [session, actions])

  const nextQuestion = useCallback(async () => {
    if (!session) return

    isLoadingNextRef.current = true

    try {
      const response = await gameSessionService.nextQuestion(session.id)

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Không thể chuyển câu hỏi')
      }

      const { hasMoreQuestions, leaderboard: newLeaderboard } = response.data

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
      isLoadingNextRef.current = false
    }
  }, [session, actions])

  const endGame = useCallback(async () => {
    if (!session) return

    try {
      const response = await gameSessionService.endGame(session.id)

      if (response.success && response.data) {
        actions.handleGameEnded({
          gameSessionId: session.id,
          totalQuestions: response.data.totalQuestions,
          totalPlayers: response.data.totalPlayers,
          duration: response.data.duration,
          finalLeaderboard: response.data.finalLeaderboard.map(e => ({
            playerId: e.playerId,
            nickname: e.nickname,
            totalPoints: e.totalPoints,
            correctAnswers: e.correctAnswers,
            rank: e.rank,
          })),
        })
        clearStoredHostSession()
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_ENDED)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể kết thúc trò chơi'
      toastError(message)
    }
  }, [session, actions])

  const reset = useCallback(() => {
    gameSignalR.disconnect()
    actions.reset()
    clearStoredHostSession()
  }, [actions])

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    // Auto-resume if sessionId provided
    if (sessionId) {
      resumeSession(sessionId)
    }
    // Auto-create if quizId provided but no sessionId
    else if (quizId && !session) {
      // Don't auto-create - let user decide
    }

    return () => {
      // Cleanup on unmount
      gameSignalR.disconnect()
    }
  }, [sessionId, quizId, resumeSession, session])

  // Update SignalR events when callbacks change
  useEffect(() => {
    if (gameSignalR.isConnected()) {
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
    questionResult,
    leaderboard,
    answeredCount,
    totalPlayers,
    connectionState,
    error,

    // Loading states
    isLoading: isLoadingRef.current,
    isStarting: isStartingRef.current,
    isLoadingNext: isLoadingNextRef.current,

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

