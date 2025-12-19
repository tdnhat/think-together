/**
 * Challenge Store
 * Zustand store for managing challenge state
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ChallengeState,
  ChallengeDto,
  ChallengeAttemptDto,
  ChallengeAnswerDto,
  ChallengeLeaderboardDto,
} from '../types'

interface ChallengeStore extends ChallengeState {
  // Challenge actions
  setCurrentChallenge: (challenge: ChallengeDto | null) => void
  setCurrentAttempt: (attempt: ChallengeAttemptDto | null) => void

  // Navigation actions
  setCurrentQuestionIndex: (index: number) => void
  goToNextQuestion: () => void
  goToPreviousQuestion: () => void
  jumpToQuestion: (index: number) => void

  // Timer actions
  setRemainingTime: (ms: number) => void
  setTotalTime: (ms: number) => void
  decrementTimer: () => void
  resetTimer: () => void

  // Answer actions
  setAnswer: (questionId: string, answer: ChallengeAnswerDto) => void
  getAnswer: (questionId: string) => ChallengeAnswerDto | undefined
  clearAnswers: () => void

  // Flag actions
  toggleFlagQuestion: (questionId: string) => void
  isFlagged: (questionId: string) => boolean
  clearFlaggedQuestions: () => void

  // Leaderboard actions
  setLeaderboard: (leaderboard: ChallengeLeaderboardDto) => void

  // UI state actions
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void

  // Reset store
  reset: () => void
}

const initialState: ChallengeState = {
  currentChallenge: null,
  currentAttempt: null,
  currentQuestionIndex: 0,
  remainingTimeMs: 0,
  totalTimeMs: 0,
  answers: {},
  flaggedQuestionIds: new Set(),
  leaderboard: null,
  isLoading: false,
  error: null,
}

export const useChallengeStore = create<ChallengeStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Challenge actions
      setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
      setCurrentAttempt: (attempt) => set({ currentAttempt: attempt }),

      // Navigation actions
      setCurrentQuestionIndex: (index) => {
        set({ currentQuestionIndex: index })
      },
      goToNextQuestion: () => {
        const { currentQuestionIndex, currentAttempt } = get()
        if (
          currentAttempt &&
          currentQuestionIndex < currentAttempt.questions.length - 1
        ) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
      },
      goToPreviousQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
      },
      jumpToQuestion: (index) => {
        const { currentAttempt } = get()
        if (currentAttempt && index >= 0 && index < currentAttempt.questions.length) {
          set({ currentQuestionIndex: index })
        }
      },

      // Timer actions
      setRemainingTime: (ms) => set({ remainingTimeMs: ms }),
      setTotalTime: (ms) => set({ totalTimeMs: ms }),
      decrementTimer: () => {
        const { remainingTimeMs } = get()
        if (remainingTimeMs > 0) {
          set({ remainingTimeMs: remainingTimeMs - 1000 })
        }
      },
      resetTimer: () => {
        const { totalTimeMs } = get()
        set({ remainingTimeMs: totalTimeMs })
      },

      // Answer actions
      setAnswer: (questionId, answer) => {
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer,
          },
        }))
      },
      getAnswer: (questionId) => {
        return get().answers[questionId]
      },
      clearAnswers: () => {
        set({ answers: {} })
      },

      // Flag actions
      toggleFlagQuestion: (questionId) => {
        set((state) => {
          // Handle Set, Array, or empty object {} (from persistence deserialization)
          let currentFlagged: Set<string>
          if (state.flaggedQuestionIds instanceof Set) {
            currentFlagged = state.flaggedQuestionIds
          } else if (Array.isArray(state.flaggedQuestionIds)) {
            currentFlagged = new Set(state.flaggedQuestionIds)
          } else {
            // Empty object {} or other non-iterable
            currentFlagged = new Set()
          }
          const newFlagged = new Set(currentFlagged)
          if (newFlagged.has(questionId)) {
            newFlagged.delete(questionId)
          } else {
            newFlagged.add(questionId)
          }
          return { flaggedQuestionIds: newFlagged }
        })
      },
      isFlagged: (questionId) => {
        const flaggedIds = get().flaggedQuestionIds
        // Handle Set, Array, or empty object {} (from persistence deserialization)
        if (flaggedIds instanceof Set) {
          return flaggedIds.has(questionId)
        }
        // After JSON deserialization, it might be an array or empty object
        if (Array.isArray(flaggedIds)) {
          return (flaggedIds as string[]).includes(questionId)
        }
        // Empty object {} or other
        return false
      },
      clearFlaggedQuestions: () => {
        set({ flaggedQuestionIds: new Set() })
      },

      // Leaderboard actions
      setLeaderboard: (leaderboard) => set({ leaderboard }),

      // UI state actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Reset store
      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'challenge-store',
      partialize: (state) => ({
        // Only persist essential state
        currentAttempt: state.currentAttempt,
        answers: state.answers,
        flaggedQuestionIds: state.flaggedQuestionIds,
      }),
    }
  )
)

// Selectors for easier access
export const selectCurrentChallenge = (state: ChallengeStore) => state.currentChallenge
export const selectCurrentAttempt = (state: ChallengeStore) => state.currentAttempt
export const selectCurrentQuestion = (state: ChallengeStore) => {
  const attempt = state.currentAttempt
  if (!attempt || attempt.questions.length === 0) return undefined
  return attempt.questions[state.currentQuestionIndex]
}
export const selectCurrentQuestionIndex = (state: ChallengeStore) =>
  state.currentQuestionIndex
export const selectTotalQuestions = (state: ChallengeStore) =>
  state.currentAttempt?.questions.length ?? 0
export const selectRemainingTime = (state: ChallengeStore) => state.remainingTimeMs
export const selectTotalTime = (state: ChallengeStore) => state.totalTimeMs
export const selectAnswers = (state: ChallengeStore) => state.answers
export const selectFlaggedQuestions = (state: ChallengeStore) => state.flaggedQuestionIds
export const selectLeaderboard = (state: ChallengeStore) => state.leaderboard
export const selectIsLoading = (state: ChallengeStore) => state.isLoading
export const selectError = (state: ChallengeStore) => state.error

