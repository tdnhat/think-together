'use client'

import type { QuestionOption } from '@/features/game-host/types'
import { AnswerChoiceList } from '@/shared/components/question/answer-choice-list'

interface ChoiceAnswerProps {
    options: QuestionOption[]
    selectedIndexes: number[]
    isMultiple: boolean
    hasAnswered: boolean
    onAnswerChange: (index: number) => void
}

/**
 * Render options for Single Choice and Multiple Choice questions
 * Uses the shared AnswerChoiceList component
 */
export function ChoiceAnswer({
    options,
    selectedIndexes,
    isMultiple,
    hasAnswered,
    onAnswerChange,
}: ChoiceAnswerProps) {

    // Map QuestionOption to ChoiceOption (interface roughly same)
    // QuestionOption needs mapping because AnswerChoiceList expects { index, content }

    return (
        <AnswerChoiceList
            options={options.map(o => ({ index: o.index, content: o.content }))}
            selectedIndexes={selectedIndexes}
            isMultiple={isMultiple}
            disabled={hasAnswered}
            onSelect={onAnswerChange}
        />
    )
}
