/**
 * Join Game Hook
 * 
 * Handles joining a game session with PIN and nickname.
 */

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { gameSessionService, GameStatus } from '@/features/game-host'
import { usePlayerGameStore, selectPlayerActions } from '../store/player-game.store'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { ROUTES } from '@/config/routes'
import { toastError, toastSuccess } from '@/lib/utils/toast'

interface UseJoinGameReturn {
  isLoading: boolean
  error: string | null
  joinGame: (pin: string, nickname: string) => Promise<void>
  clearError: () => void
}

export function useJoinGame(): UseJoinGameReturn {
  const router = useRouter()
  const { setPin, setPlayerId, setNickname, setSessionId, setPhase } = usePlayerGameStore(selectPlayerActions)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const joinGame = useCallback(async (pin: string, nickname: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Join the game - the endpoint will validate PIN and game status
      const joinResponse = await gameSessionService.joinSession({ pin, nickname })
      
      if (!joinResponse.success || !joinResponse.data) {
        const errorMsg = joinResponse.message || GAME_PLAYER_CONSTANTS.ERRORS.JOIN_FAILED
        setError(errorMsg)
        toastError(errorMsg)
        return
      }

      // Get sessionId - we need it for SignalR, but we can get it later via reconnect
      // For now, fetch it once after successful join
      const sessionResponse = await gameSessionService.getSessionByPin(pin)
      const sessionId = sessionResponse.success && sessionResponse.data 
        ? sessionResponse.data.id 
        : null

      // Store player info (sessionId can be null, we'll get it via SignalR reconnect if needed)
      setPin(pin)
      setPlayerId(joinResponse.data.playerId)
      setNickname(nickname)
      if (sessionId) {
        setSessionId(sessionId)
      }
      setPhase('lobby')

      toastSuccess(GAME_PLAYER_CONSTANTS.MESSAGES.JOINED)

      // Navigate to play page
      router.push(ROUTES.game.playWithPin(pin))
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : GAME_PLAYER_CONSTANTS.ERRORS.JOIN_FAILED
      setError(errorMessage)
      toastError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [setPin, setPlayerId, setNickname, setSessionId, setPhase, router])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    joinGame,
    clearError,
  }
}

