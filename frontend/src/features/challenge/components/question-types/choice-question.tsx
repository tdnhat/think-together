'use client'

import { useChallengeStore } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'
import { AnswerChoiceList } from '@/shared/components/question/answer-choice-list'

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

    const handleChange = (index: number) => {
        // Don't allow changes when completed
        if (isCompleted) return

        let newIndexes: number[]
        if (isMultiple) {
            const isChecked = !selectedIndexes.includes(index)
            newIndexes = isChecked ? [...selectedIndexes, index] : selectedIndexes.filter((i) => i !== index)
        } else {
            // Radio behavior: selecting one deselects others.
            // But if clicking the *same* one? Usually stays selected.
            // Logic says "isChecked = true".
            newIndexes = [index]
        }
        onAnswerChange?.(newIndexes)
    }

    // Custom styling callbacks for AnswerChoiceList to match Challenge logic
    const getVariant = (index: number, isSelected: boolean) => {
        return isSelected ? 'default' : 'outline'
    }

    const getClassName = (index: number, isSelected: boolean) => {
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
        return ''
    }

    const getIndicatorStyle = (index: number, isSelected: boolean) => {
        const isCorrect = question.options?.[index]?.isCorrect

        if (isCompleted) {
            if (isCorrect) {
                return isMultiple ? 'border-green-500 data-[state=checked]:bg-green-500' : 'border-green-500 bg-green-500' // Radio needs bg for solid
            }
            if (isSelected && !isCorrect) {
                return isMultiple ? 'border-red-500 data-[state=checked]:bg-red-500' : 'border-red-500 bg-red-500'
            }
            return ''
        } else {
            // Default colors
            if (isSelected) return isMultiple ? 'border-blue-500 data-[state=checked]:bg-blue-500' : 'border-blue-500 bg-blue-500'
        }
        return ''
    }


    return (
        <AnswerChoiceList
            options={question.options?.map((opt, idx) => ({ index: idx, content: opt.content })) || []}
            selectedIndexes={selectedIndexes}
            isMultiple={isMultiple}
            disabled={isCompleted}
            onSelect={handleChange}
            getVariant={getVariant}
            getClassName={getClassName}
            getIndicatorStyle={getIndicatorStyle}
        />
    )
}
