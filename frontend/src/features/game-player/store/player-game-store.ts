/**
 * Player Game Store (v2)
 *
 * Clean Zustand store for player game state.
 * Persists essential data for reconnection.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  ConnectionState,
  QuestionStartedEvent,
  GameEndedEvent,
  LeaderboardUpdatedEvent
} from '@/features/game-host/services/signalr.service'

// =============================================================================
// TYPES
// =============================================================================

export type PlayerPhase =
  | 'idle'       // Initial state
  | 'joining'    // Joining game
  | 'lobby'      // Waiting in lobby
  | 'starting'   // Game starting
  | 'question'   // Answering question
  | 'answered'   // Submitted answer, waiting
  | 'leaderboard'// Viewing leaderboard
  | 'ended'      // Game ended
  | 'error'      // Error state

export interface LeaderboardEntry {
  playerId: string
  nickname: string
  totalPoints: number
  correctAnswers: number
  rank: number
  accuracyPercentage: number
}

export interface PlayerQuestion {
  gameQuestionId: string
  questionId: string
  content: string
  questionType: string
  timeLimit: number
  endTime: string
  positionInGame: number
  totalQuestions: number
  videoUrl: string | null
  videoTimestamp: number | null
  options: Array<{ index: number; content: string; imageUrl: string | null }>
}

export interface PlayerGameState {
  // Connection
  connectionState: ConnectionState

  // Player identity (persisted)
  pin: string | null
  playerId: string | null
  nickname: string | null
  sessionId: string | null

  // Game flow
  phase: PlayerPhase
  currentQuestion: PlayerQuestion | null

  // Answer state
  selectedAnswers: number[]
  hasAnswered: boolean
  answerStartTime: number | null

  // Results
  leaderboard: LeaderboardEntry[]
  totalPoints: number
  currentRank: number | null
  totalQuestions: number

  // Error
  error: string | null
}

interface PlayerGameActions {
  // Connection
  setConnectionState: (state: ConnectionState) => void

  // Player identity
  setPlayerInfo: (info: { pin: string; playerId: string; nickname: string; sessionId: string }) => void
  clearPlayerInfo: () => void

  // Phase
  setPhase: (phase: PlayerPhase) => void

  // Answer
  selectAnswer: (index: number) => void
  clearAnswers: () => void
  setHasAnswered: (answered: boolean) => void
  getResponseTimeMs: () => number

  // Error
  setError: (error: string | null) => void

  // Event handlers
  handleGameStarted: (totalQuestions: number) => void
  handleQuestionStarted: (event: QuestionStartedEvent) => void
  handleLeaderboardUpdated: (event: LeaderboardUpdatedEvent) => void
  handleGameEnded: (event: GameEndedEvent) => void

  // Reset
  reset: () => void
  resetGameState: () => void  // Reset game state but keep player identity
}

interface PlayerGameStore extends PlayerGameState {
  actions: PlayerGameActions
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: PlayerGameState = {
  connectionState: 'disconnected',
  pin: null,
  playerId: null,
  nickname: null,
  sessionId: null,
  phase: 'idle',
  currentQuestion: null,
  selectedAnswers: [],
  hasAnswered: false,
  answerStartTime: null,
  leaderboard: [],
  totalPoints: 0,
  currentRank: null,
  totalQuestions: 0,
  error: null,
}

// =============================================================================
// STORE
// =============================================================================

export const usePlayerGameStore = create<PlayerGameStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        actions: {
          // Connection
          setConnectionState: (connectionState) => {
            set({ connectionState }, false, 'player/setConnectionState')
          },

          // Player identity
          setPlayerInfo: ({ pin, playerId, nickname, sessionId }) => {
            set({ pin, playerId, nickname, sessionId }, false, 'player/setPlayerInfo')
          },

          clearPlayerInfo: () => {
            set({
              pin: null,
              playerId: null,
              nickname: null,
              sessionId: null,
            }, false, 'player/clearPlayerInfo')
          },

          // Phase
          setPhase: (phase) => {
            set({ phase }, false, 'player/setPhase')
          },

          // Answer selection
          selectAnswer: (index) => {
            const { currentQuestion, selectedAnswers } = get()
            if (!currentQuestion) return

            // Determine if single choice
            const questionType = currentQuestion.questionType
            const isSingleChoice = questionType === '1' ||
                                   questionType === 'SingleChoice' ||
                                   questionType === '3' ||
                                   questionType === 'TrueFalse'

            if (isSingleChoice) {
              // Single choice - replace selection
              set({ selectedAnswers: [index] }, false, 'player/selectAnswer')
            } else {
              // Multiple choice - toggle
              const newAnswers = selectedAnswers.includes(index)
                ? selectedAnswers.filter(a => a !== index)
                : [...selectedAnswers, index]
              set({ selectedAnswers: newAnswers }, false, 'player/selectAnswer')
            }
          },

          clearAnswers: () => {
            set({ selectedAnswers: [], hasAnswered: false }, false, 'player/clearAnswers')
          },

          setHasAnswered: (hasAnswered) => {
            set({ hasAnswered }, false, 'player/setHasAnswered')
          },

          getResponseTimeMs: () => {
            const { answerStartTime } = get()
            if (!answerStartTime) return 0
            return Date.now() - answerStartTime
          },

          // Error
          setError: (error) => {
            set({ error }, false, 'player/setError')
          },

          // Event handlers
          handleGameStarted: (totalQuestions) => {
            set({
              phase: 'starting',
              totalQuestions,
            }, false, 'player/gameStarted')
          },

          handleQuestionStarted: (event) => {
            set({
              currentQuestion: {
                gameQuestionId: event.gameQuestionId,
                questionId: event.questionId,
                content: event.content,
                questionType: event.questionType,
                timeLimit: event.timeLimit,
                endTime: event.endTime,
                positionInGame: event.positionInGame,
                totalQuestions: event.totalQuestions,
                videoUrl: event.videoUrl,
                videoTimestamp: event.videoTimestamp,
                options: event.options,
              },
              phase: 'question',
              selectedAnswers: [],
              hasAnswered: false,
              answerStartTime: Date.now(),
              totalQuestions: event.totalQuestions,
            }, false, 'player/questionStarted')
          },

          handleLeaderboardUpdated: (event) => {
            const { playerId } = get()
            const mappedLeaderboard: LeaderboardEntry[] = event.leaderboard.map(e => ({
              playerId: e.playerId,
              nickname: e.nickname,
              totalPoints: e.totalPoints,
              correctAnswers: e.correctAnswers,
              rank: e.rank,
              accuracyPercentage: 0, // Backend doesn't send this
            }))
            const playerEntry = mappedLeaderboard.find(e => e.playerId === playerId)

            set({
              leaderboard: mappedLeaderboard,
              phase: 'leaderboard',
              totalPoints: playerEntry?.totalPoints ?? get().totalPoints,
              currentRank: playerEntry?.rank ?? get().currentRank,
            }, false, 'player/leaderboardUpdated')
          },

          handleGameEnded: (event) => {
            const { playerId } = get()
            const mappedLeaderboard: LeaderboardEntry[] = event.finalLeaderboard.map(e => ({
              playerId: e.playerId,
              nickname: e.nickname,
              totalPoints: e.totalPoints,
              correctAnswers: e.correctAnswers,
              rank: e.rank,
              accuracyPercentage: 0, // Backend doesn't send this
            }))
            const playerEntry = mappedLeaderboard.find(e => e.playerId === playerId)

            set({
              phase: 'ended',
              leaderboard: mappedLeaderboard,
              totalQuestions: event.totalQuestions,
              totalPoints: playerEntry?.totalPoints ?? get().totalPoints,
              currentRank: playerEntry?.rank ?? get().currentRank,
            }, false, 'player/gameEnded')
          },

          // Reset
          reset: () => {
            set(initialState, false, 'player/reset')
          },

          resetGameState: () => {
            // Keep player identity, reset game state
            const { pin, playerId, nickname, sessionId } = get()
            set({
              ...initialState,
              pin,
              playerId,
              nickname,
              sessionId,
              phase: 'lobby',
            }, false, 'player/resetGameState')
          },
        },
      }),
      {
        name: 'player-game-storage',
        // Only persist player identity
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

// =============================================================================
// SELECTORS
// =============================================================================

export const selectPlayerConnectionState = (s: PlayerGameStore) => s.connectionState
export const selectPlayerPin = (s: PlayerGameStore) => s.pin
export const selectPlayerPlayerId = (s: PlayerGameStore) => s.playerId
export const selectPlayerNickname = (s: PlayerGameStore) => s.nickname
export const selectPlayerSessionId = (s: PlayerGameStore) => s.sessionId
export const selectPlayerPhase = (s: PlayerGameStore) => s.phase
export const selectPlayerCurrentQuestion = (s: PlayerGameStore) => s.currentQuestion
export const selectPlayerSelectedAnswers = (s: PlayerGameStore) => s.selectedAnswers
export const selectPlayerHasAnswered = (s: PlayerGameStore) => s.hasAnswered
export const selectPlayerLeaderboard = (s: PlayerGameStore) => s.leaderboard
export const selectPlayerTotalPoints = (s: PlayerGameStore) => s.totalPoints
export const selectPlayerCurrentRank = (s: PlayerGameStore) => s.currentRank
export const selectPlayerTotalQuestions = (s: PlayerGameStore) => s.totalQuestions
export const selectPlayerError = (s: PlayerGameStore) => s.error
export const selectPlayerActions = (s: PlayerGameStore) => s.actions
export const selectPlayerIsConnected = (s: PlayerGameStore) => s.connectionState === 'connected'

