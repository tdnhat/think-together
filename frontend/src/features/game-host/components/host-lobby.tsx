'use client'

import { useState, useEffect } from 'react'
import { Play, StopCircle, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { PinDisplay } from './pin-display'
import { PlayerList } from './player-list'
import { toastSuccess, toastError, toastInfo } from '@/lib/utils/toast'
import { GAME_HOST_CONSTANTS } from '../constants'
import { gameSessionService } from '../api/game-session.service'
import { useHostGameStore, selectHostSession, selectHostPhase, selectHostActions, selectHostError, selectHostIsConnected } from '../store/host-game.store'
import type { GameSession, GameEndedMessage, StartGameResponse } from '../types'

interface HostLobbyProps {
  session: GameSession
  onGameStart?: (data: StartGameResponse) => void
  onGameEnd?: (result: GameEndedMessage) => void
  className?: string
}

export function HostLobby({
  session: initialSession,
  onGameStart,
  onGameEnd,
  className = '',
}: Readonly<HostLobbyProps>) {
  const [isStarting, setIsStarting] = useState(false)
  const [isEnding, setIsEnding] = useState(false)

  const session = useHostGameStore(selectHostSession) || initialSession
  const phase = useHostGameStore(selectHostPhase)
  const error = useHostGameStore(selectHostError)
  const isConnected = useHostGameStore(selectHostIsConnected)
  const { 
    setSession, 
    setPhase, 
    setError, 
    handleGameEnded,
  } = useHostGameStore(selectHostActions)

  // Initialize session
  useEffect(() => {
    setSession(initialSession)
    setPhase('lobby')
  }, [initialSession, setSession, setPhase])

  const handleStartGame = async () => {
    if (!session) return

    if (session.players.length === 0) {
      toastError('Cần ít nhất 1 người chơi để bắt đầu')
      return
    }

    setIsStarting(true)
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.STARTING_GAME)

    try {
      const response = await gameSessionService.startGame(session.id)
      
      if (response.success && response.data) {
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_STARTED)
        // Phase will be updated by parent via onGameStart
        onGameStart?.(response.data)
      } else {
        toastError(response.message || 'Không thể bắt đầu trò chơi')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể bắt đầu trò chơi'
      toastError(errorMessage)
    } finally {
      setIsStarting(false)
    }
  }

  const handleEndGame = async () => {
    if (!session) return

    setIsEnding(true)
    toastInfo(GAME_HOST_CONSTANTS.MESSAGES.ENDING_GAME)

    try {
      const response = await gameSessionService.endGame(session.id)
      
      if (response.success && response.data) {
        toastSuccess(GAME_HOST_CONSTANTS.MESSAGES.GAME_ENDED)
        handleGameEnded({
          gameSessionId: session.id,
          totalQuestions: response.data.totalQuestions,
          totalPlayers: response.data.totalPlayers,
          duration: response.data.duration,
          finalLeaderboard: response.data.finalLeaderboard,
        })
        onGameEnd?.({
          gameSessionId: session.id,
          totalQuestions: response.data.totalQuestions,
          totalPlayers: response.data.totalPlayers,
          duration: response.data.duration,
          finalLeaderboard: response.data.finalLeaderboard,
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể kết thúc trò chơi'
      toastError(errorMessage)
    } finally {
      setIsEnding(false)
    }
  }

  const playerCount = session?.players.length || 0
  const canStart = playerCount > 0 && isConnected && !isStarting

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Connection Status */}
      {!isConnected && (
        <Alert variant={error ? 'destructive' : 'default'}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {GAME_HOST_CONSTANTS.MESSAGES.DISCONNECTED}
          </AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>
              {error || 'Vui lòng kiểm tra kết nối internet của bạn'}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert - Only show if connected but has other errors */}
      {error && isConnected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* PIN Display */}
      {session && <PinDisplay pin={session.pin} />}

      {/* Player Count & Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-[var(--text-secondary)]">Người chơi tham gia</p>
              <p className="font-heading text-3xl font-bold text-[var(--text-primary)]">
                {playerCount} <span className="text-lg font-normal text-[var(--text-tertiary)]">người</span>
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="default"
                size="lg"
                onClick={handleStartGame}
                disabled={!canStart}
                className="gap-2 min-w-40"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang bắt đầu...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Bắt đầu
                  </>
                )}
              </Button>

              <Button
                variant="neutral"
                size="lg"
                onClick={handleEndGame}
                disabled={isEnding}
                className="gap-2"
              >
                {isEnding ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <StopCircle className="h-5 w-5" />
                )}
                Hủy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player List */}
      {session && (
        <PlayerList
          players={session.players}
          showConnectionStatus={true}
          maxDisplay={30}
        />
      )}
    </div>
  )
}

