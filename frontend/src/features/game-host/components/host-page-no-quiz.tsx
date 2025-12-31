/**
 * Host Page No Quiz Component
 * 
 * Shown when no quiz is selected and no active session exists.
 */

'use client'

import { Gamepad2, Play, RefreshCw, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'
import { GAME_HOST_CONSTANTS } from '../constants'
import { useState } from 'react'

interface HostPageNoQuizProps {
  error: string | null
  onRejoinByPin: (pin: string) => void
}

export function HostPageNoQuiz({ error, onRejoinByPin }: HostPageNoQuizProps) {
  const router = useRouter()
  const [rejoinPin, setRejoinPin] = useState('')

  const handleSelectQuiz = () => {
    router.push(ROUTES.quiz.list)
  }

  const handleRejoin = () => {
    if (rejoinPin.length === GAME_HOST_CONSTANTS.PIN_DISPLAY.PIN_LENGTH) {
      onRejoinByPin(rejoinPin)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Gamepad2 className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-center">Tổ chức trò chơi</CardTitle>
          <CardDescription className="text-center">
            Chọn bộ câu hỏi để tạo phiên mới hoặc nhập mã PIN để kết nối lại
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Select Quiz Option */}
          <Button variant="default" onClick={handleSelectQuiz} className="w-full gap-2">
            <Play className="h-5 w-5" />
            Chọn bộ câu hỏi
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                hoặc kết nối lại
              </span>
            </div>
          </div>

          {/* Rejoin by PIN */}
          <div className="space-y-3">
            <Label htmlFor="rejoin-pin">Mã PIN phiên trò chơi</Label>
            <div className="flex gap-2">
              <Input
                id="rejoin-pin"
                type="text"
                inputMode="numeric"
                maxLength={GAME_HOST_CONSTANTS.PIN_DISPLAY.PIN_LENGTH}
                placeholder="000000"
                value={rejoinPin}
                onChange={(e) => setRejoinPin(e.target.value.replaceAll(/\D/g, ''))}
                className="text-center text-xl tracking-widest font-bold"
              />
              <Button
                variant="outline"
                onClick={handleRejoin}
                disabled={rejoinPin.length !== GAME_HOST_CONSTANTS.PIN_DISPLAY.PIN_LENGTH}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

