'use client'

import { useState, useRef, useEffect } from 'react'
import { Gamepad2, User, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { GAME_PLAYER_CONSTANTS } from '../constants'

interface JoinFormProps {
  initialPin?: string
  onJoin: (pin: string, nickname: string) => Promise<void>
  isLoading?: boolean
  error?: string | null
  className?: string
}

export function JoinForm({
  initialPin = '',
  onJoin,
  isLoading = false,
  error,
  className = '',
}: Readonly<JoinFormProps>) {
  const [pin, setPin] = useState(initialPin)
  const [nickname, setNickname] = useState('')
  const [pinError, setPinError] = useState<string | null>(null)
  const [nicknameError, setNicknameError] = useState<string | null>(null)
  
  const pinInputRef = useRef<HTMLInputElement>(null)
  const nicknameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialPin) {
      nicknameInputRef.current?.focus()
    } else {
      pinInputRef.current?.focus()
    }
  }, [initialPin])

  const validatePin = (value: string): boolean => {
    if (!value) {
      setPinError('Vui lòng nhập mã PIN')
      return false
    }
    if (!GAME_PLAYER_CONSTANTS.VALIDATION.PIN_PATTERN.test(value)) {
      setPinError(GAME_PLAYER_CONSTANTS.ERRORS.INVALID_PIN)
      return false
    }
    setPinError(null)
    return true
  }

  const validateNickname = (value: string): boolean => {
    const trimmed = value.trim()
    if (!trimmed) {
      setNicknameError(GAME_PLAYER_CONSTANTS.ERRORS.NICKNAME_REQUIRED)
      return false
    }
    if (trimmed.length < GAME_PLAYER_CONSTANTS.VALIDATION.NICKNAME_MIN_LENGTH) {
      setNicknameError(`Tên phải có ít nhất ${GAME_PLAYER_CONSTANTS.VALIDATION.NICKNAME_MIN_LENGTH} ký tự`)
      return false
    }
    if (trimmed.length > GAME_PLAYER_CONSTANTS.VALIDATION.NICKNAME_MAX_LENGTH) {
      setNicknameError(`Tên không được quá ${GAME_PLAYER_CONSTANTS.VALIDATION.NICKNAME_MAX_LENGTH} ký tự`)
      return false
    }
    setNicknameError(null)
    return true
  }

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setPin(value)
    if (value.length === 6) {
      validatePin(value)
      nicknameInputRef.current?.focus()
    } else {
      setPinError(null)
    }
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNickname(value)
    if (nicknameError && value.trim().length >= GAME_PLAYER_CONSTANTS.VALIDATION.NICKNAME_MIN_LENGTH) {
      setNicknameError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isPinValid = validatePin(pin)
    const isNicknameValid = validateNickname(nickname)
    
    if (!isPinValid || !isNicknameValid) {
      return
    }

    await onJoin(pin, nickname.trim())
  }

  return (
    <Card className={`max-w-md w-full mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Gamepad2 className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Tham gia trò chơi</CardTitle>
        <CardDescription>
          Nhập mã PIN và tên của bạn để tham gia
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PIN Input */}
          <div className="space-y-2">
            <Label htmlFor="pin" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Mã PIN
            </Label>
            <Input
              ref={pinInputRef}
              id="pin"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              value={pin}
              onChange={handlePinChange}
              placeholder="000000"
              className={`text-center text-3xl tracking-[0.5em] font-heading font-bold h-16 ${
                pinError ? 'border-destructive' : ''
              }`}
              disabled={isLoading}
            />
            {pinError && (
              <p className="text-sm text-destructive">{pinError}</p>
            )}
          </div>

          {/* Nickname Input */}
          <div className="space-y-2">
            <Label htmlFor="nickname" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Tên của bạn
            </Label>
            <Input
              ref={nicknameInputRef}
              id="nickname"
              type="text"
              value={nickname}
              onChange={handleNicknameChange}
              placeholder="Nhập tên hiển thị..."
              className={`h-12 text-lg ${
                nicknameError ? 'border-destructive' : ''
              }`}
              maxLength={GAME_PLAYER_CONSTANTS.VALIDATION.NICKNAME_MAX_LENGTH}
              disabled={isLoading}
            />
            {nicknameError && (
              <p className="text-sm text-destructive">{nicknameError}</p>
            )}
          </div>

          {/* Error from server */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full gap-2"
            disabled={isLoading || !pin || !nickname.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {GAME_PLAYER_CONSTANTS.MESSAGES.JOINING}
              </>
            ) : (
              <>
                Tham gia
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

