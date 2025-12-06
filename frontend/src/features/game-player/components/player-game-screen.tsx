'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { PlayerWaiting } from './player-waiting'
import { PlayerQuestion } from './player-question'
import { PlayerResults } from './player-results'
import { PlayerFinalResult } from './player-final-result'
import { toastSuccess, toastError, toastInfo } from '@/lib/utils/toast'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { useGameHub } from '@/features/game-host/hooks/use-game-hub'
import {
  usePlayerGameStore,
  selectPlayerPhase,
  selectPlayerCurrentQuestion,
  selectPlayerSelectedAnswers,
  selectPlayerHasAnswered,
  selectPlayerLeaderboard,
  selectPlayerActions,
} from '../store/player-game.store'
import type {
  QuestionStartedMessage,
  GameStartedMessage,
  LeaderboardUpdatedMessage,
  GameEndedMessage,
} from '@/features/game-host/types'

interface PlayerGameScreenProps {
  pin: string
  playerId: string
  nickname: string
  sessionId: string
  className?: string
}

export function PlayerGameScreen({
  pin,
  playerId,
  nickname,
  sessionId,
  className = '',
}: Readonly<PlayerGameScreenProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [hasNetworkError, setHasNetworkError] = useState(false)
  
  // Refs to track current state/handlers for SignalR callbacks
  const handlersRef = useRef<{
    onGameStarted?: (message: GameStartedMessage) => void
    onQuestionStarted?: (message: QuestionStartedMessage) => void
    onLeaderboardUpdated?: (message: LeaderboardUpdatedMessage) => void
    onGameEnded?: (message: GameEndedMessage) => void
    onError?: (error: { message: string; code?: string }) => void
  }>({})
  
  // Ref to track if we're attempting reconnect and need to handle Error event
  const reconnectAttemptRef = useRef<{
    isAttempting: boolean
    resolve?: () => void
    reject?: (error: Error) => void
  }>({ isAttempting: false })
  
  // Ref to store joinGame function so it can be used in handleError
  const joinGameRef = useRef<((pin: string, nickname: string) => Promise<void>) | null>(null)
  
  // Ref to track if we're currently joining to prevent duplicate joins
  const isJoiningRef = useRef(false)

  const phase = usePlayerGameStore(selectPlayerPhase)
  const currentQuestion = usePlayerGameStore(selectPlayerCurrentQuestion)
  const selectedAnswers = usePlayerGameStore(selectPlayerSelectedAnswers)
  const hasAnswered = usePlayerGameStore(selectPlayerHasAnswered)
  const leaderboard = usePlayerGameStore(selectPlayerLeaderboard)
  const {
    setPhase,
    setPin,
    setPlayerId,
    setNickname,
    setSessionId,
    setConnected,
    handleQuestionStarted,
    handleGameEnded,
    toggleAnswer,
    setHasAnswered,
    setLeaderboard,
  } = usePlayerGameStore(selectPlayerActions)

  // Hub callbacks - update refs to ensure latest handlers are always available
  const handleGameStarted = useCallback((message: GameStartedMessage) => {
    console.log('[Player] GameStarted event received:', message)
    setTotalQuestions(message.totalQuestions)
    setPhase('starting')
    toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.GAME_STARTED)
  }, [setPhase])

  const handleQuestionStartedCallback = useCallback((message: QuestionStartedMessage) => {
    console.log('[Player] QuestionStarted event received:', message)
    handleQuestionStarted(message)
    setTotalQuestions(message.totalQuestions)
  }, [handleQuestionStarted])

  const handleLeaderboardUpdated = useCallback((message: LeaderboardUpdatedMessage) => {
    setLeaderboard(message.leaderboard)
    // Transition to leaderboard phase to show results
    if (phase === 'answered' || hasAnswered) {
      setPhase('leaderboard')
    }
  }, [setLeaderboard, setPhase, phase, hasAnswered])

  const handleHubGameEnded = useCallback((message: GameEndedMessage) => {
    setTotalQuestions(message.totalQuestions)
    handleGameEnded(message)
    toastInfo(GAME_PLAYER_CONSTANTS.MESSAGES.GAME_ENDED)
  }, [handleGameEnded])

  const handleError = useCallback(async (error: { message: string; code?: string }) => {
    // Check if it's a reconnect error - handle it specially
    if (error.code === 'RECONNECT_FAILED') {
      console.log('[Player] Reconnect failed via Error event:', error.message)
      
      // If we're currently attempting reconnect, reject the promise
      if (reconnectAttemptRef.current.isAttempting && reconnectAttemptRef.current.reject) {
        reconnectAttemptRef.current.isAttempting = false
        const rejectFn = reconnectAttemptRef.current.reject
        reconnectAttemptRef.current.reject = undefined
        reconnectAttemptRef.current.resolve = undefined
        rejectFn(new Error(error.message))
        return
      }
      
      // If not currently attempting and not already joining, try to join as new player automatically
      // This handles the case where Error event comes after reconnect call completes
      if (joinGameRef.current && !isJoiningRef.current) {
        isJoiningRef.current = true
        try {
          console.log('[Player] Reconnect failed, automatically trying to join as new player...')
          setPhase('lobby')
          await joinGameRef.current(pin, nickname)
          console.log('[Player] Successfully joined as new player after reconnect failure')
        } catch (joinErr) {
          console.error('[Player] Failed to join as new player after reconnect failure:', joinErr)
          toastError(error.message)
        } finally {
          isJoiningRef.current = false
        }
      }
      return
    }
    
    // Check if it's a network error
    if (error.message.includes('ERR_CONNECTION_REFUSED') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')) {
      setHasNetworkError(true)
    }
    
    toastError(error.message)
  }, [pin, nickname, setPhase])
  
  // Update refs with latest handlers whenever they change
  useEffect(() => {
    handlersRef.current = {
      onGameStarted: handleGameStarted,
      onQuestionStarted: handleQuestionStartedCallback,
      onLeaderboardUpdated: handleLeaderboardUpdated,
      onGameEnded: handleHubGameEnded,
      onError: handleError,
    }
  }, [
    handleGameStarted,
    handleQuestionStartedCallback,
    handleLeaderboardUpdated,
    handleHubGameEnded,
    handleError,
  ])

  const {
    connect,
    joinGame,
    submitAnswer,
    reconnect,
  } = useGameHub({
    onGameStarted: handleGameStarted,
    onQuestionStarted: handleQuestionStartedCallback,
    onLeaderboardUpdated: handleLeaderboardUpdated,
    onGameEnded: handleHubGameEnded,
    onError: handleError,
    onConnected: () => {
      console.log('[Player] SignalR connected')
      setConnected(true)
      setHasNetworkError(false) // Clear network error on successful connection
      toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.CONNECTED)
    },
    onDisconnected: () => {
      setConnected(false)
      toastInfo(GAME_PLAYER_CONSTANTS.MESSAGES.DISCONNECTED)
    },
    onReconnecting: () => {
      toastInfo(GAME_PLAYER_CONSTANTS.MESSAGES.RECONNECTING)
    },
    onReconnected: () => {
      setConnected(true)
      toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.RECONNECTED)
    },
  })
  
  // Store joinGame in ref so it can be used in handleError
  useEffect(() => {
    joinGameRef.current = joinGame
  }, [joinGame])

  // Handle tab visibility changes (resume when tab becomes visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('[Player] Tab hidden - SignalR connection will handle reconnection')
      } else {
        console.log('[Player] Tab visible again - SignalR will automatically sync state')
        // SignalR will automatically reconnect and sync state via events
        // No need for manual API calls
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Initialize connection
  useEffect(() => {
    console.log('[Player] Initializing with:', { pin, playerId, nickname, sessionId })
    setPin(pin)
    setPlayerId(playerId)
    setNickname(nickname)
    setSessionId(sessionId)
    setPhase('lobby')

    const initConnection = async () => {
      try {
        console.log('[Player] Connecting to SignalR hub...')
        await connect()
        
        // Try to reconnect first in case we're rejoining
        let reconnectSucceeded = false
        try {
          console.log('[Player] Attempting to reconnect...')
          
          // Set up promise to handle Error event from SignalR
          const reconnectPromise = new Promise<void>((resolve, reject) => {
            reconnectAttemptRef.current = {
              isAttempting: true,
              resolve: () => {
                reconnectAttemptRef.current.isAttempting = false
                resolve()
              },
              reject: (error: Error) => {
                reconnectAttemptRef.current.isAttempting = false
                reject(error)
              }
            }
            
            // Call reconnect and wait a bit for Error event
            reconnect(pin, playerId)
              .then(() => {
                // Wait a short time to see if Error event comes through
                setTimeout(() => {
                  if (reconnectAttemptRef.current.isAttempting) {
                    // No error event received, assume success
                    reconnectAttemptRef.current.isAttempting = false
                    resolve()
                  }
                }, 500)
              })
              .catch((err) => {
                reconnectAttemptRef.current.isAttempting = false
                reject(err)
              })
          })
          
          await reconnectPromise
          console.log('[Player] Reconnected successfully')
          reconnectSucceeded = true
          // SignalR reconnect will automatically send QuestionStarted event if game is in progress
          // No need for manual API call to fetch state
        } catch (reconnectErr) {
          // Check if it's a network error (connection refused, etc.)
          const isNetworkError = reconnectErr instanceof Error && (
            reconnectErr.message.includes('ERR_CONNECTION_REFUSED') ||
            reconnectErr.message.includes('Failed to fetch') ||
            reconnectErr.message.includes('NetworkError') ||
            reconnectErr.message.includes('Chưa kết nối đến máy chủ')
          )
          
          if (isNetworkError) {
            // Network error - don't try to join as new player, just show error
            console.error('[Player] Network error during reconnect:', reconnectErr)
            throw reconnectErr
          }
          
          // Business logic error (player not registered, session doesn't exist, etc.)
          // Try to join as new player (only if not already joining)
          if (isJoiningRef.current) {
            console.log('[Player] Already joining, skipping duplicate join attempt')
            return
          }
          
          console.log('[Player] Reconnect failed (player not registered or session expired), joining as new player...')
          isJoiningRef.current = true
          try {
            // Only set lobby phase if we're not already in a question phase
            // This prevents resetting phase if question was already loaded
            // Note: phase is from component state, so we check it directly
            if (phase === 'lobby' || phase === 'idle' || phase === 'starting') {
              setPhase('lobby')
            }
            await joinGame(pin, nickname)
            console.log('[Player] Joined game successfully as new player')
            // SignalR will sync the current state (question, leaderboard, etc.) via events
          } catch (joinErr) {
            // If joining as new player also fails, throw the original reconnect error
            console.error('[Player] Failed to join as new player:', joinErr)
            throw reconnectErr
          } finally {
            isJoiningRef.current = false
          }
        }
      } catch (err) {
        console.error('[Player] Connection error:', err)
        
        // Check if it's a network error
        const isNetworkError = err instanceof Error && (
          err.message.includes('ERR_CONNECTION_REFUSED') ||
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('Chưa kết nối đến máy chủ') ||
          err.message.includes('Hết thời gian chờ kết nối')
        )
        
        if (isNetworkError) {
          setHasNetworkError(true)
          toastError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và đảm bảo máy chủ đang chạy.')
        } else {
          const errorMessage = err instanceof Error ? err.message : GAME_PLAYER_CONSTANTS.ERRORS.CONNECTION_FAILED
          toastError(errorMessage)
        }
      }
    }

    initConnection()
  }, [pin, playerId, nickname, sessionId, setPin, setPlayerId, setNickname, setSessionId, setPhase, connect, reconnect, joinGame])

  const handleSelectAnswer = (index: number) => {
    if (!hasAnswered) {
      toggleAnswer(index)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || selectedAnswers.length === 0 || hasAnswered) {
      return
    }

    setIsSubmitting(true)
    setHasAnswered(true)

    try {
      const responseTimeMs = 1000 // Simplified for now
      
      await submitAnswer(
        sessionId,
        playerId,
        currentQuestion.gameQuestionId,
        selectedAnswers,
        responseTimeMs
      )
      
      toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.SUBMITTED)
    } catch (err) {
      console.error('Submit answer error:', err)
      const errorMessage = err instanceof Error ? err.message : GAME_PLAYER_CONSTANTS.ERRORS.SUBMIT_FAILED
      toastError(errorMessage)
      setHasAnswered(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Polling removed - SignalR handles all real-time updates
  // No need for periodic API calls

  // Debug: Log phase changes
  useEffect(() => {
    console.log('[Player] Phase changed to:', phase)
  }, [phase])

  // Debug: Log render state
  console.log('[Player] Rendering with phase:', phase, 'currentQuestion:', currentQuestion?.gameQuestionId)

  // Render based on phase
  if (phase === 'ended') {
    return (
      <div className={className}>
        <PlayerFinalResult
          playerId={playerId}
          nickname={nickname}
          leaderboard={leaderboard}
          totalQuestions={totalQuestions}
        />
      </div>
    )
  }

  // Note: No 'answered' phase - players stay on question screen after submitting
  // They'll see "Đã gửi câu trả lời" message until leaderboard is shown
  
  // Show leaderboard/results between questions
  if (phase === 'leaderboard' && leaderboard.length > 0) {
    return (
      <div className={className}>
        <PlayerResults
          playerId={playerId}
          leaderboard={leaderboard}
        />
      </div>
    )
  }
  
  if (phase === 'question' && currentQuestion) {
    return (
      <div className={className}>
        <PlayerQuestion
          question={currentQuestion}
          selectedAnswers={selectedAnswers}
          hasAnswered={hasAnswered}
          onSelectAnswer={handleSelectAnswer}
          onSubmit={handleSubmitAnswer}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  }

  if (phase === 'lobby' || phase === 'starting') {
    return (
      <div className={className}>
        <PlayerWaiting
          nickname={nickname}
          pin={pin}
          message={
            phase === 'starting'
              ? GAME_PLAYER_CONSTANTS.MESSAGES.GAME_STARTED
              : GAME_PLAYER_CONSTANTS.MESSAGES.WAITING_FOR_HOST
          }
        />
      </div>
    )
  }

  // Default loading state
  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] ${className}`}>
      <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-primary)] mb-4" />
      <p className="text-lg text-[var(--text-secondary)]">
        {GAME_PLAYER_CONSTANTS.MESSAGES.CONNECTING}
      </p>
    </div>
  )
}

