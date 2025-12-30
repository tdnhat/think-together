'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { Form } from '@/shared/ui/form'
import { createQuestionSchema, type CreateQuestionFormData } from '@/lib/validators'
import { QuestionType, type QuestionDto, type CreateQuestionRequest } from '@/types/api'
import { QUESTION_CONSTANTS } from '../constants'

import { QuestionTypeSelect } from './question-form/question-type-select'
import { CommonFields } from './question-form/common-fields'
import { OptionsFields } from './question-form/options-fields'
import { MatchingFields } from './question-form/matching-fields'
import { OrderingFields } from './question-form/ordering-fields'
import { VideoFields } from './question-form/video-fields'
import { AudioFields } from './question-form/audio-fields'

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

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  })

  // Watch type to handle conditional rendering and resets
  const type = form.watch('type') as QuestionType
  const { setValue } = form

  // Handle type changes - reset type-specific data
  React.useEffect(() => {
    if (question) return // Don't reset when editing an existing question

    const currentType = type as QuestionType

    if ([QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE].includes(currentType)) {
      setValue('options', [
        { content: '', isCorrect: false, displayOrder: 0 },
        { content: '', isCorrect: false, displayOrder: 1 },
      ])
      setValue('matchingPairs', undefined)
      setValue('orderingItems', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
      setValue('audioUrl', undefined)
      setValue('audioTimestamp', undefined)
    } else if (currentType === QuestionType.MATCHING) {
      setValue('matchingPairs', [
        { id: crypto.randomUUID(), leftContent: '', rightContent: '', displayOrder: 0 },
        { id: crypto.randomUUID(), leftContent: '', rightContent: '', displayOrder: 1 },
      ])
      setValue('options', undefined)
      setValue('orderingItems', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
      setValue('audioUrl', undefined)
      setValue('audioTimestamp', undefined)
    } else if (currentType === QuestionType.ORDERING) {
      setValue('orderingItems', [
        { id: crypto.randomUUID(), content: '', correctPosition: 0 },
        { id: crypto.randomUUID(), content: '', correctPosition: 1 },
        { id: crypto.randomUUID(), content: '', correctPosition: 2 },
      ])
      setValue('options', undefined)
      setValue('matchingPairs', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
      setValue('audioUrl', undefined)
      setValue('audioTimestamp', undefined)
    } else if (currentType === QuestionType.VIDEO) {
      setValue('matchingPairs', undefined)
      setValue('orderingItems', undefined)
      setValue('audioUrl', undefined)
      setValue('audioTimestamp', undefined)
      // Initialize options and timestamp if not set
      if (!question) {
        setValue('options', [
          { content: '', isCorrect: false, displayOrder: 0 },
          { content: '', isCorrect: false, displayOrder: 1 },
        ])
        const currentVideoUrl = form.getValues('videoUrl')
        if (!currentVideoUrl) {
          setValue('videoTimestamp', 0)
        }
      }
    } else if (currentType === QuestionType.AUDIO) {
      setValue('matchingPairs', undefined)
      setValue('orderingItems', undefined)
      setValue('videoUrl', undefined)
      setValue('videoTimestamp', undefined)
      // Initialize options and timestamp if not set
      if (!question) {
        setValue('options', [
          { content: '', isCorrect: false, displayOrder: 0 },
          { content: '', isCorrect: false, displayOrder: 1 },
        ])
        const currentAudioUrl = form.getValues('audioUrl')
        if (!currentAudioUrl) {
          setValue('audioTimestamp', 0)
        }
      }
    }
  }, [type, question, setValue, form])

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

    if (formData.type === QuestionType.VIDEO) {
      createData.videoUrl = formData.videoUrl?.trim() || ''
      createData.videoTimestamp = formData.videoTimestamp ?? 0
    }

    if (formData.type === QuestionType.AUDIO) {
      createData.audioUrl = formData.audioUrl?.trim() || ''
      createData.audioTimestamp = formData.audioTimestamp ?? 0
    }

    await onSubmit(createData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <QuestionTypeSelect question={question} />

        <CommonFields />

        {[QuestionType.SINGLE_CHOICE, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE, QuestionType.VIDEO, QuestionType.AUDIO].includes(type) && (
          <OptionsFields />
        )}

        {type === QuestionType.MATCHING && (
          <MatchingFields />
        )}

        {type === QuestionType.ORDERING && (
          <OrderingFields />
        )}

        {type === QuestionType.VIDEO && (
          <VideoFields />
        )}

        {type === QuestionType.AUDIO && (
          <AudioFields />
        )}

        <div className="space-y-4 pt-4">
          <Separator />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
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
