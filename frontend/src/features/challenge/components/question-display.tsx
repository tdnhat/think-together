'use client'

import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { useChallengeStore, selectCurrentQuestion } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'

interface QuestionDisplayProps {
  onAnswerChange?: (answer: number[] | Array<[number, number]> | Array<[string, number]>) => void
  className?: string
}

export function QuestionDisplay({ onAnswerChange, className = '' }: QuestionDisplayProps) {
  const question = useChallengeStore(selectCurrentQuestion)

  if (!question) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--text-secondary)]">Không có câu hỏi để hiển thị</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">{question.content}</CardTitle>
      </CardHeader>

      <CardContent>
        {question.type === 'SingleChoice' || question.type === 'MultipleChoice' ? (
          <RenderChoiceOptions question={question} onAnswerChange={onAnswerChange} />
        ) : question.type === 'TrueFalse' ? (
          <RenderTrueFalseOptions question={question} onAnswerChange={onAnswerChange} />
        ) : question.type === 'Matching' ? (
          <RenderMatchingOptions question={question} onAnswerChange={onAnswerChange} />
        ) : question.type === 'Ordering' ? (
          <RenderOrderingOptions question={question} onAnswerChange={onAnswerChange} />
        ) : null}
      </CardContent>
    </Card>
  )
}

/**
 * Render options for Single Choice and Multiple Choice questions
 */
function RenderChoiceOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: number[]) => void
}) {
  const storeAnswer = useChallengeStore((s) => s.getAnswer(question.id))
  // Use answer from question data (API response) if available, otherwise fall back to store
  const answer = question.answer || storeAnswer
  const selectedIndexes = answer?.selectedOptionIndexes || []
  const isMultiple = question.type === 'MultipleChoice'
  const currentAttempt = useChallengeStore((s) => s.currentAttempt)
  const isCompleted = currentAttempt?.status === 'Completed'

  const handleChange = (index: number, checked: boolean) => {
    // Don't allow changes when completed
    if (isCompleted) return

    let newIndexes: number[]
    if (isMultiple) {
      newIndexes = checked ? [...selectedIndexes, index] : selectedIndexes.filter((i) => i !== index)
    } else {
      newIndexes = checked ? [index] : []
    }
    onAnswerChange?.(newIndexes)
  }

  // Helper to determine option styling based on state
  const getOptionStyle = (index: number) => {
    const isSelected = selectedIndexes.includes(index)
    const isCorrect = question.options?.[index]?.isCorrect

    if (isCompleted) {
      // Show correct/incorrect when completed
      if (isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-950/50'
      }
      if (isSelected && !isCorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-950/50'
      }
      return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60'
    }

    // Normal selection state
    if (isSelected) {
      return 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 shadow-md'
    }
    return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
  }

  const getTextStyle = (index: number) => {
    const isSelected = selectedIndexes.includes(index)
    const isCorrect = question.options?.[index]?.isCorrect

    if (isCompleted) {
      if (isCorrect) {
        return 'text-green-700 dark:text-green-300'
      }
      if (isSelected && !isCorrect) {
        return 'text-red-700 dark:text-red-300'
      }
      return 'text-gray-500 dark:text-gray-400'
    }

    if (isSelected) {
      return 'text-blue-700 dark:text-blue-300'
    }
    return 'text-gray-700 dark:text-gray-200'
  }

  const getCheckboxStyle = (index: number) => {
    const isSelected = selectedIndexes.includes(index)
    const isCorrect = question.options?.[index]?.isCorrect

    if (isCompleted) {
      if (isCorrect) {
        return 'border-green-500 data-[state=checked]:bg-green-500'
      }
      if (isSelected && !isCorrect) {
        return 'border-red-500 data-[state=checked]:bg-red-500'
      }
      return ''
    }

    if (isSelected) {
      return 'border-blue-500 data-[state=checked]:bg-blue-500'
    }
    return ''
  }

  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
            isCompleted ? 'cursor-default' : 'cursor-pointer'
          } ${getOptionStyle(index)}`}
          onClick={() => handleChange(index, !selectedIndexes.includes(index))}
        >
          <Checkbox
            id={`option-${index}`}
            checked={selectedIndexes.includes(index) || (isCompleted && option.isCorrect)}
            onCheckedChange={(checked) => handleChange(index, checked as boolean)}
            disabled={isCompleted}
            className={`h-5 w-5 ${getCheckboxStyle(index)}`}
          />
          <Label
            htmlFor={`option-${index}`}
            className={`flex-1 ${isCompleted ? '' : 'cursor-pointer'} font-medium ${getTextStyle(index)}`}
          >
            {option.content}
          </Label>
          {isCompleted && option.isCorrect && (
            <span className="text-green-600 text-sm font-medium">✓ Đúng</span>
          )}
          {isCompleted && selectedIndexes.includes(index) && !option.isCorrect && (
            <span className="text-red-600 text-sm font-medium">✗ Sai</span>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Render options for True/False questions
 */
function RenderTrueFalseOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: number[]) => void
}) {
  const storeAnswer = useChallengeStore((s) => s.getAnswer(question.id))
  const answer = question.answer || storeAnswer
  const selectedIndex = answer?.selectedOptionIndexes?.[0]
  const currentAttempt = useChallengeStore((s) => s.currentAttempt)
  const isCompleted = currentAttempt?.status === 'Completed'

  const handleChange = (index: number) => {
    if (isCompleted) return
    onAnswerChange?.([index])
  }

  // For TrueFalse, index 0 = True (Đúng), index 1 = False (Sai)
  // The correct answer is determined by the options from the API
  const getCorrectIndex = () => {
    const correctOption = question.options?.findIndex(o => o.isCorrect)
    return correctOption ?? -1
  }

  const getOptionStyle = (index: number) => {
    const isSelected = selectedIndex === index
    const correctIndex = getCorrectIndex()
    const isCorrect = index === correctIndex

    if (isCompleted) {
      if (isCorrect) {
        return 'border-green-500 bg-green-50 dark:bg-green-950/50'
      }
      if (isSelected && !isCorrect) {
        return 'border-red-500 bg-red-50 dark:bg-red-950/50'
      }
      return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60'
    }

    if (isSelected) {
      return 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 shadow-md'
    }
    return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm'
  }

  const getTextStyle = (index: number) => {
    const isSelected = selectedIndex === index
    const correctIndex = getCorrectIndex()
    const isCorrect = index === correctIndex

    if (isCompleted) {
      if (isCorrect) {
        return 'text-green-700 dark:text-green-300'
      }
      if (isSelected && !isCorrect) {
        return 'text-red-700 dark:text-red-300'
      }
      return 'text-gray-500 dark:text-gray-400'
    }

    if (isSelected) {
      return 'text-blue-700 dark:text-blue-300'
    }
    return 'text-gray-700 dark:text-gray-200'
  }

  const getCheckboxStyle = (index: number) => {
    const isSelected = selectedIndex === index
    const correctIndex = getCorrectIndex()
    const isCorrect = index === correctIndex

    if (isCompleted) {
      if (isCorrect) {
        return 'border-green-500 data-[state=checked]:bg-green-500'
      }
      if (isSelected && !isCorrect) {
        return 'border-red-500 data-[state=checked]:bg-red-500'
      }
      return ''
    }

    if (isSelected) {
      return 'border-blue-500 data-[state=checked]:bg-blue-500'
    }
    return ''
  }

  return (
    <div className="space-y-3">
      {['Đúng', 'Sai'].map((label, index) => {
        const correctIndex = getCorrectIndex()
        const isCorrect = index === correctIndex
        const isSelected = selectedIndex === index

        return (
          <div
            key={index}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
              isCompleted ? 'cursor-default' : 'cursor-pointer'
            } ${getOptionStyle(index)}`}
            onClick={() => handleChange(index)}
          >
            <Checkbox
              id={`tf-option-${index}`}
              checked={isSelected || (isCompleted && isCorrect)}
              onCheckedChange={() => handleChange(index)}
              disabled={isCompleted}
              className={`h-5 w-5 ${getCheckboxStyle(index)}`}
            />
            <Label
              htmlFor={`tf-option-${index}`}
              className={`flex-1 ${isCompleted ? '' : 'cursor-pointer'} font-medium ${getTextStyle(index)}`}
            >
              {label}
            </Label>
            {isCompleted && isCorrect && (
              <span className="text-green-600 text-sm font-medium">✓ Đúng</span>
            )}
            {isCompleted && isSelected && !isCorrect && (
              <span className="text-red-600 text-sm font-medium">✗ Sai</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Render options for Matching questions
 */
function RenderMatchingOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: Array<[number, number]>) => void
}) {
  // Matching UI will be more complex - placeholder for now
  return (
    <div className="text-[var(--text-secondary)]">
      <p>Loại câu hỏi nối ghép chưa được hỗ trợ trong giao diện này</p>
    </div>
  )
}

/**
 * Render options for Ordering questions
 */
function RenderOrderingOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: Array<[string, number]>) => void
}) {
  // Ordering UI will be more complex - placeholder for now
  return (
    <div className="text-[var(--text-secondary)]">
      <p>Loại câu hỏi sắp xếp chưa được hỗ trợ trong giao diện này</p>
    </div>
  )
}

