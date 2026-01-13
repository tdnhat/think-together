/**
 * Join Game Hook
 * 
 * Handles joining a game session with PIN and nickname.
 * Supports localStorage session recovery for reconnecting players.
 */

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { gameSessionService, GameStatus } from '@/features/game-host'
import { usePlayerGameStore, selectPlayerActions } from '../store/player-game-store'
import { GAME_PLAYER_CONSTANTS } from '../constants'
import { ROUTES } from '@/config/routes'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import {
  getPlayerSession,
  savePlayerSession,
  isSessionValid,
  type StoredPlayerSession
} from '../lib/player-session-storage'

interface UseJoinGameReturn {
  isLoading: boolean
  error: string | null
  joinGame: (pin: string, nickname: string) => Promise<void>
  tryReconnect: (pin: string) => Promise<StoredPlayerSession | null>
  clearError: () => void
}

export function useJoinGame(): UseJoinGameReturn {
  const router = useRouter()
  const { setPlayerInfo, setPhase } = usePlayerGameStore(selectPlayerActions)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Try to reconnect using stored localStorage session
   * Returns stored session if valid and reconnectable, null otherwise
   */
  const tryReconnect = useCallback(async (pin: string): Promise<StoredPlayerSession | null> => {
    const storedSession = getPlayerSession(pin)

    if (!storedSession || !isSessionValid(storedSession)) {
      return null
    }

    try {
      // Verify the session is still valid on the server
      const sessionResponse = await gameSessionService.getSessionByPin(pin)

      // Check if game is still joinable/in-progress
      if (sessionResponse.status === GameStatus.Ended) {
        return null
      }

      // Session is valid - restore to store
      setPlayerInfo({
        pin: storedSession.pin,
        playerId: storedSession.playerId,
        nickname: storedSession.nickname,
        sessionId: storedSession.sessionId,
      })

      return storedSession
    } catch {
      // Session validation failed, ignore and require fresh join
      return null
    }
  }, [setPlayerInfo])

  const joinGame = useCallback(async (pin: string, nickname: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Join the game - the endpoint will validate PIN and game status
      const joinResponse = await gameSessionService.joinSession({ pin, nickname })

      // Get sessionId - we need it for SignalR
      const sessionResponse = await gameSessionService.getSessionByPin(pin)
      const sessionId = sessionResponse.id

      // Store player info in Zustand
      setPlayerInfo({
        pin,
        playerId: joinResponse.playerId,
        nickname,
        sessionId,
      })
      setPhase('lobby')

      // Save to localStorage for reconnect
      savePlayerSession({
        pin,
        playerId: joinResponse.playerId,
        nickname,
        sessionId,
        joinedAt: new Date().toISOString(),
      })

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
  }, [setPlayerInfo, setPhase, router])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isLoading,
    error,
    joinGame,
    tryReconnect,
    clearError,
  }
}
