'use client'

/**
 * Question Navigation Hook
 * Generic hook for navigating between questions
 */

import { useState, useCallback } from 'react'

interface UseQuestionNavigationOptions {
    /** Total number of questions */
    totalQuestions: number
    /** Initial question index (0-based) */
    initialIndex?: number
    /** Callback when index changes */
    onIndexChange?: (index: number) => void
}

interface UseQuestionNavigationReturn {
    /** Current question index (0-based) */
    currentIndex: number
    /** Whether can go to next question */
    canGoNext: boolean
    /** Whether can go to previous question */
    canGoPrevious: boolean
    /** Go to next question */
    goNext: () => void
    /** Go to previous question */
    goPrevious: () => void
    /** Jump to specific question index */
    goToIndex: (index: number) => void
    /** Whether currently on first question */
    isFirst: boolean
    /** Whether currently on last question */
    isLast: boolean
}

export function useQuestionNavigation(
    options: UseQuestionNavigationOptions
): UseQuestionNavigationReturn {
    const { totalQuestions, initialIndex = 0, onIndexChange } = options

    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const canGoNext = currentIndex < totalQuestions - 1
    const canGoPrevious = currentIndex > 0
    const isFirst = currentIndex === 0
    const isLast = currentIndex === totalQuestions - 1

    const goNext = useCallback(() => {
        if (canGoNext) {
            const newIndex = currentIndex + 1
            setCurrentIndex(newIndex)
            onIndexChange?.(newIndex)
        }
    }, [currentIndex, canGoNext, onIndexChange])

    const goPrevious = useCallback(() => {
        if (canGoPrevious) {
            const newIndex = currentIndex - 1
            setCurrentIndex(newIndex)
            onIndexChange?.(newIndex)
        }
    }, [currentIndex, canGoPrevious, onIndexChange])

    const goToIndex = useCallback(
        (index: number) => {
            if (index >= 0 && index < totalQuestions) {
                setCurrentIndex(index)
                onIndexChange?.(index)
            }
        },
        [totalQuestions, onIndexChange]
    )

    return {
        currentIndex,
        canGoNext,
        canGoPrevious,
        goNext,
        goPrevious,
        goToIndex,
        isFirst,
        isLast,
    }
}
