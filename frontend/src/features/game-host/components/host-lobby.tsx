'use client'

import { useEffect } from 'react'
import { Play, StopCircle, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { PinDisplay } from './pin-display'
import { PlayerList } from './player-list'
import { toastError } from '@/lib/utils/toast'
import { GAME_HOST_CONSTANTS } from '../constants'
import { useHostGame } from '../hooks/use-host-game'
import { useHostGameStore, selectHostSession, selectHostError, selectHostIsConnected } from '../store/host-game-store'
import type { GameSession } from '../types'

interface HostLobbyProps {
  session: GameSession
  className?: string
}

export function HostLobby({
  session: initialSession,
  className = '',
}: Readonly<HostLobbyProps>) {
  const { startGame, endGame, isStarting } = useHostGame({ sessionId: initialSession.id })
  const session = useHostGameStore(selectHostSession) || initialSession
  const error = useHostGameStore(selectHostError)
  const isConnected = useHostGameStore(selectHostIsConnected)

  const handleStartGame = async () => {
    if (!session) return

    if (session.players.length === 0) {
      toastError('Cần ít nhất 1 người chơi để bắt đầu')
      return
    }

    await startGame()
  }

  const handleEndGame = async () => {
    if (!session) return
    await endGame()
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
              <p className="text-sm text-muted-foreground">Người chơi tham gia</p>
              <p className="font-heading text-3xl font-bold text-foreground">
                {playerCount} <span className="text-lg font-normal text-muted-foreground">người</span>
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
                variant="outline"
                size="lg"
                onClick={handleEndGame}
                disabled={isStarting}
                className="gap-2"
              >
                <StopCircle className="h-5 w-5" />
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

