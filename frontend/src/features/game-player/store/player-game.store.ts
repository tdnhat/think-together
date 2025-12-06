/**
 * Player Game Store
 * 
 * Zustand store for player game state.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  PlayerGameState, 
  PlayerPhase 
} from '../types'
import type {
  QuestionStartedMessage,
  AnswerResult,
  LeaderboardEntry,
  GameEndedMessage,
} from '@/features/game-host/types'

interface PlayerGameStore extends PlayerGameState {
  actions: {
    setPhase: (phase: PlayerPhase) => void
    setPin: (pin: string | null) => void
    setPlayerId: (playerId: string | null) => void
    setNickname: (nickname: string | null) => void
    setSessionId: (sessionId: string | null) => void
    setCurrentQuestion: (question: QuestionStartedMessage | null) => void
    setAnswerResult: (result: AnswerResult | null) => void
    setSelectedAnswers: (answers: number[]) => void
    toggleAnswer: (index: number) => void
    setHasAnswered: (hasAnswered: boolean) => void
    startAnswerTimer: () => void
    getResponseTime: () => number
    setLeaderboard: (leaderboard: LeaderboardEntry[]) => void
    updatePoints: (points: number, rank: number) => void
    setError: (error: string | null) => void
    setConnected: (connected: boolean) => void
    handleQuestionStarted: (message: QuestionStartedMessage) => void
    handleAnswerResult: (result: AnswerResult) => void
    handleGameEnded: (message: GameEndedMessage) => void
    reset: () => void
  }
}

const initialState: PlayerGameState = {
  phase: 'idle',
  pin: null,
  playerId: null,
  nickname: null,
  sessionId: null,
  currentQuestion: null,
  answerResult: null,
  selectedAnswers: [],
  hasAnswered: false,
  answerStartTime: null,
  leaderboard: [],
  totalPoints: 0,
  currentRank: null,
  error: null,
  isConnected: false,
}

export const usePlayerGameStore = create<PlayerGameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        actions: {
          setPhase: (phase) => {
            set({ phase }, false, 'playerGame/setPhase')
          },

          setPin: (pin) => {
            set({ pin }, false, 'playerGame/setPin')
          },

          setPlayerId: (playerId) => {
            set({ playerId }, false, 'playerGame/setPlayerId')
          },

          setNickname: (nickname) => {
            set({ nickname }, false, 'playerGame/setNickname')
          },

          setSessionId: (sessionId) => {
            set({ sessionId }, false, 'playerGame/setSessionId')
          },

          setCurrentQuestion: (question) => {
            set({ 
              currentQuestion: question,
              selectedAnswers: [],
              hasAnswered: false,
              answerResult: null,
              answerStartTime: question ? Date.now() : null,
            }, false, 'playerGame/setCurrentQuestion')
          },

          setAnswerResult: (result) => {
            set({ answerResult: result }, false, 'playerGame/setAnswerResult')
          },

          setSelectedAnswers: (answers) => {
            set({ selectedAnswers: answers }, false, 'playerGame/setSelectedAnswers')
          },

          toggleAnswer: (index) => {
            const { currentQuestion, selectedAnswers } = get()
            if (!currentQuestion) return

            // Determine if single choice based on question type
            const questionType = currentQuestion.questionType
            const isSingleChoice = questionType === '1' || 
                                   questionType === 'SingleChoice' || 
                                   questionType === '3' || 
                                   questionType === 'TrueFalse'

            if (isSingleChoice) {
              set({ selectedAnswers: [index] }, false, 'playerGame/toggleAnswer')
            } else {
              // For multiple choice, toggle the selection
              const newAnswers = selectedAnswers.includes(index)
                ? selectedAnswers.filter(a => a !== index)
                : [...selectedAnswers, index]
              set({ selectedAnswers: newAnswers }, false, 'playerGame/toggleAnswer')
            }
          },

          setHasAnswered: (hasAnswered) => {
            set({ hasAnswered }, false, 'playerGame/setHasAnswered')
          },

          startAnswerTimer: () => {
            set({ answerStartTime: Date.now() }, false, 'playerGame/startAnswerTimer')
          },

          getResponseTime: () => {
            const { answerStartTime } = get()
            if (!answerStartTime) return 0
            return Date.now() - answerStartTime
          },

          setLeaderboard: (leaderboard) => {
            set({ leaderboard }, false, 'playerGame/setLeaderboard')
          },

          updatePoints: (points, rank) => {
            set({ totalPoints: points, currentRank: rank }, false, 'playerGame/updatePoints')
          },

          setError: (error) => {
            set({ 
              error,
              phase: error ? 'error' : get().phase 
            }, false, 'playerGame/setError')
          },

          setConnected: (connected) => {
            set({ isConnected: connected }, false, 'playerGame/setConnected')
          },

          handleQuestionStarted: (message) => {
            set({
              currentQuestion: message,
              selectedAnswers: [],
              hasAnswered: false,
              answerResult: null,
              answerStartTime: Date.now(),
              phase: 'question',
            }, false, 'playerGame/handleQuestionStarted')
          },

          handleAnswerResult: (result) => {
            set({
              answerResult: result,
              totalPoints: result.totalPoints,
              currentRank: result.currentRank,
              phase: 'answered',
            }, false, 'playerGame/handleAnswerResult')
          },

          handleGameEnded: (message) => {
            set({
              leaderboard: message.finalLeaderboard,
              phase: 'ended',
            }, false, 'playerGame/handleGameEnded')
          },

          reset: () => {
            set(initialState, false, 'playerGame/reset')
          },
        },
      }),
      {
        name: 'player-game-storage',
        partialize: (state) => ({
          pin: state.pin,
          playerId: state.playerId,
          nickname: state.nickname,
          sessionId: state.sessionId,
        }),
      }
    ),
    { name: 'PlayerGameStore' }
  )
)

// Selectors
export const selectPlayerPhase = (state: PlayerGameStore) => state.phase
export const selectPlayerPin = (state: PlayerGameStore) => state.pin
export const selectPlayerPlayerId = (state: PlayerGameStore) => state.playerId
export const selectPlayerNickname = (state: PlayerGameStore) => state.nickname
export const selectPlayerSessionId = (state: PlayerGameStore) => state.sessionId
export const selectPlayerCurrentQuestion = (state: PlayerGameStore) => state.currentQuestion
export const selectPlayerAnswerResult = (state: PlayerGameStore) => state.answerResult
export const selectPlayerSelectedAnswers = (state: PlayerGameStore) => state.selectedAnswers
export const selectPlayerHasAnswered = (state: PlayerGameStore) => state.hasAnswered
export const selectPlayerLeaderboard = (state: PlayerGameStore) => state.leaderboard
export const selectPlayerTotalPoints = (state: PlayerGameStore) => state.totalPoints
export const selectPlayerCurrentRank = (state: PlayerGameStore) => state.currentRank
export const selectPlayerError = (state: PlayerGameStore) => state.error
export const selectPlayerIsConnected = (state: PlayerGameStore) => state.isConnected
export const selectPlayerActions = (state: PlayerGameStore) => state.actions
