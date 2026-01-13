/**
 * Player Game Store
 *
 * Event-driven state management for game player.
 * Reacts to backend SignalR events for state changes.
 * Persists player identity for reconnection.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  ConnectionState,
  QuestionStartedEvent,
  QuestionEndedEvent,
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
  | 'starting'   // Game starting (brief transition)
  | 'question'   // Answering question
  | 'answered'   // Submitted answer, waiting for results
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
  endTime: string // ISO string from server for synchronization
  positionInGame: number
  totalQuestions: number
  videoUrl: string | null
  videoTimestamp: number | null
  audioUrl: string | null
  audioTimestamp: number | null
  options: Array<{ index: number; content: string; imageUrl: string | null }>
  matchingLeft: Array<{ id: number; content: string }>
  matchingRight: Array<{ id: number; content: string }>
  orderingItems: Array<{ id: number; content: string }>
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
  answerStartTime: number | null // Timestamp when question started (for response time)

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
  setSelectedAnswers: (indices: number[]) => void
  clearAnswers: () => void
  setHasAnswered: (answered: boolean) => void
  getResponseTimeMs: () => number

  // Error
  setError: (error: string | null) => void

  // Event handlers
  handleGameStarted: (event: { totalQuestions: number }) => void
  handleQuestionStarted: (event: QuestionStartedEvent) => void
  handleQuestionEnded: (event: QuestionEndedEvent) => void
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
            const { currentQuestion, selectedAnswers, hasAnswered } = get()
            if (!currentQuestion || hasAnswered) return

            // Determine if single choice
            const questionType = currentQuestion.questionType
            const isSingleChoice = questionType === '1' ||
              questionType === 'SingleChoice' ||
              questionType === '6' || // Video
              questionType === '7' || // Audio
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

          setSelectedAnswers: (indices) => {
            const { hasAnswered } = get()
            if (hasAnswered) return
            set({ selectedAnswers: indices }, false, 'player/setSelectedAnswers')
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
          handleGameStarted: (event) => {
            set({
              phase: 'starting',
              totalQuestions: event.totalQuestions,
            }, false, 'player/gameStarted')
          },

          handleQuestionStarted: (event) => {
            const question: PlayerQuestion = {
              gameQuestionId: event.gameQuestionId,
              questionId: event.questionId,
              content: event.content,
              questionType: event.questionType,
              timeLimit: event.timeLimit,
              endTime: event.endTime, // ISO string from server
              positionInGame: event.positionInGame,
              totalQuestions: event.totalQuestions,
              videoUrl: event.videoUrl,
              videoTimestamp: event.videoTimestamp,
              audioUrl: event.audioUrl,
              audioTimestamp: event.audioTimestamp,
              options: event.options,
              matchingLeft: event.matchingLeft,
              matchingRight: event.matchingRight,
              orderingItems: event.orderingItems,
            }

            set({
              currentQuestion: question,
              phase: 'question',
              selectedAnswers: [],
              hasAnswered: false,
              answerStartTime: Date.now(),
              totalQuestions: event.totalQuestions,
            }, false, 'player/questionStarted')
          },

          handleQuestionEnded: (event) => {
            // Question ended - transition to leaderboard phase
            const { playerId } = get()
            const mappedLeaderboard: LeaderboardEntry[] = event.topPlayers.map(e => ({
              playerId: e.playerId,
              nickname: e.nickname,
              totalPoints: e.totalPoints,
              correctAnswers: e.correctAnswers,
              rank: e.rank,
              accuracyPercentage: 0,
            }))
            const playerEntry = mappedLeaderboard.find(e => e.playerId === playerId)

            set({
              phase: 'leaderboard',
              leaderboard: mappedLeaderboard,
              totalPoints: playerEntry?.totalPoints ?? get().totalPoints,
              currentRank: playerEntry?.rank ?? get().currentRank,
            }, false, 'player/questionEnded')
          },

          handleLeaderboardUpdated: (event) => {
            const { playerId } = get()
            const mappedLeaderboard: LeaderboardEntry[] = event.leaderboard.map(e => ({
              playerId: e.playerId,
              nickname: e.nickname,
              totalPoints: e.totalPoints,
              correctAnswers: e.correctAnswers,
              rank: e.rank,
              accuracyPercentage: 0,
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
              accuracyPercentage: 0,
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
