'use client'

import { Users, User, Wifi, WifiOff } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { GamePlayer, ConnectionStatus } from '../types'

interface PlayerListProps {
  players: GamePlayer[]
  showConnectionStatus?: boolean
  maxDisplay?: number
  className?: string
}

export function PlayerList({
  players,
  showConnectionStatus = true,
  maxDisplay = 20,
  className = '',
}: Readonly<PlayerListProps>) {
  const displayedPlayers = players.slice(0, maxDisplay)
  const remainingCount = Math.max(0, players.length - maxDisplay)

  const getConnectionStatusColor = (status: ConnectionStatus) => {
    return status === ConnectionStatus.Connected ? 'text-green-600' : 'text-muted-foreground'
  }

  const getConnectionStatusIcon = (status: ConnectionStatus) => {
    return status === ConnectionStatus.Connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Người chơi
          </CardTitle>
          <Badge variant="default">
            {players.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {players.length === 0 ? (
          <div className="py-8 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-3 text-sm text-muted-foreground">
              Đang chờ người chơi tham gia...
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid gap-2 max-h-96 overflow-y-auto">
              {displayedPlayers.map((player) => (
                <Card key={player.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {player.nickname.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">
                          {player.nickname}
                        </span>
                      </div>
                      
                      {showConnectionStatus && (
                        <span className={getConnectionStatusColor(player.connectionStatus)}>
                          {getConnectionStatusIcon(player.connectionStatus)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {remainingCount > 0 && (
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground">
                  +{remainingCount} người chơi khác
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

