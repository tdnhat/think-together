'use client'

import { BookOpen } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import type { QuizSetDto } from '@/types/api'

interface QuizSetSelectorProps {
  quizSets: QuizSetDto[]
  selectedQuizSetId?: string
  onQuizSetChange: (quizSetId: string | undefined) => void
  className?: string
}

export function QuizSetSelector({
  quizSets,
  selectedQuizSetId,
  onQuizSetChange,
  className = '',
}: QuizSetSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <BookOpen className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedQuizSetId || 'all'}
        onValueChange={(value) => {
          onQuizSetChange(value === 'all' ? undefined : value)
        }}
      >
        <SelectTrigger className="w-[200px] md:w-[250px]">
          <SelectValue placeholder="Chọn bộ câu hỏi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả bộ câu hỏi</SelectItem>
          {quizSets.map((quizSet) => (
            <SelectItem key={quizSet.id} value={quizSet.id}>
              {quizSet.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
