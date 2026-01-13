'use client'

import { Loader2, Users, Clock, Gamepad2 } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { GAME_PLAYER_CONSTANTS } from '../constants'

interface PlayerWaitingProps {
  nickname: string
  pin: string
  playerCount?: number
  message?: string
  className?: string
}

export function PlayerWaiting({
  nickname,
  pin,
  playerCount = 0,
  message = GAME_PLAYER_CONSTANTS.MESSAGES.WAITING_FOR_HOST,
  className = '',
}: Readonly<PlayerWaitingProps>) {
  const formattedPin = pin.match(/.{1,3}/g)?.join(' ') || pin

  return (
    <div className={`flex flex-col items-center justify-center min-h-[60vh] ${className}`}>
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8 space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Xin chào</p>
            <h2 className="font-heading text-2xl font-bold">
              {nickname}
            </h2>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Badge variant="default">
              <Gamepad2 />
              {formattedPin}
            </Badge>
            {playerCount > 0 && (
              <Badge variant="outline">
                <Users />
                {playerCount} người
              </Badge>
            )}
          </div>

          <div className="flex flex-col items-center gap-3 pt-4 border-t">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Giữ màn hình sáng và đảm bảo kết nối internet ổn định để không bỏ lỡ câu hỏi!</p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

