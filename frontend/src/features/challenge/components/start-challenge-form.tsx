'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { CHALLENGE_CONSTANTS } from '@/features/challenge/constants'
import type { ChallengeDto } from '@/features/challenge/types'

interface StartChallengeFormProps {
  challenge: ChallengeDto
  isLoading?: boolean
  onSubmit: (nickname: string) => void
  className?: string
}

export function StartChallengeForm({
  challenge,
  isLoading = false,
  onSubmit,
  className = '',
}: StartChallengeFormProps) {
  const [nickname, setNickname] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!nickname.trim()) {
      newErrors.nickname = 'Vui lòng nhập tên của bạn'
    } else if (nickname.length > CHALLENGE_CONSTANTS.LIMITS.NICKNAME_MAX_LENGTH) {
      newErrors.nickname = `Tên không được vượt quá ${CHALLENGE_CONSTANTS.LIMITS.NICKNAME_MAX_LENGTH} ký tự`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(nickname)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{challenge.title}</CardTitle>
        {challenge.description && (
          <CardDescription className="whitespace-pre-wrap">{challenge.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">Tên của bạn</Label>
            <Input
              id="nickname"
              type="text"
              placeholder={CHALLENGE_CONSTANTS.PLACEHOLDERS.NICKNAME}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
              maxLength={CHALLENGE_CONSTANTS.LIMITS.NICKNAME_MAX_LENGTH}
              className={errors.nickname ? 'border-red-500' : ''}
            />
            {errors.nickname && (
              <p className="text-sm text-red-500">{errors.nickname}</p>
            )}
            <p className="text-xs text-[var(--text-secondary)]">
              {nickname.length}/{CHALLENGE_CONSTANTS.LIMITS.NICKNAME_MAX_LENGTH}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !nickname.trim()}
            className="w-full"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isLoading ? 'Đang bắt đầu...' : 'Bắt đầu thử thách'}
          </Button>
        </form>

        {/* Info text */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p>
            Lưu ý: Tên của bạn sẽ được hiển thị trên bảng xếp hạng nếu bạn hoàn thành thử thách.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

