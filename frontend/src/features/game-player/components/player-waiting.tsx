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
          {/* Animated Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-[var(--brand-primary)]/20 animate-ping" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--brand-primary)]/10">
              <Gamepad2 className="h-12 w-12 text-[var(--brand-primary)] animate-pulse" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">Xin chào</p>
            <h2 className="font-heading text-3xl font-bold text-[var(--text-primary)]">
              {nickname}
            </h2>
          </div>

          {/* Game Info */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="default" className="gap-1.5">
              <Gamepad2 className="h-4 w-4" />
              {formattedPin}
            </Badge>
            {playerCount > 0 && (
              <Badge variant="outline" className="gap-1.5">
                <Users className="h-4 w-4" />
                {playerCount} người
              </Badge>
            )}
          </div>

          {/* Waiting Status */}
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-border-light)]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
            <p className="text-[var(--text-secondary)]">{message}</p>
          </div>

          {/* Tips */}
          <div className="text-sm text-[var(--text-tertiary)] bg-[var(--bg-surface-secondary)] rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>Giữ màn hình sáng và đảm bảo kết nối internet ổn định để không bỏ lỡ câu hỏi!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

