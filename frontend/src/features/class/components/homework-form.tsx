'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { useQuizSets } from '@/features/quiz/hooks'
import { CLASS_CONSTANTS } from '../constants'
import type { HomeworkDto, CreateHomeworkRequest, UpdateHomeworkRequest } from '../types'

interface HomeworkFormProps {
  classId: string
  homework?: HomeworkDto | null
  onSubmit: (data: CreateHomeworkRequest | UpdateHomeworkRequest) => void | Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
}

export function HomeworkForm({
  classId,
  homework,
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}: Readonly<HomeworkFormProps>) {
  const { quizSets, isLoadingQuizSets } = useQuizSets({
    page: 1,
    pageSize: 100, // Get all quiz sets for the dropdown
  })
  const [title, setTitle] = useState(homework?.title || '')
  const [quizSetId, setQuizSetId] = useState(homework?.quizSetId || '')
  const [dueDate, setDueDate] = useState(
    homework?.dueDate ? new Date(homework.dueDate).toISOString().slice(0, 16) : ''
  )

  useEffect(() => {
    if (homework) {
      setTitle(homework.title)
      setQuizSetId(homework.quizSetId)
      setDueDate(
        homework.dueDate ? new Date(homework.dueDate).toISOString().slice(0, 16) : ''
      )
    }
  }, [homework])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data: CreateHomeworkRequest | UpdateHomeworkRequest = {
      classId,
      quizSetId,
      title: title.trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    }

    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {homework ? 'Chỉnh sửa bài tập về nhà' : 'Tạo bài tập về nhà mới'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Bài tập về nhà tuần 1"
              maxLength={255}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Quiz Set */}
          <div className="space-y-2">
            <Label htmlFor="quizSetId">
              Bộ câu hỏi <span className="text-red-500">*</span>
            </Label>
            {isLoadingQuizSets ? (
              <div className="h-10 w-full animate-pulse rounded-md bg-[var(--bg-surface-secondary)]" />
            ) : (
              <Select
                value={quizSetId}
                onValueChange={setQuizSetId}
                disabled={isSubmitting || !!homework}
                required
              >
                <SelectTrigger id="quizSetId">
                  <SelectValue placeholder="Chọn bộ câu hỏi" />
                </SelectTrigger>
                <SelectContent>
                  {quizSets && quizSets.length > 0 ? (
                    quizSets.map((quizSet) => (
                      <SelectItem key={quizSet.id} value={quizSet.id}>
                        {quizSet.title}
                        {!quizSet.isPublished && (
                          <span className="ml-2 text-xs text-[var(--text-tertiary)]">
                            (Nháp)
                          </span>
                        )}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-[var(--text-secondary)]">
                      Không có bộ câu hỏi nào
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
            {!isLoadingQuizSets && (!quizSets || quizSets.length === 0) && (
              <p className="text-xs text-[var(--text-secondary)]">
                Bạn cần tạo ít nhất một bộ câu hỏi trước khi tạo bài tập về nhà
              </p>
            )}
            {homework && (
              <p className="text-xs text-[var(--text-secondary)]">
                Không thể thay đổi bộ câu hỏi sau khi đã tạo bài tập
              </p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Hạn nộp bài</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-[var(--text-secondary)]">
              Để trống nếu không có hạn nộp
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !quizSetId}
              className="flex-1"
            >
              {isSubmitting ? 'Đang lưu...' : homework ? 'Cập nhật' : 'Tạo bài tập'}
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
