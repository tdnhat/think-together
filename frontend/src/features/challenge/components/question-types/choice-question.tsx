'use client'

import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { useChallengeStore } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'

interface ChoiceQuestionProps {
    question: ChallengeQuestionDto
    onAnswerChange?: (answer: number[]) => void
}

/**
 * Render options for Single Choice and Multiple Choice questions
 */
export function ChoiceQuestion({
    question,
    onAnswerChange,
}: Readonly<ChoiceQuestionProps>) {
    const storeAnswer = useChallengeStore((s) => s.getAnswer(question.id))
    // Use answer from question data (API response) if available, otherwise fall back to store
    const answer = question.answer || storeAnswer
    const selectedIndexes = answer?.selectedOptionIndexes || []
    const isMultiple = question.type === 'MultipleChoice'
    // Video questions are treated as single choice (only one correct answer)
    const currentAttempt = useChallengeStore((s) => s.currentAttempt)
    const isCompleted = currentAttempt?.status === 'Completed'

    const handleChange = (index: number, checked: boolean | 'indeterminate') => {
        // Don't allow changes when completed
        if (isCompleted) return

        const isChecked = checked === true

        let newIndexes: number[]
        if (isMultiple) {
            newIndexes = isChecked ? [...selectedIndexes, index] : selectedIndexes.filter((i) => i !== index)
        } else {
            newIndexes = isChecked ? [index] : []
        }
        onAnswerChange?.(newIndexes)
    }

    const getVariant = (index: number) => {
        const isSelected = selectedIndexes.includes(index)
        return isSelected ? 'default' : 'outline'
    }

    const getClassName = (index: number) => {
        const isSelected = selectedIndexes.includes(index)
        const isCorrect = question.options?.[index]?.isCorrect

        if (isCompleted) {
            if (isCorrect) {
                return 'bg-green-50 text-green-700'
            }
            if (isSelected && !isCorrect) {
                return 'bg-red-50 text-red-700'
            }
            return 'opacity-70'
        }

        if (isSelected) {
            return ''
        }
        return ''
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
            {isMultiple ? (
                question.options?.map((option, index) => (
                    <Button
                        key={index}
                        type="button"
                        variant={getVariant(index)}
                        className={`w-full justify-start h-auto py-4 whitespace-normal ${getClassName(index)}`}
                        onClick={() => handleChange(index, !selectedIndexes.includes(index))}
                        disabled={isCompleted}
                    >
                        <Checkbox
                            checked={selectedIndexes.includes(index)}
                            onCheckedChange={(checked) => handleChange(index, checked)}
                            className={getCheckboxStyle(index)}
                            disabled={isCompleted}
                        />
                        <span className="flex-1">{option.content}</span>
                    </Button>
                ))
            ) : (
                question.options?.map((option, index) => {
                    const isSelected = selectedIndexes.includes(index)
                    const isCorrect = question.options?.[index]?.isCorrect

                    const getRadioStyle = () => {
                        if (isCompleted) {
                            if (isCorrect) return 'border-green-500'
                            if (isSelected && !isCorrect) return 'border-red-500'
                            return 'border-border opacity-70'
                        }
                        if (isSelected) return 'border-blue-500'
                        return 'border-border'
                    }

                    const getDotStyle = () => {
                        if (isCompleted) {
                            if (isCorrect) return 'bg-green-500'
                            if (isSelected && !isCorrect) return 'bg-red-500'
                            return 'bg-muted-foreground'
                        }
                        if (isSelected) return 'bg-blue-500'
                        return 'bg-main'
                    }

                    return (
                        <Button
                            key={index}
                            type="button"
                            variant={getVariant(index)}
                            className={`w-full justify-start h-auto py-4 whitespace-normal ${getClassName(index)}`}
                            onClick={() => {
                                if (isCompleted) return
                                onAnswerChange?.([index])
                            }}
                            disabled={isCompleted}
                        >
                            <span
                                className={`size-4 shrink-0 rounded-full border-2 bg-background inline-flex items-center justify-center ${getRadioStyle()}`}
                                aria-hidden="true"
                            >
                                {isSelected && <span className={`size-2 rounded-full ${getDotStyle()}`} />}
                            </span>
                            <span className="flex-1">{option.content}</span>
                        </Button>
                    )
                })
            )}
        </div>
    )
}
