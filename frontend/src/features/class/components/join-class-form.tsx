'use client'

import { useState } from 'react'
import { KeyRound } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { CLASS_CONSTANTS } from '../constants'

interface JoinClassFormProps {
  onSubmit: (joinCode: string) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
}

export function JoinClassForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: Readonly<JoinClassFormProps>) {
  const [joinCode, setJoinCode] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCode = joinCode.trim().toUpperCase()
    if (trimmedCode.length === CLASS_CONSTANTS.LIMITS.JOIN_CODE_LENGTH) {
      await onSubmit(trimmedCode)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length <= CLASS_CONSTANTS.LIMITS.JOIN_CODE_LENGTH) {
      setJoinCode(value)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5" />
            Tham gia lớp học
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinCode">
              Mã tham gia <span className="text-red-500">*</span>
            </Label>
            <Input
              id="joinCode"
              value={joinCode}
              onChange={handleCodeChange}
              placeholder={CLASS_CONSTANTS.PLACEHOLDERS.JOIN_CODE}
              maxLength={CLASS_CONSTANTS.LIMITS.JOIN_CODE_LENGTH}
              className="font-mono text-center text-lg tracking-wider"
              required
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-[var(--text-secondary)]">
              Nhập mã tham gia 8 ký tự do giáo viên cung cấp
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || joinCode.length !== CLASS_CONSTANTS.LIMITS.JOIN_CODE_LENGTH}
              className="flex-1"
            >
              {isSubmitting ? 'Đang tham gia...' : 'Tham gia lớp học'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="neutral"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
