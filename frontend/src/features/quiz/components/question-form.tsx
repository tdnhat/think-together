'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Check, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { Input } from '@/shared/ui/input'
import { createQuestionSchema, type CreateQuestionFormData } from '@/lib/validators'
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
  const defaultValues = {
    content: question?.content || '',
    type: question?.type || QuestionType.SINGLE_CHOICE,
    timeLimit: question?.timeLimit || QUESTION_CONSTANTS.TIME_LIMITS.DEFAULT,
    options: question?.options || [
      { content: '', isCorrect: false, displayOrder: 0 },
      { content: '', isCorrect: false, displayOrder: 1 },
    ],
  }

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { control, handleSubmit, watch, setValue } = form
  const type = watch('type')
  const options = watch('options') || []
  const timeLimit = watch('timeLimit')

  const handleFormSubmit = async (formData: CreateQuestionFormData) => {
    const createData: CreateQuestionRequest = {
      ...(question?.id && { id: question.id }),
      quizSetId,
      content: formData.content.trim(),
      type: formData.type as QuestionType,
      timeLimit: formData.timeLimit,
      displayOrder: question?.displayOrder || 0,
    }

    // Add type-specific data
    if ([QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE].includes(formData.type as QuestionType)) {
      createData.options = formData.options?.map((opt, idx) => ({
        content: opt.content.trim(),
        isCorrect: opt.isCorrect,
        displayOrder: idx,
      })) || []
    }

    await onSubmit(createData)
  }

  const handleAddOption = () => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[type as QuestionType]
    if ('maxOptions' in typeInfo && options.length < typeInfo.maxOptions) {
      const newOptions = [...(options || []), { content: '', isCorrect: false, displayOrder: (options?.length || 0) }]
      setValue('options', newOptions)
    }
  }

  const handleRemoveOption = (index: number) => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[type as QuestionType]
    const minOptions = 'minOptions' in typeInfo ? typeInfo.minOptions : 2
    if (options && options.length > minOptions) {
      setValue('options', options.filter((_, idx) => idx !== index))
    }
  }

  const handleOptionChange = (index: number, field: 'content' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...(options || [])]

    if (field === 'isCorrect' && type === QuestionType.SINGLE_CHOICE) {
      // For single choice, only one option can be correct
      newOptions.forEach((opt, idx) => {
        opt.isCorrect = idx === index
      })
    } else {
      newOptions[index] = { ...newOptions[index], [field]: value }
    }

    setValue('options', newOptions)
  }

  const canAddOption = (() => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[type as QuestionType]
    return !('maxOptions' in typeInfo && options && options.length >= typeInfo.maxOptions)
  })()

  const canRemoveOption = (() => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[type as QuestionType]
    const minOptions = 'minOptions' in typeInfo ? typeInfo.minOptions : 2
    return options && options.length > minOptions
  })()

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Question Type */}
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Label>Loại câu hỏi</Label>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange} disabled={!!question}>
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
              </FormControl>
              <p className="text-xs text-[var(--text-tertiary)]">
                {QUESTION_CONSTANTS.TYPES[type as QuestionType].description}
              </p>
            </FormItem>
          )}
        />

        {/* Question Content */}
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <Label>
                Nội dung câu hỏi <span className="text-[var(--color-error)]">*</span>
              </Label>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Nhập nội dung câu hỏi..."
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Time Limit */}
        <FormField
          control={control}
          name="timeLimit"
          render={({ field }) => (
            <FormItem>
              <Label>
                Thời gian giới hạn (giây) <span className="text-[var(--color-error)]">*</span>
              </Label>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type="number"
                    min={QUESTION_CONSTANTS.TIME_LIMITS.MIN}
                    max={QUESTION_CONSTANTS.TIME_LIMITS.MAX}
                    className="w-32"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <div className="flex flex-wrap gap-2">
                  {QUESTION_CONSTANTS.TIME_LIMITS.PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant="neutral"
                      size="sm"
                      onClick={() => field.onChange(preset)}
                      className={timeLimit === preset ? 'border-[var(--brand-primary)]' : ''}
                    >
                      {preset}s
                    </Button>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Options (for choice-based questions) */}
        {[QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE].includes(type as QuestionType) && (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Các lựa chọn <span className="text-[var(--color-error)]">*</span>
              </Label>
              {type !== QuestionType.TRUE_FALSE && (
                <Button
                  type="button"
                  variant="neutral"
                  size="sm"
                  onClick={handleAddOption}
                  disabled={!canAddOption}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm lựa chọn
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {options && options.length > 0 ? (
                options.map((option, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="neutral" className="mt-2 flex-shrink-0">
                      {String.fromCharCode(65 + index)}
                    </Badge>

                    <FormField
                      control={control}
                      name={`options.${index}.content`}
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`}
                            className="flex-1"
                          />
                        </FormControl>
                      )}
                    />

                    <Controller
                      control={control}
                      name={`options.${index}.isCorrect`}
                      render={({ field }) => (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant={field.value ? 'default' : 'neutral'}
                                size="icon"
                                onClick={() => field.onChange(!field.value)}
                              >
                                {field.value ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {field.value ? 'Đáp án đúng' : 'Đánh dấu là đáp án đúng'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    />

                    {canRemoveOption && type !== QuestionType.TRUE_FALSE && (
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
                ))
              ) : null}
            </div>
          </FormItem>
        )}

        {/* Form Actions */}
        <div className="space-y-4 pt-4">
          <Separator />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="neutral" onClick={onCancel} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" variant="default" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : question ? 'Cập nhật' : 'Tạo câu hỏi'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
