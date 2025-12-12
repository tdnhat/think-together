/**
 * Player Session Hook
 * 
 * Manages player game session lifecycle with SignalR integration.
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gameSessionService } from '@/features/game-host'
import { useGameHub } from '@/features/game-host/hooks/use-game-hub'
import { 
  usePlayerGameStore,
  selectPlayerPin,
  selectPlayerPlayerId,
  selectPlayerNickname,
  selectPlayerSessionId,
  selectPlayerActions,
  selectPlayerPhase,
  selectPlayerCurrentQuestion,
  selectPlayerSelectedAnswers,
  selectPlayerHasAnswered,
  selectPlayerError,
} from '../store/player-game.store'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { ROUTES } from '@/config/routes'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import type { AnswerResult } from '@/features/game-host/types'

interface UsePlayerSessionOptions {
  pin: string
}

interface UsePlayerSessionReturn {
  isValid: boolean
  isLoading: boolean
  error: string | null
  verifySession: () => Promise<void>
  submitAnswer: () => Promise<void>
}

export function usePlayerSession({ pin }: UsePlayerSessionOptions): UsePlayerSessionReturn {
  const router = useRouter()
  
  const storedPin = usePlayerGameStore(selectPlayerPin)
  const storedPlayerId = usePlayerGameStore(selectPlayerPlayerId)
  const storedNickname = usePlayerGameStore(selectPlayerNickname)
  const storedSessionId = usePlayerGameStore(selectPlayerSessionId)
  const phase = usePlayerGameStore(selectPlayerPhase)
  const currentQuestion = usePlayerGameStore(selectPlayerCurrentQuestion)
  const selectedAnswers = usePlayerGameStore(selectPlayerSelectedAnswers)
  const hasAnswered = usePlayerGameStore(selectPlayerHasAnswered)
  
  const {
    setPhase,
    setConnected,
    setError,
    setSessionId,
    handleQuestionStarted,
    handleAnswerResult,
    handleGameEnded,
    setLeaderboard,
    getResponseTime,
    setHasAnswered,
  } = usePlayerGameStore(selectPlayerActions)
  
  const storeError = usePlayerGameStore(selectPlayerError)
  
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [localError, setLocalError] = useState<string | null>(null)
  const hubConnectedRef = useRef(false)
  const hubMethodsRef = useRef<{
    connect: () => Promise<void>
    disconnect: () => Promise<void>
    joinGame: (pin: string, nickname: string) => Promise<void>
    reconnect: (pin: string, playerId: string) => Promise<void>
    submitAnswer: (
      gameSessionId: string,
      playerId: string,
      gameQuestionId: string,
      selectedOptionIndexes: number[],
      responseTimeMs: number
    ) => Promise<void>
    isConnected: boolean
  } | null>(null)

  // SignalR hub connection
  const hub = useGameHub({
    onConnected: () => {
      setConnected(true)
      hubConnectedRef.current = true
      const currentPin = usePlayerGameStore.getState().pin
      const currentPlayerId = usePlayerGameStore.getState().playerId
      const currentNickname = usePlayerGameStore.getState().nickname
      if (currentPin === pin && currentPlayerId && hubMethodsRef.current) {
        // Rejoin game when connected
        hubMethodsRef.current.joinGame(pin, currentNickname || '').catch(err => {
          console.error('Failed to join game:', err)
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
      const currentPin = usePlayerGameStore.getState().pin
      const currentPlayerId = usePlayerGameStore.getState().playerId
      if (currentPin === pin && currentPlayerId && hubMethodsRef.current) {
        hubMethodsRef.current.reconnect(pin, currentPlayerId).catch(err => {
          console.error('Failed to reconnect:', err)
        })
      }
    },
    onGameStarted: () => {
      setPhase('starting')
    },
    onQuestionStarted: (message) => {
      handleQuestionStarted(message)
    },
    onLeaderboardUpdated: (message) => {
      setLeaderboard(message.leaderboard)
    },
    onGameEnded: (message) => {
      handleGameEnded(message)
    },
    onAnswerReceived: (message) => {
      // This is just a confirmation, actual result comes from backend
      // The backend doesn't send AnswerResult via SignalR, we need to handle it differently
      // For now, we'll wait for the next leaderboard update or question end
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
      joinGame: hub.joinGame,
      reconnect: hub.reconnect,
      submitAnswer: hub.submitAnswer,
      isConnected: hub.isConnected,
    }
  }, [hub.connect, hub.disconnect, hub.joinGame, hub.reconnect, hub.submitAnswer, hub.isConnected])

  // Connect to hub and join game when session is valid
  useEffect(() => {
    if (isValid && storedPin === pin && storedPlayerId && !hubConnectedRef.current && hubMethodsRef.current) {
      hubMethodsRef.current.connect().then(() => {
        if (hubMethodsRef.current?.isConnected) {
          hubMethodsRef.current.joinGame(pin, storedNickname || '').catch(err => {
            console.error('Failed to join game:', err)
          })
          hubConnectedRef.current = true
        }
      }).catch(err => {
        console.error('Failed to connect to hub:', err)
      })
    }
  }, [isValid, pin, storedPin, storedPlayerId, storedNickname])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hubMethodsRef.current) {
        hubMethodsRef.current.disconnect().catch(() => {
          // Ignore errors on cleanup
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on unmount

  const verifySession = useCallback(async () => {
    setIsLoading(true)
    setLocalError(null)
    setError(null)

    // Check if we have stored session info for this PIN
    if (storedPin !== pin || !storedPlayerId || !storedNickname) {
      // No valid session, redirect to join page
      router.replace(`${ROUTES.game.join}?pin=${pin}`)
      return
    }

    // If we don't have sessionId, try to get it via reconnect API
    // This will also validate that the player is still valid
    if (!storedSessionId) {
      try {
        const reconnectResponse = await gameSessionService.reconnect({ pin, playerId: storedPlayerId })
        if (reconnectResponse.success && reconnectResponse.data?.gameSession) {
          setSessionId(reconnectResponse.data.gameSession.id)
          setIsValid(true)
          setIsLoading(false)
          return
        }
      } catch {
        // Reconnect failed, redirect to join
        router.replace(`${ROUTES.game.join}?pin=${pin}`)
        return
      }
    }

    // We have stored data, trust it and let SignalR sync the state
    // SignalR reconnect will handle getting current question/state
    setIsValid(true)
    setIsLoading(false)
  }, [pin, storedPin, storedPlayerId, storedNickname, storedSessionId, router, setSessionId])

  // Submit answer
  const submitAnswer = useCallback(async () => {
    if (!storedSessionId || !storedPlayerId || !currentQuestion || hasAnswered) {
      return
    }

    if (selectedAnswers.length === 0) {
      toastError('Vui lòng chọn ít nhất một đáp án')
      return
    }

    try {
      setHasAnswered(true)
      const responseTime = getResponseTime()

      if (!hubMethodsRef.current) {
        throw new Error('Chưa kết nối đến máy chủ')
      }

      await hubMethodsRef.current.submitAnswer(
        storedSessionId,
        storedPlayerId,
        currentQuestion.gameQuestionId,
        selectedAnswers,
        responseTime
      )

      // Note: The backend doesn't send AnswerResult via SignalR
      // We'll need to fetch it from the API or wait for leaderboard update
      // For now, we'll transition to 'answered' phase and wait for next question or result
      setPhase('answered')
      toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.SUBMITTED)
    } catch (err) {
      setHasAnswered(false)
      const errorMessage = err instanceof Error 
        ? err.message 
        : GAME_PLAYER_CONSTANTS.ERRORS.SUBMIT_FAILED
      setError(errorMessage)
      toastError(errorMessage)
    }
  }, [
    storedSessionId,
    storedPlayerId,
    currentQuestion,
    selectedAnswers,
    hasAnswered,
    getResponseTime,
    setHasAnswered,
    setPhase,
    setError,
  ])

  // Verify session on mount
  useEffect(() => {
    verifySession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  return {
    isValid,
    isLoading,
    error: storeError || localError,
    verifySession,
    submitAnswer,
  }
}
