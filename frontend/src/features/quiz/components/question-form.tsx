'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Check, X, ArrowUp, ArrowDown, AlertCircle } from 'lucide-react'
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
import { quizService } from '@/lib/api/services/quiz.service'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'

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
  // Initialize default values based on question type
  const getDefaultValues = () => {
    const baseValues = {
      content: question?.content || '',
      type: question?.type || QuestionType.SINGLE_CHOICE,
      timeLimit: question?.timeLimit || QUESTION_CONSTANTS.TIME_LIMITS.DEFAULT,
    }

    if (question?.type === QuestionType.MATCHING) {
      return {
        ...baseValues,
        matchingPairs: question?.matchingPairs || [
          { id: crypto.randomUUID(), leftContent: '', rightContent: '', displayOrder: 0 },
          { id: crypto.randomUUID(), leftContent: '', rightContent: '', displayOrder: 1 },
        ],
      }
    }

    if (question?.type === QuestionType.ORDERING) {
      return {
        ...baseValues,
        orderingItems: question?.orderingItems || [
          { id: crypto.randomUUID(), content: '', correctPosition: 0 },
          { id: crypto.randomUUID(), content: '', correctPosition: 1 },
          { id: crypto.randomUUID(), content: '', correctPosition: 2 },
        ],
      }
    }

    if (question?.type === QuestionType.VIDEO) {
      return {
        ...baseValues,
        videoUrl: question?.videoUrl || '',
        videoTimestamp: question?.videoTimestamp || 0,
        options: question?.options || [
          { content: '', isCorrect: false, displayOrder: 0 },
          { content: '', isCorrect: false, displayOrder: 1 },
        ],
      }
    }

    if (question?.type === QuestionType.AUDIO) {
      return {
        ...baseValues,
        audioUrl: question?.audioUrl || '',
        audioTimestamp: question?.audioTimestamp || 0,
        options: question?.options || [
          { content: '', isCorrect: false, displayOrder: 0 },
          { content: '', isCorrect: false, displayOrder: 1 },
        ],
      }
    }

    return {
      ...baseValues,
      options: question?.options || [
        { content: '', isCorrect: false, displayOrder: 0 },
        { content: '', isCorrect: false, displayOrder: 1 },
      ],
    }
  }

  const defaultValues = getDefaultValues()

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { control, handleSubmit, watch, setValue, formState } = form
  const type = watch('type')
  const options = watch('options') || []
  const matchingPairs = watch('matchingPairs') || []
  const orderingItems = watch('orderingItems') || []
  const videoUrl = watch('videoUrl')
  const videoTimestamp = watch('videoTimestamp')
  const audioUrl = watch('audioUrl')
  const audioTimestamp = watch('audioTimestamp')
  const timeLimit = watch('timeLimit')

  // Audio upload state
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)
  const [audioUploadError, setAudioUploadError] = useState<string | null>(null)
  const [audioUploadProgress, setAudioUploadProgress] = useState(0)

  // Handle type changes - reset type-specific data
  // Only depend on type and question to avoid infinite loop
  React.useEffect(() => {
    if (question) return // Don't reset when editing an existing question

    if ([QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE].includes(type as QuestionType)) {
      // ...existing code...
      setValue('options', [
        { content: '', isCorrect: false, displayOrder: 0 },
        { content: '', isCorrect: false, displayOrder: 1 },
      ])
      // ...existing code...
      setValue('matchingPairs', undefined)
      setValue('orderingItems', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
    } else if (type === QuestionType.MATCHING) {
      // ...existing code...
      setValue('matchingPairs', [
        { id: crypto.randomUUID(), leftContent: '', rightContent: '', displayOrder: 0 },
        { id: crypto.randomUUID(), leftContent: '', rightContent: '', displayOrder: 1 },
      ])
      // ...existing code...
      setValue('options', undefined)
      setValue('orderingItems', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
    } else if (type === QuestionType.ORDERING) {
      // ...existing code...
      setValue('orderingItems', [
        { id: crypto.randomUUID(), content: '', correctPosition: 0 },
        { id: crypto.randomUUID(), content: '', correctPosition: 1 },
        { id: crypto.randomUUID(), content: '', correctPosition: 2 },
      ])
      // ...existing code...
      setValue('options', undefined)
      setValue('matchingPairs', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
    } else if (type === QuestionType.VIDEO) {
      // Clear other data for video questions
      setValue('matchingPairs', undefined)
      setValue('orderingItems', undefined)
      setValue('audioUrl', undefined)
      setValue('audioTimestamp', undefined)
      // Initialize options and timestamp if not set (only on initial load)
      if (!question) {
        setValue('options', [
          { content: '', isCorrect: false, displayOrder: 0 },
          { content: '', isCorrect: false, displayOrder: 1 },
        ])
        if (!videoUrl) {
          setValue('videoTimestamp', 0)
        }
      }
    } else if (type === QuestionType.AUDIO) {
      // Clear other data for audio questions
      setValue('matchingPairs', undefined)
      setValue('orderingItems', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
      // Initialize options and timestamp if not set (only on initial load)
      if (!question) {
        setValue('options', [
          { content: '', isCorrect: false, displayOrder: 0 },
          { content: '', isCorrect: false, displayOrder: 1 },
        ])
        if (!audioUrl) {
          setValue('audioTimestamp', 0)
        }
      }
    }
  }, [type, question, setValue])

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
    if ([QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE, QuestionType.VIDEO, QuestionType.AUDIO].includes(formData.type as QuestionType)) {
      createData.options = formData.options?.map((opt, idx) => ({
        content: opt.content.trim(),
        isCorrect: opt.isCorrect,
        displayOrder: idx,
      })) || []
    }
    
    if (formData.type === QuestionType.MATCHING) {
      createData.matchingPairs = formData.matchingPairs?.map((pair, idx) => ({
        id: pair.id,
        leftContent: pair.leftContent.trim(),
        rightContent: pair.rightContent.trim(),
        displayOrder: idx,
      })) || []
    } else if (formData.type === QuestionType.ORDERING) {
      // Note: correctPosition is 1-based in backend (must be > 0)
      createData.orderingItems = formData.orderingItems?.map((item, idx) => ({
        id: item.id,
        content: item.content.trim(),
        correctPosition: idx + 1, // Convert from 0-based to 1-based
      })) || []
    }
    
    // Video questions need both options and video details
    // Video questions need both options and video details
    if (formData.type === QuestionType.VIDEO) {
      createData.videoUrl = formData.videoUrl?.trim() || ''
      createData.videoTimestamp = formData.videoTimestamp ?? 0
      // Options are already set above for VIDEO type
    }
    
    // Audio questions need both options and audio details
    if (formData.type === QuestionType.AUDIO) {
      createData.audioUrl = formData.audioUrl?.trim() || ''
      createData.audioTimestamp = formData.audioTimestamp ?? 0
      // Options are already set above for AUDIO type
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

  // Matching Pairs Handlers
  const handleAddMatchingPair = () => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
    if ('maxPairs' in typeInfo && matchingPairs.length < typeInfo.maxPairs) {
      const newPairs = [...matchingPairs, {
        id: crypto.randomUUID(),
        leftContent: '',
        rightContent: '',
        displayOrder: matchingPairs.length,
      }]
      setValue('matchingPairs', newPairs)
    }
  }

  const handleRemoveMatchingPair = (index: number) => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
    const minPairs = 'minPairs' in typeInfo ? typeInfo.minPairs : 2
    if (matchingPairs.length > minPairs) {
      setValue('matchingPairs', matchingPairs.filter((_, idx) => idx !== index))
    }
  }

  const canAddMatchingPair = (() => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
    return !('maxPairs' in typeInfo && matchingPairs.length >= typeInfo.maxPairs)
  })()

  const canRemoveMatchingPair = (() => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.MATCHING]
    const minPairs = 'minPairs' in typeInfo ? typeInfo.minPairs : 2
    return matchingPairs.length > minPairs
  })()

  // Ordering Items Handlers
  const handleAddOrderingItem = () => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
    if ('maxItems' in typeInfo && orderingItems.length < typeInfo.maxItems) {
      const newItems = [...orderingItems, {
        id: crypto.randomUUID(),
        content: '',
        correctPosition: orderingItems.length,
      }]
      setValue('orderingItems', newItems)
    }
  }

  const handleRemoveOrderingItem = (index: number) => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
    const minItems = 'minItems' in typeInfo ? typeInfo.minItems : 3
    if (orderingItems.length > minItems) {
      const newItems = orderingItems.filter((_, idx) => idx !== index)
      // Update correctPosition for remaining items
      const updatedItems = newItems.map((item, idx) => ({ ...item, correctPosition: idx }))
      setValue('orderingItems', updatedItems)
    }
  }

  const handleMoveOrderingItem = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === orderingItems.length - 1)) {
      return
    }

    const newItems = [...orderingItems]
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

    // Update correctPosition
    const updatedItems = newItems.map((item, idx) => ({ ...item, correctPosition: idx }))
    setValue('orderingItems', updatedItems)
  }

  const canAddOrderingItem = (() => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
    return !('maxItems' in typeInfo && orderingItems.length >= typeInfo.maxItems)
  })()

  const canRemoveOrderingItem = (() => {
    const typeInfo = QUESTION_CONSTANTS.TYPES[QuestionType.ORDERING]
    const minItems = 'minItems' in typeInfo ? typeInfo.minItems : 3
    return orderingItems.length > minItems
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

        {/* Options (for choice-based questions, video questions, and audio questions) */}
        {[QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE, QuestionType.VIDEO, QuestionType.AUDIO].includes(type as QuestionType) && (
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
                            placeholder={`Nhập lựa chọn ${String.fromCharCode(65 + index)}`}
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

            {/* Show error message if validation fails */}
            {formState.errors.options && typeof formState.errors.options.message === 'string' && (
              <p className="text-sm text-[var(--color-error)]">{formState.errors.options.message}</p>
            )}
          </FormItem>
        )}

        {/* Matching Pairs (for matching questions) */}
        {type === QuestionType.MATCHING && (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Cặp ghép <span className="text-[var(--color-error)]">*</span>
              </Label>
              <Button
                type="button"
                variant="neutral"
                size="sm"
                onClick={handleAddMatchingPair}
                disabled={!canAddMatchingPair}
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm cặp
              </Button>
            </div>

            <div className="space-y-2">
              {matchingPairs && matchingPairs.length > 0 ? (
                matchingPairs.map((pair, index) => (
                  <div key={index} className="flex items-start gap-2 rounded-lg border border-[var(--border-secondary)] p-3">
                    <Badge variant="neutral" className="mt-1 flex-shrink-0">
                      {index + 1}
                    </Badge>

                    <div className="flex flex-1 gap-2">
                      {/* Left Content */}
                      <FormField
                        control={control}
                        name={`matchingPairs.${index}.leftContent`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Nhập nội dung bên trái"
                                className={formState.errors.matchingPairs?.[index]?.leftContent ? 'border-[var(--color-error)]' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Connector */}
                      <div className="flex items-center px-2 text-[var(--text-tertiary)]">
                        ↔
                      </div>

                      {/* Right Content */}
                      <FormField
                        control={control}
                        name={`matchingPairs.${index}.rightContent`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Nhập nội dung bên phải"
                                className={formState.errors.matchingPairs?.[index]?.rightContent ? 'border-[var(--color-error)]' : ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {canRemoveMatchingPair && (
                      <Button
                        type="button"
                        variant="neutral"
                        size="icon"
                        onClick={() => handleRemoveMatchingPair(index)}
                        className="mt-1 flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : null}

              {/* Show error message if validation fails */}
              {formState.errors.matchingPairs && typeof formState.errors.matchingPairs.message === 'string' && (
                <p className="text-sm text-[var(--color-error)]">{formState.errors.matchingPairs.message}</p>
              )}
            </div>
          </FormItem>
        )}

        {/* Ordering Items (for ordering questions) */}
        {type === QuestionType.ORDERING && (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  Mục để sắp xếp <span className="text-[var(--color-error)]">*</span>
                </Label>
                <p className="text-xs text-[var(--text-tertiary)] mt-1">
                  Nhập các mục theo thứ tự đúng. Người chơi sẽ phải sắp xếp chúng theo thứ tự này.
                </p>
              </div>
              <Button
                type="button"
                variant="neutral"
                size="sm"
                onClick={handleAddOrderingItem}
                disabled={!canAddOrderingItem}
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm mục
              </Button>
            </div>

            <div className="space-y-2">
              {orderingItems && orderingItems.length > 0 ? (
                orderingItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-2 rounded-lg border border-[var(--border-secondary)] p-3">
                    <Badge variant="neutral" className="mt-1 flex-shrink-0 min-w-fit">
                      {index + 1}
                    </Badge>

                    <FormField
                      control={control}
                      name={`orderingItems.${index}.content`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Nhập mục ${index + 1}`}
                              className={formState.errors.orderingItems?.[index]?.content ? 'border-[var(--color-error)]' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-1 flex-shrink-0">
                      {/* Move Up */}
                      <Button
                        type="button"
                        variant="neutral"
                        size="icon"
                        onClick={() => handleMoveOrderingItem(index, 'up')}
                        disabled={index === 0}
                        title="Dịch lên"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>

                      {/* Move Down */}
                      <Button
                        type="button"
                        variant="neutral"
                        size="icon"
                        onClick={() => handleMoveOrderingItem(index, 'down')}
                        disabled={index === orderingItems.length - 1}
                        title="Dịch xuống"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>

                      {/* Remove */}
                      {canRemoveOrderingItem && (
                        <Button
                          type="button"
                          variant="neutral"
                          size="icon"
                          onClick={() => handleRemoveOrderingItem(index)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : null}

              {/* Show error message if validation fails */}
              {formState.errors.orderingItems && typeof formState.errors.orderingItems.message === 'string' && (
                <p className="text-sm text-[var(--color-error)]">{formState.errors.orderingItems.message}</p>
              )}
            </div>
          </FormItem>
        )}

        {/* Video Details (for video questions) */}
        {type === QuestionType.VIDEO && (
          <>
            {/* Video URL Input */}
            <FormField
              control={control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    URL Video <span className="text-[var(--color-error)]">*</span>
                  </Label>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                      className={formState.errors.videoUrl ? 'border-[var(--color-error)]' : ''}
                    />
                  </FormControl>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Hỗ trợ YouTube URLs. Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Timestamp Input */}
            <FormField
              control={control}
              name="videoTimestamp"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    Thời gian bắt đầu video (giây)
                  </Label>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      className={formState.errors.videoTimestamp ? 'border-[var(--color-error)]' : ''}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Video sẽ bắt đầu từ thời gian này (tính bằng giây). Ví dụ: 120 = 2 phút
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video Preview */}
            {videoUrl && (
              <div className="bg-[var(--bg-surface-secondary)] rounded-lg border border-[var(--border-secondary)] p-4">
                <p className="text-sm font-medium text-[var(--text-primary)] mb-2">Xem trước video:</p>
                <div className="bg-black rounded aspect-video flex items-center justify-center">
                  <p className="text-white text-sm">
                    Video preview sẽ được hiển thị tại đây
                  </p>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-2">
                  {videoUrl}
                  {videoTimestamp && videoTimestamp > 0 && ` (bắt đầu từ ${videoTimestamp}s)`}
                </p>
              </div>
            )}
          </>
        )}

        {/* Audio (for audio questions) */}
        {type === QuestionType.AUDIO && (
          <>
            {/* Audio File Upload */}
            <FormField
              control={control}
              name="audioUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    Tệp Âm thanh <span className="text-[var(--color-error)]">*</span>
                  </Label>
                  <FormControl>
                    <div className="space-y-2">
                      {!audioUrl ? (
                        <div 
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            isUploadingAudio 
                              ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-light)]/10 cursor-wait' 
                              : 'border-[var(--border-secondary)] hover:border-[var(--brand-primary)] cursor-pointer'
                          }`}
                          onClick={() => {
                            if (!isUploadingAudio) {
                              document.getElementById('audio-input')?.click()
                            }
                          }}
                        >
                          <input
                            id="audio-input"
                            type="file"
                            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/flac,audio/webm,.mp3,.wav,.ogg,.m4a,.flac,.webm"
                            className="hidden"
                            disabled={isUploadingAudio}
                            onChange={async (e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setIsUploadingAudio(true)
                                setAudioUploadError(null)
                                setAudioUploadProgress(0)

                                try {
                                  // Validate file size (max 20MB)
                                  const maxSize = 20 * 1024 * 1024 // 20MB
                                  if (file.size > maxSize) {
                                    throw new Error('Kích thước file không được vượt quá 20MB')
                                  }

                                  // Simulate progress (since we don't have real progress from API)
                                  const progressInterval = setInterval(() => {
                                    setAudioUploadProgress((prev) => {
                                      if (prev >= 90) {
                                        clearInterval(progressInterval)
                                        return 90
                                      }
                                      return prev + 10
                                    })
                                  }, 200)

                                  // Upload file to Cloudinary via backend
                                  const uploadedAudioUrl = await quizService.uploadAudio(file)
                                  
                                  clearInterval(progressInterval)
                                  setAudioUploadProgress(100)
                                  
                                  // Small delay to show 100% progress
                                  await new Promise(resolve => setTimeout(resolve, 300))
                                  
                                  field.onChange(uploadedAudioUrl)
                                  setAudioUploadError(null)
                                } catch (error) {
                                  console.error('Upload error:', error)
                                  const errorMessage = error instanceof Error 
                                    ? error.message 
                                    : 'Tải âm thanh lên thất bại. Vui lòng thử lại.'
                                  setAudioUploadError(errorMessage)
                                  setAudioUploadProgress(0)
                                } finally {
                                  setIsUploadingAudio(false)
                                  // Reset progress after a delay
                                  setTimeout(() => setAudioUploadProgress(0), 500)
                                }
                              }
                            }}
                          />
                          {isUploadingAudio ? (
                            <div className="space-y-3">
                              <LoadingSpinner size="md" className="mx-auto" />
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                  Đang tải lên...
                                </p>
                                {/* Progress Bar */}
                                <div className="w-full bg-[var(--bg-surface-secondary)] rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] transition-all duration-300 ease-out"
                                    style={{ width: `${audioUploadProgress}%` }}
                                  />
                                </div>
                                <p className="text-xs text-[var(--text-secondary)]">
                                  {audioUploadProgress}% hoàn thành
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-[var(--text-primary)]">
                                Nhấp để chọn tệp âm thanh
                              </p>
                              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                                Hỗ trợ: MP3, WAV, OGG, M4A, FLAC, WebM (tối đa 20MB)
                              </p>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[var(--bg-surface-secondary)] rounded-lg border border-[var(--border-secondary)] p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-[var(--text-primary)]">
                              Tệp đã tải lên
                            </p>
                            <Button
                              type="button"
                              variant="neutral"
                              size="sm"
                              onClick={() => field.onChange('')}
                            >
                              Thay đổi
                            </Button>
                          </div>
                          <audio
                            controls
                            className="w-full mt-2"
                          >
                            <source src={audioUrl} />
                            Trình duyệt của bạn không hỗ trợ phát âm thanh HTML5.
                          </audio>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {audioUploadError && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle className="size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                              Lỗi tải lên
                            </p>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                              {audioUploadError}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="neutral"
                            size="icon"
                            className="size-6 shrink-0"
                            onClick={() => setAudioUploadError(null)}
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Audio Timestamp Input */}
            <FormField
              control={control}
              name="audioTimestamp"
              render={({ field }) => (
                <FormItem>
                  <Label>
                    Thời gian bắt đầu âm thanh (giây)
                  </Label>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      className={formState.errors.audioTimestamp ? 'border-[var(--color-error)]' : ''}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Âm thanh sẽ bắt đầu từ thời gian này (tính bằng giây). Ví dụ: 120 = 2 phút
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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
