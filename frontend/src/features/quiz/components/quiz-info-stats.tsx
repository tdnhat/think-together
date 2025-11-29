'use client'

import { User, HelpCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import type { QuizSetDto } from '@/types/api'

interface QuizInfoStatsProps {
  quizSet: QuizSetDto
}

export function QuizInfoStats({ quizSet }: QuizInfoStatsProps) {
  return (
    <Card variant="secondary">
      <CardHeader>
        <CardTitle className="text-lg">Thông tin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Questions Count */}
        <div className="flex items-center justify-between border-b border-dashed border-[var(--color-border-light)] pb-4">
          <div className="flex items-center text-[var(--text-secondary)]">
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Số câu hỏi</span>
          </div>
          <span className="font-bold text-lg text-[var(--brand-primary)]">
            {quizSet.questionCount || 0}
          </span>
        </div>

        {/* Creator */}
        <div className="flex items-center justify-between border-b border-dashed border-[var(--color-border-light)] pb-4">
          <div className="flex items-center text-[var(--text-secondary)]">
            <User className="mr-2 h-4 w-4" />
            <span>Tác giả</span>
          </div>
          <span className="font-bold truncate max-w-[150px]">
            {quizSet.creatorName || 'Ẩn danh'}
          </span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-[var(--text-secondary)]">
            <Clock className="mr-2 h-4 w-4" />
            <span>Cập nhật cuối</span>
          </div>
          <span className="font-bold text-sm">
            {format(new Date(quizSet.updatedAt), 'dd/MM/yyyy', { locale: vi })}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
