'use client'

import { useState } from 'react'
import { Plus, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Badge } from '@/shared/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { QuestionType, type QuestionDto, type CreateQuestionRequest } from '@/types/api'
import { QUESTION_CONSTANTS } from '../constants'

interface QuestionFormProps {
  question?: QuestionDto | null
  quizSetId: string
  onSubmit: (data: CreateQuestionRequest) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function QuestionForm({
  question,
  quizSetId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: QuestionFormProps) {
  const [content, setContent] = useState(question?.content || '')
  const [type, setType] = useState<QuestionType>(question?.type || QuestionType.SINGLE_CHOICE)
  const [timeLimit, setTimeLimit] = useState(question?.timeLimit || QUESTION_CONSTANTS.TIME_LIMITS.DEFAULT)
  const [options, setOptions] = useState(
    question?.options || [
      { content: '', isCorrect: false, displayOrder: 0 },
      { content: '', isCorrect: false, displayOrder: 1 },
    ]
  )

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!content.trim()) {
      newErrors.content = QUESTION_CONSTANTS.VALIDATION.CONTENT_REQUIRED
    } else if (content.length > QUESTION_CONSTANTS.LIMITS.CONTENT_MAX_LENGTH) {
      newErrors.content = QUESTION_CONSTANTS.VALIDATION.CONTENT_TOO_LONG
    }

    if (timeLimit < QUESTION_CONSTANTS.TIME_LIMITS.MIN || timeLimit > QUESTION_CONSTANTS.TIME_LIMITS.MAX) {
      newErrors.timeLimit = QUESTION_CONSTANTS.VALIDATION.TIME_LIMIT_INVALID
    }

    // Validate options for choice-based questions
    if ([QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE].includes(type)) {
      const typeInfo = QUESTION_CONSTANTS.TYPES[type]
      
      if ('minOptions' in typeInfo && 'maxOptions' in typeInfo) {
        if (options.length < typeInfo.minOptions) {
          newErrors.options = QUESTION_CONSTANTS.VALIDATION.OPTIONS_MIN.replace('{min}', String(typeInfo.minOptions))
        }
        
        if (options.length > typeInfo.maxOptions) {
          newErrors.options = QUESTION_CONSTANTS.VALIDATION.OPTIONS_MAX.replace('{max}', String(typeInfo.maxOptions))
        }
      }

      const hasCorrectAnswer = options.some((opt) => opt.isCorrect)
      if (!hasCorrectAnswer) {
        newErrors.options = QUESTION_CONSTANTS.VALIDATION.NO_CORRECT_ANSWER
      }

      options.forEach((opt, idx) => {
        if (!opt.content.trim()) {
          newErrors[`option-${idx}`] = QUESTION_CONSTANTS.VALIDATION.OPTION_CONTENT_REQUIRED
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const formData: CreateQuestionRequest = {
      quizSetId,
      content: content.trim(),
      type,
      timeLimit,
      displayOrder: question?.displayOrder || 0,
    }

    // Add type-specific data
    if ([QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE].includes(type)) {
      formData.options = options.map((opt, idx) => ({
        content: opt.content.trim(),
        isCorrect: opt.isCorrect,
        displayOrder: idx,
      }))
    }

    await onSubmit(formData)
  }

  const handleAddOption = () => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[type]
    if ('maxOptions' in typeInfo && options.length < typeInfo.maxOptions) {
      setOptions([...options, { content: '', isCorrect: false, displayOrder: options.length }])
    }
  }

  const handleRemoveOption = (index: number) => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[type]
    const minOptions = 'minOptions' in typeInfo ? typeInfo.minOptions : 2
    if (options.length > minOptions) {
      setOptions(options.filter((_, idx) => idx !== index))
    }
  }

  const handleOptionChange = (index: number, field: 'content' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...options]
    
    if (field === 'isCorrect' && type === QuestionType.SINGLE_CHOICE) {
      // For single choice, only one option can be correct
      newOptions.forEach((opt, idx) => {
        opt.isCorrect = idx === index
      })
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value }
    }
    
    setOptions(newOptions)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Question Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Loại câu hỏi</Label>
        <Select value={type} onValueChange={(value) => setType(value as QuestionType)} disabled={!!question}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại câu hỏi" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(QUESTION_CONSTANTS.TYPES).map(([value, info]) => (
              <SelectItem key={value} value={value}>
                {info.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-[var(--text-tertiary)]">
          {QUESTION_CONSTANTS.TYPES[type].description}
        </p>
      </div>

      {/* Question Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Nội dung câu hỏi *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung câu hỏi..."
          rows={3}
          className={errors.content ? 'border-[var(--color-error)]' : ''}
        />
        {errors.content && (
          <p className="text-xs text-[var(--color-error)]">{errors.content}</p>
        )}
      </div>

      {/* Time Limit */}
      <div className="space-y-2">
        <Label htmlFor="timeLimit">Thời gian giới hạn (giây) *</Label>
        <div className="flex gap-2">
          <Input
            id="timeLimit"
            type="number"
            min={QUESTION_CONSTANTS.TIME_LIMITS.MIN}
            max={QUESTION_CONSTANTS.TIME_LIMITS.MAX}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className={`w-32 ${errors.timeLimit ? 'border-[var(--color-error)]' : ''}`}
          />
          <div className="flex flex-wrap gap-2">
            {QUESTION_CONSTANTS.TIME_LIMITS.PRESETS.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="neutral"
                size="sm"
                onClick={() => setTimeLimit(preset)}
                className={timeLimit === preset ? 'border-[var(--brand-primary)]' : ''}
              >
                {preset}s
              </Button>
            ))}
          </div>
        </div>
        {errors.timeLimit && (
          <p className="text-xs text-[var(--color-error)]">{errors.timeLimit}</p>
        )}
      </div>

      {/* Options (for choice-based questions) */}
      {[QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE].includes(type) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Các lựa chọn *</Label>
            {type !== QuestionType.TRUE_FALSE && (
              <Button
                type="button"
                variant="neutral"
                size="sm"
                onClick={handleAddOption}
                disabled={(() => {
                  const typeInfo = QUESTION_CONSTANTS.TYPES[type]
                  return 'maxOptions' in typeInfo && options.length >= typeInfo.maxOptions
                })()}
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm lựa chọn
              </Button>
            )}
          </div>

          {errors.options && (
            <p className="text-xs text-[var(--color-error)]">{errors.options}</p>
          )}

          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-start gap-2">
                <Badge variant="neutral" className="mt-2 flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </Badge>
                
                <Input
                  value={option.content}
                  onChange={(e) => handleOptionChange(index, 'content', e.target.value)}
                  placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                  className={`flex-1 ${errors[`option-${index}`] ? 'border-[var(--color-error)]' : ''}`}
                />

                <Button
                  type="button"
                  variant={option.isCorrect ? 'default' : 'neutral'}
                  size="icon"
                  onClick={() => handleOptionChange(index, 'isCorrect', !option.isCorrect)}
                  title={option.isCorrect ? 'Đáp án đúng' : 'Đánh dấu là đáp án đúng'}
                >
                  {option.isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </Button>

                {type !== QuestionType.TRUE_FALSE && (() => {
                  const typeInfo = QUESTION_CONSTANTS.TYPES[type]
                  const minOptions = 'minOptions' in typeInfo ? typeInfo.minOptions : 2
                  return options.length > minOptions
                })() && (
                  <Button
                    type="button"
                    variant="neutral"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border-light)]">
        <Button type="button" variant="neutral" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : question ? 'Cập nhật' : 'Tạo câu hỏi'}
        </Button>
      </div>
    </form>
  )
}

