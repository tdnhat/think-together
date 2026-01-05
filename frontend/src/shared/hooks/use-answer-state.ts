'use client'

/**
 * Answer State Hook
 * Generic hook for managing answer state across different question types
 */

import { useState, useCallback, useMemo } from 'react'

interface UseAnswerStateOptions {
    /** Initial answers */
    initialAnswers?: Record<string, any>
    /** Callback when answer changes */
    onAnswerChange?: (questionId: string, answer: any) => void
}

interface UseAnswerStateReturn {
    /** All answers */
    answers: Record<string, any>
    /** Set answer for a question */
    setAnswer: (questionId: string, answer: any) => void
    /** Get answer for a question */
    getAnswer: (questionId: string) => any
    /** Clear all answers */
    clearAnswers: () => void
    /** Clear answer for a specific question */
    clearAnswer: (questionId: string) => void
    /** Check if question has been answered */
    hasAnswer: (questionId: string) => boolean
    /** Number of answered questions */
    answerCount: number
}

export function useAnswerState(
    options: UseAnswerStateOptions = {}
): UseAnswerStateReturn {
    const { initialAnswers = {}, onAnswerChange } = options

    const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers)

    const setAnswer = useCallback(
        (questionId: string, answer: any) => {
            setAnswers((prev) => {
                const newAnswers = {
                    ...prev,
                    [questionId]: answer,
                }
                onAnswerChange?.(questionId, answer)
                return newAnswers
            })
        },
        [onAnswerChange]
    )

    const getAnswer = useCallback(
        (questionId: string) => {
            return answers[questionId]
        },
        [answers]
    )

    const clearAnswers = useCallback(() => {
        setAnswers({})
    }, [])

    const clearAnswer = useCallback((questionId: string) => {
        setAnswers((prev) => {
            const newAnswers = { ...prev }
            delete newAnswers[questionId]
            return newAnswers
        })
    }, [])

    const hasAnswer = useCallback(
        (questionId: string) => {
            const answer = answers[questionId]
            if (answer === null || answer === undefined) return false
            if (Array.isArray(answer)) return answer.length > 0
            if (typeof answer === 'object') return Object.keys(answer).length > 0
            return true
        },
        [answers]
    )

    const answerCount = useMemo(() => {
        return Object.keys(answers).filter((questionId) => hasAnswer(questionId)).length
    }, [answers, hasAnswer])

    return {
        answers,
        setAnswer,
        getAnswer,
        clearAnswers,
        clearAnswer,
        hasAnswer,
        answerCount,
    }
}
