'use client'

import { Play } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import type { QuizSetDto } from '@/types/api'

interface QuizActionsProps {
  quizSet: QuizSetDto
  onStart: () => void
  isStarting?: boolean
}

export function QuizActions({ quizSet, onStart, isStarting = false }: QuizActionsProps) {
  const canStart = quizSet.isPublished && (quizSet.questionCount || 0) > 0

  return (
    <Card variant="secondary">
      <CardContent className="pt-6 space-y-3">
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full"
          onClick={onStart}
          disabled={!canStart || isStarting}
        >
          <Play className="mr-2 h-5 w-5" />
          {isStarting ? 'Đang khởi động...' : 'Bắt đầu ngay'}
        </Button>

        {!quizSet.isPublished && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Bạn cần xuất bản bộ trắc nghiệm trước khi bắt đầu
          </p>
        )}

        {quizSet.isPublished && (quizSet.questionCount || 0) === 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Bạn cần thêm ít nhất một câu hỏi để bắt đầu
          </p>
        )}

        {quizSet.isPublished && (quizSet.questionCount || 0) > 0 && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Sẵn sàng để bắt đầu với {quizSet.questionCount} câu hỏi
          </p>
        )}
      </CardContent>
    </Card>
  )
}
