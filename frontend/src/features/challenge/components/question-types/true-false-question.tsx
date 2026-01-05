'use client'

import { Button } from '@/shared/ui/button'
import { useChallengeStore } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'

interface TrueFalseQuestionProps {
    question: ChallengeQuestionDto
    onAnswerChange?: (answer: number[]) => void
}

/**
 * Render options for True/False questions
 */
export function TrueFalseQuestion({
    question,
    onAnswerChange,
}: Readonly<TrueFalseQuestionProps>) {
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

    const getVariant = (index: number) => (selectedIndex === index ? 'default' : 'outline')

    const getClassName = (index: number) => {
        const isSelected = selectedIndex === index
        const correctIndex = getCorrectIndex()
        const isCorrect = index === correctIndex

        if (!isCompleted) return ''

        if (isCorrect) return 'bg-green-50 text-green-700'
        if (isSelected && !isCorrect) return 'bg-red-50 text-red-700'
        return 'opacity-70'
    }

    return (
        <div className="space-y-3">
            {['Đúng', 'Sai'].map((label, index) => {
                const correctIndex = getCorrectIndex()
                const isCorrect = index === correctIndex
                const isSelected = selectedIndex === index

                const getRadioStyle = () => {
                    if (isCompleted) {
                        if (isCorrect) return 'border-green-500'
                        if (isSelected && !isCorrect) return 'border-red-500'
                        return 'border-border opacity-60'
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
                        onClick={() => handleChange(index)}
                        disabled={isCompleted}
                    >
                        <span
                            className={`size-4 shrink-0 rounded-full border-2 bg-background inline-flex items-center justify-center ${getRadioStyle()}`}
                            aria-hidden="true"
                        >
                            {isSelected && <span className={`size-2 rounded-full ${getDotStyle()}`} />}
                        </span>
                        <span className="flex-1">{label}</span>
                        {isCompleted && isCorrect && (
                            <span className="text-green-600 text-sm font-medium">✓ Đúng</span>
                        )}
                        {isCompleted && isSelected && !isCorrect && (
                            <span className="text-red-600 text-sm font-medium">✗ Sai</span>
                        )}
                    </Button>
                )
            })}
        </div>
    )
}
