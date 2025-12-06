/**
 * Host Session Hook
 * 
 * Manages host game session lifecycle: creation, SignalR connection, and game flow.
 */

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { gameSessionService } from '../api/game-session.service'
import { useGameHub } from './use-game-hub'
import { 
  useHostGameStore,
  selectHostActions,
  selectHostSession,
  selectHostPhase,
  selectHostError,
} from '../store/host-game.store'
import { 
  saveHostSession, 
  getStoredHostSession, 
  clearStoredHostSession,
  type StoredHostSession 
} from '../lib/session-storage'
import { GAME_HOST_CONSTANTS } from '../constants'
import { GameStatus, QuestionType } from '../types'
import { ROUTES } from '@/config/routes'
import { toastError, toastInfo, toastSuccess } from '@/lib/utils/toast'
import type { GameSession, GameQuestion, LeaderboardEntry } from '../types'

interface UseHostSessionOptions {
  quizId: string | null
  sessionIdParam: string | null
  onSessionReady?: (session: GameSession) => void
}

interface UseHostSessionReturn {
  session: GameSession | null
  isLoading: boolean
  isCreating: boolean
  error: string | null
  showResumeOption: boolean
  storedSession: StoredHostSession | null
  createNewSession: () => Promise<void>
  resumeSession: (sessionId: string) => Promise<void>
  rejoinByPin: (pin: string) => Promise<void>
  abandonSession: () => Promise<void>
  startGame: () => Promise<void>
  nextQuestion: () => Promise<void>
  endGame: () => Promise<void>
  clearError: () => void
}

export function useHostSession({
  quizId,
  sessionIdParam,
  onSessionReady,
}: UseHostSessionOptions): UseHostSessionReturn {
  const router = useRouter()
  
  const session = useHostGameStore(selectHostSession)
  const phase = useHostGameStore(selectHostPhase)
  const storeError = useHostGameStore(selectHostError)
  const {
    setSession,
    setPhase,
    setCurrentQuestion,
    setQuestionResult,
    setLeaderboard,
    setError,
    setConnected,
    handlePlayerJoined,
    handlePlayerLeft,
    handleAnswerReceived,
    handleGameEnded,
    resetAnsweredCount,
  } = useHostGameStore(selectHostActions)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [showResumeOption, setShowResumeOption] = useState(false)
  const [storedSession, setStoredSession] = useState<StoredHostSession | null>(null)
  
  const hasCreatedRef = useRef(false)
  const hasLoadedRef = useRef(false)
  const hubConnectedRef = useRef(false)
  const hubMethodsRef = useRef<{
    connect: () => Promise<void>
    disconnect: () => Promise<void>
    joinAsHost: (gameSessionId: string, pin: string) => Promise<void>
    isConnected: boolean
  } | null>(null)

  // SignalR hub connection
  const hub = useGameHub({
    onConnected: () => {
      setConnected(true)
      hubConnectedRef.current = true
      const currentSession = useHostGameStore.getState().session
      if (currentSession && hubMethodsRef.current) {
        // Join as host when connected
        hubMethodsRef.current.joinAsHost(currentSession.id, currentSession.pin).catch(err => {
          console.error('Failed to join as host:', err)
        })
      }
    },
    onDisconnected: () => {
      setConnected(false)
      hubConnectedRef.current = false
    },
    onReconnecting: () => {
      setConnected(false)
    },
    onReconnected: () => {
      setConnected(true)
      hubConnectedRef.current = true
      const currentSession = useHostGameStore.getState().session
      if (currentSession && hubMethodsRef.current) {
        hubMethodsRef.current.joinAsHost(currentSession.id, currentSession.pin).catch(err => {
          console.error('Failed to rejoin as host:', err)
        })
      }
    },
    onPlayerJoined: (message) => {
      handlePlayerJoined(message)
    },
    onPlayerLeft: (message) => {
      handlePlayerLeft(message)
    },
    onAnswerReceived: (message) => {
      handleAnswerReceived(message)
    },
    onGameStarted: (message) => {
      setPhase('question')
    },
    onQuestionStarted: (message) => {
      const question: GameQuestion = {
        id: message.questionId,
        gameQuestionId: message.gameQuestionId,
        content: message.content,
        type: parseInt(message.questionType) as QuestionType,
        timeLimit: message.timeLimit,
        positionInGame: message.positionInGame,
        videoUrl: message.videoUrl,
        videoTimestamp: message.videoTimestamp,
        options: message.options.map(opt => ({
          index: opt.index,
          content: opt.content,
          imageUrl: opt.imageUrl,
        })),
      }
      setCurrentQuestion(question)
      setPhase('question')
      resetAnsweredCount()
    },
    onQuestionEnded: (message) => {
      setQuestionResult(message)
      setLeaderboard(message.topPlayers)
      setPhase('question-result')
    },
    onLeaderboardUpdated: (message) => {
      setLeaderboard(message.leaderboard)
    },
    onGameEnded: (message) => {
      handleGameEnded(message)
    },
    onError: (errorMessage) => {
      setError(errorMessage.message)
      toastError(errorMessage.message)
    },
  })

  // Store hub methods in ref
  useEffect(() => {
    hubMethodsRef.current = {
      connect: hub.connect,
      disconnect: hub.disconnect,
      joinAsHost: hub.joinAsHost,
      isConnected: hub.isConnected,
    }
  }, [hub.connect, hub.disconnect, hub.joinAsHost, hub.isConnected])

  // Connect to hub when session is ready
  useEffect(() => {
    if (session && !hubConnectedRef.current && hub.isConnected && hubMethodsRef.current) {
      hubMethodsRef.current.joinAsHost(session.id, session.pin).catch(err => {
        console.error('Failed to join as host:', err)
      })
      hubConnectedRef.current = true
    }
  }, [session?.id, session?.pin, hub.isConnected])

  // Check for existing session on mount
  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const checkExistingSession = async () => {
      setIsLoading(true)

      // If sessionId is provided in URL, try to load that session
      if (sessionIdParam) {
        try {
          const response = await gameSessionService.getSessionById(sessionIdParam)
          if (response.success && response.data) {
            const sessionData: GameSession = {
              id: response.data.id,
              hostUserId: response.data.hostUserId,
              quizSetId: response.data.quizSetId,
              pin: response.data.pin,
              status: response.data.status,
              currentQuestionIndex: response.data.currentQuestionIndex,
              totalQuestions: response.data.totalQuestions,
              currentQuestion: response.data.currentQuestion,
              startedAt: response.data.startedAt,
              endedAt: response.data.endedAt,
              players: response.data.players || [],
            }
            setSession(sessionData)
            saveHostSession(sessionData)
            onSessionReady?.(sessionData)
            setIsLoading(false)
            return
          }
        } catch {
          // Session not found, continue to check localStorage
        }
      }

      // Check localStorage for stored session
      const stored = getStoredHostSession()
      if (stored) {
        setStoredSession(stored)
        // If same quizId, offer to resume
        if (quizId && stored.quizSetId === quizId) {
          setShowResumeOption(true)
          setIsLoading(false)
          return
        }
        // If different quizId but has stored session, still offer option
        if (quizId) {
          setShowResumeOption(true)
          setIsLoading(false)
          return
        }
      }

      setIsLoading(false)
    }

    checkExistingSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Connect to hub on mount
  useEffect(() => {
    const connectHub = async () => {
      try {
        await hub.connect()
      } catch (err) {
        console.error('Failed to connect to hub:', err)
      }
    }
    connectHub()

    return () => {
      if (hubMethodsRef.current) {
        hubMethodsRef.current.disconnect().catch(() => {
          // Ignore errors on cleanup
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  // Create new session
  const createNewSession = useCallback(async () => {
    if (!quizId || hasCreatedRef.current) return
    hasCreatedRef.current = true

    setIsCreating(true)
    setLocalError(null)
    setError(null)
    setShowResumeOption(false)
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.CREATING_SESSION)

    try {
      const response = await gameSessionService.createSession({ quizSetId: quizId })
      
      if (response.success && response.data) {
        clearStoredHostSession()
        const newSession: GameSession = {
          id: response.data.id,
          hostUserId: response.data.hostUserId,
          quizSetId: response.data.quizSetId,
          pin: response.data.pin,
          status: response.data.status,
          currentQuestionIndex: response.data.currentQuestionIndex,
          totalQuestions: response.data.totalQuestions,
          currentQuestion: response.data.currentQuestion,
          startedAt: response.data.startedAt,
          endedAt: response.data.endedAt,
          players: response.data.players || [],
        }
        setSession(newSession)
        saveHostSession(newSession)
        setPhase('lobby')
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.SESSION_CREATED)
        onSessionReady?.(newSession)
        
        // Connect to hub and join as host
        if (hub.isConnected && hubMethodsRef.current) {
          await hubMethodsRef.current.joinAsHost(newSession.id, newSession.pin)
        }
        
        // Update URL with sessionId for bookmarking
        const newUrl = `${ROUTES.game.host}?quizId=${quizId}&sessionId=${newSession.id}`
        globalThis.history.replaceState({}, '', newUrl)
      } else {
        hasCreatedRef.current = false
        const errorMsg = response.message || GAME_HOST_CONSTANTS.ERRORS.CREATE_SESSION_FAILED
        setLocalError(errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      hasCreatedRef.current = false
      const errorMessage = err instanceof Error 
        ? err.message 
        : GAME_HOST_CONSTANTS.ERRORS.CREATE_SESSION_FAILED
      setLocalError(errorMessage)
      setError(errorMessage)
      toastError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }, [quizId, onSessionReady, setSession, setPhase, hub])

  // Resume existing session
  const resumeSession = useCallback(async (sessionId: string) => {
    setIsLoading(true)
    setLocalError(null)
    setError(null)
    setShowResumeOption(false)

    try {
      const response = await gameSessionService.getSessionById(sessionId)
      
      if (response.success && response.data) {
        // Check if session is still in Waiting status
        if (response.data.status === GameStatus.Ended) {
          clearStoredHostSession()
          const errorMsg = GAME_HOST_CONSTANTS.ERRORS.GAME_ALREADY_ENDED
          setLocalError(errorMsg)
          setError(errorMsg)
          setIsLoading(false)
          return
        }

        // Only allow resuming if status is Waiting
        if (response.data.status !== GameStatus.Waiting) {
          clearStoredHostSession()
          const errorMsg = GAME_HOST_CONSTANTS.ERRORS.GAME_IN_PROGRESS
          setLocalError(errorMsg)
          setError(errorMsg)
          setIsLoading(false)
          return
        }

        const resumedSession: GameSession = {
          id: response.data.id,
          hostUserId: response.data.hostUserId,
          quizSetId: response.data.quizSetId,
          pin: response.data.pin,
          status: response.data.status,
          currentQuestionIndex: response.data.currentQuestionIndex,
          totalQuestions: response.data.totalQuestions,
          currentQuestion: response.data.currentQuestion,
          startedAt: response.data.startedAt,
          endedAt: response.data.endedAt,
          players: response.data.players || [],
        }
        setSession(resumedSession)
        saveHostSession(resumedSession)
        setPhase('lobby')
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.SESSION_RESUMED)
        onSessionReady?.(resumedSession)
        
        // Connect to hub and join as host
        if (hub.isConnected && hubMethodsRef.current) {
          await hubMethodsRef.current.joinAsHost(resumedSession.id, resumedSession.pin)
        }
        
        // Update URL
        const newUrl = `${ROUTES.game.host}?quizId=${resumedSession.quizSetId}&sessionId=${resumedSession.id}`
        globalThis.history.replaceState({}, '', newUrl)
      } else {
        clearStoredHostSession()
        const errorMsg = GAME_HOST_CONSTANTS.ERRORS.SESSION_NOT_FOUND
        setLocalError(errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      clearStoredHostSession()
      const errorMessage = err instanceof Error 
        ? err.message 
        : GAME_HOST_CONSTANTS.ERRORS.RESUME_SESSION_FAILED
      setLocalError(errorMessage)
      setError(errorMessage)
      toastError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [onSessionReady, setSession, setPhase, hub])

  // Rejoin by PIN
  const rejoinByPin = useCallback(async (pin: string) => {
    if (pin.length !== GAME_HOST_CONSTANTS.PIN_DISPLAY.PIN_LENGTH) {
      const errorMsg = GAME_HOST_CONSTANTS.ERRORS.PIN_REQUIRED
      setLocalError(errorMsg)
      setError(errorMsg)
      return
    }

    setIsLoading(true)
    setLocalError(null)
    setError(null)

    try {
      const response = await gameSessionService.getSessionByPin(pin)
      
      if (response.success && response.data) {
        const rejoinedSession: GameSession = {
          id: response.data.id,
          hostUserId: response.data.hostUserId,
          quizSetId: response.data.quizSetId,
          pin: response.data.pin,
          status: response.data.status,
          currentQuestionIndex: response.data.currentQuestionIndex,
          totalQuestions: response.data.totalQuestions,
          currentQuestion: response.data.currentQuestion,
          startedAt: response.data.startedAt,
          endedAt: response.data.endedAt,
          players: response.data.players || [],
        }
        setSession(rejoinedSession)
        saveHostSession(rejoinedSession)
        setPhase(response.data.status === GameStatus.InProgress ? 'question' : 'lobby')
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.SESSION_RESUMED)
        onSessionReady?.(rejoinedSession)
        
        // Connect to hub and join as host
        if (hub.isConnected && hubMethodsRef.current) {
          await hubMethodsRef.current.joinAsHost(rejoinedSession.id, rejoinedSession.pin)
        }
        
        const newUrl = `${ROUTES.game.host}?quizId=${rejoinedSession.quizSetId}&sessionId=${rejoinedSession.id}`
        globalThis.history.replaceState({}, '', newUrl)
      } else {
        const errorMsg = GAME_HOST_CONSTANTS.ERRORS.PIN_NOT_FOUND
        setLocalError(errorMsg)
        setError(errorMsg)
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : GAME_HOST_CONSTANTS.ERRORS.PIN_NOT_FOUND
      setLocalError(errorMessage)
      setError(errorMessage)
      toastError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [onSessionReady, setSession, setPhase, hub])

  // Abandon session
  const abandonSession = useCallback(async () => {
    setIsLoading(true)
    setLocalError(null)
    setError(null)
    
    try {
      await gameSessionService.abandonActiveSession()
      clearStoredHostSession()
      setStoredSession(null)
      setShowResumeOption(false)
      hasCreatedRef.current = false
      
      toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.SESSION_ABANDONED)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : GAME_HOST_CONSTANTS.ERRORS.ABANDON_SESSION_FAILED
      setLocalError(errorMessage)
      setError(errorMessage)
      toastError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Start game
  const startGame = useCallback(async () => {
    if (!session) return

    try {
      setPhase('starting')
      const response = await gameSessionService.startGame(session.id)
      
      if (response.success && response.data) {
        // SignalR will handle the GameStarted and QuestionStarted events
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_STARTED)
      } else {
        setPhase('lobby')
        const errorMsg = response.message || 'Không thể bắt đầu trò chơi'
        setError(errorMsg)
        toastError(errorMsg)
      }
    } catch (err) {
      setPhase('lobby')
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Không thể bắt đầu trò chơi'
      setError(errorMessage)
      toastError(errorMessage)
    }
  }, [session, setPhase, setError])

  // Next question
  const nextQuestion = useCallback(async () => {
    if (!session) return

    try {
      const response = await gameSessionService.nextQuestion(session.id)
      
      if (response.success && response.data) {
        if (response.data.question) {
          // SignalR will handle QuestionStarted event
          setLeaderboard(response.data.leaderboard)
        } else {
          // No more questions, end game
          await endGame()
        }
      } else {
        const errorMsg = response.message || 'Không thể chuyển câu hỏi'
        setError(errorMsg)
        toastError(errorMsg)
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Không thể chuyển câu hỏi'
      setError(errorMessage)
      toastError(errorMessage)
    }
  }, [session, setLeaderboard, setError])

  // End game
  const endGame = useCallback(async () => {
    if (!session) return

    try {
      setPhase('ended')
      const response = await gameSessionService.endGame(session.id)
      
      if (response.success && response.data) {
        // SignalR will handle GameEnded event
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_ENDED)
      } else {
        const errorMsg = response.message || 'Không thể kết thúc trò chơi'
        setError(errorMsg)
        toastError(errorMsg)
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Không thể kết thúc trò chơi'
      setError(errorMessage)
      toastError(errorMessage)
    }
  }, [session, setPhase, setError])

  const clearError = useCallback(() => {
    setLocalError(null)
    setError(null)
  }, [setError])

  return {
    session,
    isLoading,
    isCreating,
    error: storeError || localError,
    showResumeOption,
    storedSession,
    createNewSession,
    resumeSession,
    rejoinByPin,
    abandonSession,
    startGame,
    nextQuestion,
    endGame,
    clearError,
  }
}
