'use client'

import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import type { QuestionOption } from '@/features/game-host/types'

interface ChoiceAnswerProps {
    options: QuestionOption[]
    selectedIndexes: number[]
    isMultiple: boolean
    hasAnswered: boolean
    onAnswerChange: (index: number) => void
}

/**
 * Render options for Single Choice and Multiple Choice questions
 * Modeled after features/challenge/components/question-types/choice-question.tsx
 */
export function ChoiceAnswer({
    options,
    selectedIndexes,
    isMultiple,
    hasAnswered,
    onAnswerChange,
}: ChoiceAnswerProps) {

    // Note: Live Game logic for Multiple Choice passes one index at a time to parent, 
    // which effectively toggles it.
    // Challenge logic passes the NEW ARRAY of all selected indexes.

    // The prop `onAnswerChange`:
    // In `PlayerQuestion`, `onSelectAnswer` takes `index`.
    // And `PlayerQuestion` passes `onSelectAnswer` to `AnswerOption`.
    // `usePlayerGame` `selectAnswer` logic:
    // If multiple choice: toggles index in `selectedAnswers`.
    // If single choice: replaces `selectedAnswers`.

    // So we can keep using `onAnswerChange(index)` and let the hook handle the array logic,
    // OR we can adopt Challenge logic where the Component calculates the new array.
    // The User said "different components and logic".

    // If I want to exactly match Challenge, I should probably handle the array manipulation here
    // and pass the full array to `onSetSelectedAnswers` (which I recently exposed!).
    // Wait, `onSetSelectedAnswers` was for Matching/Ordering.
    // But I can use it for Choice too!

    // Let's modify `ChoiceAnswer` to calculate the new array and call `onSetSelectedAnswers` (passed as `onAnswersChange` here?), 
    // OR just keep using `onSelectAnswer(index)` if the parent hook logic is fine.
    // The hook logic IS fine. `usePlayerGame.ts`:
    /*
      const selectAnswer = (index: number) => {
        if (!currentQuestion || hasAnswered || isSubmitting) return

        if (currentQuestion.questionType === 'MultipleChoice') {
           // Toggle
        } else {
           // Replace
        }
      }
    */
    // This logic is duplicated in `ChoiceQuestion` (challenge) vs `usePlayerGame` (live).
    // The user wants consistency.
    // Challenge does it in the Component. Live does it in the Hook.
    // If I move the logic to Component, I can just use `setSelectedAnswers` from the hook.

    // Let's try to stick to the Hook logic for now as it's already bound to `selectAnswer`,
    // UNLESS I change `PlayerQuestion` to pass `setSelectedAnswers` to `ChoiceAnswer` instead of `selectAnswer`.

    // Actually, `ChoiceQuestion` logic is cleaner for UI state.

    const handleChange = (index: number) => {
        if (hasAnswered) return
        onAnswerChange(index)
    }

    const getVariant = (index: number) => {
        const isSelected = selectedIndexes.includes(index)
        return isSelected ? 'default' : 'outline'
    }

    const getClassName = (index: number) => {
        const isSelected = selectedIndexes.includes(index)
        // In Live Game we don't show Correct/Incorrect immediately (usually).
        // Only "Submitted".
        // So no green/red logic yet.
        return isSelected ? '' : ''
    }

    const getCheckboxStyle = (index: number) => {
        const isSelected = selectedIndexes.includes(index)
        if (isSelected) {
            return 'border-blue-500 data-[state=checked]:bg-blue-500'
        }
        return ''
    }

    return (
        <div className="space-y-3">
            {isMultiple ? (
                options.map((option) => (
                    <Button
                        key={option.index} // Use option.index or just index? option.index is safer.
                        type="button"
                        variant={getVariant(option.index)}
                        className={`w-full justify-start h-auto py-4 whitespace-normal ${getClassName(option.index)}`}
                        onClick={() => handleChange(option.index)}
                        disabled={hasAnswered}
                    >
                        <Checkbox
                            checked={selectedIndexes.includes(option.index)}
                            onCheckedChange={() => handleChange(option.index)}
                            className={getCheckboxStyle(option.index)}
                            disabled={hasAnswered}
                        />
                        <span className="flex-1 ml-2 text-left">{option.content}</span>
                    </Button>
                ))
            ) : (
                options.map((option) => {
                    const isSelected = selectedIndexes.includes(option.index)

                    const getRadioStyle = () => {
                        if (isSelected) return 'border-blue-500'
                        return 'border-border'
                    }

                    const getDotStyle = () => {
                        if (isSelected) return 'bg-blue-500'
                        return 'bg-foreground'
                    }

                    return (
                        <Button
                            key={option.index}
                            type="button"
                            variant={getVariant(option.index)}
                            className={`w-full justify-start h-auto py-4 whitespace-normal ${getClassName(option.index)}`}
                            onClick={() => handleChange(option.index)}
                            disabled={hasAnswered}
                        >
                            <span
                                className={`size-4 shrink-0 rounded-full border-2 bg-background inline-flex items-center justify-center mr-2 ${getRadioStyle()}`}
                                aria-hidden="true"
                            >
                                {isSelected && <span className={`size-2 rounded-full ${getDotStyle()}`} />}
                            </span>
                            <span className="flex-1 text-left">{option.content}</span>
                        </Button>
                    )
                })
            )}
        </div>
    )
}
