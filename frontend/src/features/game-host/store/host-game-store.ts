/**
 * Host Game Store (v2)
 *
 * Clean, simple Zustand store for host game state.
 * Single source of truth for UI state.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  GameSession,
  GameQuestion,
  LeaderboardEntry,
  QuestionEndedMessage,
} from '../types'
import type {
  PlayerJoinedEvent,
  PlayerLeftEvent,
  QuestionStartedEvent,
  QuestionEndedEvent,
  AnswerReceivedEvent,
  GameEndedEvent,
  LeaderboardUpdatedEvent,
  ConnectionState,
} from '../services/signalr.service'

// =============================================================================
// TYPES
// =============================================================================

export type HostPhase =
  | 'idle'        // Initial state
  | 'lobby'       // Waiting for players
  | 'starting'    // Game is starting
  | 'question'    // Showing question
  | 'leaderboard' // Showing leaderboard between questions
  | 'ended'       // Game ended
  | 'error'       // Error state

export interface HostGameState {
  // Connection
  connectionState: ConnectionState

  // Session data
  session: GameSession | null

  // Game flow
  phase: HostPhase
  currentQuestion: GameQuestion | null
  questionResult: QuestionEndedMessage | null

  // Stats
  leaderboard: LeaderboardEntry[]
  answeredCount: number
  totalPlayers: number

  // Error
  error: string | null
}

interface HostGameActions {
  // Connection
  setConnectionState: (state: ConnectionState) => void

  // Session
  setSession: (session: GameSession | null) => void

  // Phase
  setPhase: (phase: HostPhase) => void

  // Question
  setCurrentQuestion: (question: GameQuestion | null) => void
  setQuestionResult: (result: QuestionEndedMessage | null) => void

  // Stats
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void
  setAnsweredCount: (count: number) => void

  // Error
  setError: (error: string | null) => void

  // Event handlers (called from SignalR)
  handlePlayerJoined: (event: PlayerJoinedEvent) => void
  handlePlayerLeft: (event: PlayerLeftEvent) => void
  handleGameStarted: () => void
  handleQuestionStarted: (event: QuestionStartedEvent) => void
  handleQuestionEnded: (event: QuestionEndedEvent) => void
  handleAnswerReceived: (event: AnswerReceivedEvent) => void
  handleLeaderboardUpdated: (event: LeaderboardUpdatedEvent) => void
  handleGameEnded: (event: GameEndedEvent) => void

  // Reset
  reset: () => void
}

interface HostGameStore extends HostGameState {
  actions: HostGameActions
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: HostGameState = {
  connectionState: 'disconnected',
  session: null,
  phase: 'idle',
  currentQuestion: null,
  questionResult: null,
  leaderboard: [],
  answeredCount: 0,
  totalPlayers: 0,
  error: null,
}

// =============================================================================
// STORE
// =============================================================================

export const useHostGameStore = create<HostGameStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      actions: {
        // Connection
        setConnectionState: (connectionState) => {
          set({ connectionState }, false, 'host/setConnectionState')
        },

        // Session
        setSession: (session) => {
          set({
            session,
            totalPlayers: session?.players.length ?? 0,
          }, false, 'host/setSession')
        },

        // Phase
        setPhase: (phase) => {
          set({ phase }, false, 'host/setPhase')
        },

        // Question
        setCurrentQuestion: (currentQuestion) => {
          set({
            currentQuestion,
            answeredCount: 0,
            questionResult: null,
          }, false, 'host/setCurrentQuestion')
        },

        setQuestionResult: (questionResult) => {
          set({ questionResult }, false, 'host/setQuestionResult')
        },

        // Stats
        setLeaderboard: (leaderboard) => {
          set({ leaderboard }, false, 'host/setLeaderboard')
        },

        setAnsweredCount: (answeredCount) => {
          set({ answeredCount }, false, 'host/setAnsweredCount')
        },

        // Error
        setError: (error) => {
          set({ error }, false, 'host/setError')
        },

        // Event handlers
        handlePlayerJoined: (event) => {
          const { session } = get()
          if (!session) return

          // Check if player already exists (prevent duplicates)
          const exists = session.players.some(p => p.id === event.playerId)
          if (exists) return

          const newPlayer = {
            id: event.playerId,
            nickname: event.nickname,
            connectionStatus: 1 as const,
            totalPoints: 0,
            rank: null,
          }

          set({
            session: {
              ...session,
              players: [...session.players, newPlayer],
            },
            totalPlayers: event.totalPlayers,
          }, false, 'host/playerJoined')
        },

        handlePlayerLeft: (event) => {
          const { session } = get()
          if (!session) return

          set({
            session: {
              ...session,
              players: session.players.filter(p => p.id !== event.playerId),
            },
            totalPlayers: event.totalPlayers,
          }, false, 'host/playerLeft')
        },

        handleGameStarted: () => {
          set({ phase: 'starting' }, false, 'host/gameStarted')
        },

        handleQuestionStarted: (event) => {
          const question: GameQuestion = {
            id: event.questionId,
            gameQuestionId: event.gameQuestionId,
            content: event.content,
            type: parseInt(event.questionType) as 1 | 2 | 3 | 4 | 5,
            timeLimit: event.timeLimit,
            positionInGame: event.positionInGame,
            videoUrl: event.videoUrl,
            videoTimestamp: event.videoTimestamp,
            options: event.options.map(o => ({
              index: o.index,
              content: o.content,
              imageUrl: o.imageUrl,
            })),
          }

          set({
            currentQuestion: question,
            phase: 'question',
            answeredCount: 0,
            questionResult: null,
          }, false, 'host/questionStarted')
        },

        handleQuestionEnded: (event) => {
          const result: QuestionEndedMessage = {
            gameQuestionId: event.gameQuestionId,
            correctOptionIndexes: event.correctOptionIndexes,
            correctAnswerCount: event.correctAnswerCount,
            wrongAnswerCount: event.wrongAnswerCount,
            topPlayers: event.topPlayers.map(p => ({
              playerId: p.playerId,
              nickname: p.nickname,
              totalPoints: p.totalPoints,
              correctAnswers: p.correctAnswers,
              rank: p.rank,
              accuracyPercentage: 0, // Backend doesn't send this for QuestionEnded
            })),
          }

          set({
            questionResult: result,
            leaderboard: result.topPlayers,
          }, false, 'host/questionEnded')
        },

        handleAnswerReceived: (event) => {
          set({
            answeredCount: event.answeredCount,
            totalPlayers: event.totalPlayers,
          }, false, 'host/answerReceived')
        },

        handleLeaderboardUpdated: (event) => {
          const leaderboard: LeaderboardEntry[] = event.leaderboard.map(e => ({
            playerId: e.playerId,
            nickname: e.nickname,
            totalPoints: e.totalPoints,
            correctAnswers: e.correctAnswers,
            rank: e.rank,
            accuracyPercentage: 0, // Backend doesn't send this
          }))

          set({ leaderboard }, false, 'host/leaderboardUpdated')
        },

        handleGameEnded: (event) => {
          const finalLeaderboard: LeaderboardEntry[] = event.finalLeaderboard.map(e => ({
            playerId: e.playerId,
            nickname: e.nickname,
            totalPoints: e.totalPoints,
            correctAnswers: e.correctAnswers,
            rank: e.rank,
            accuracyPercentage: 0,
          }))

          set({
            phase: 'ended',
            leaderboard: finalLeaderboard,
          }, false, 'host/gameEnded')
        },

        // Reset
        reset: () => {
          set(initialState, false, 'host/reset')
        },
      },
    }),
    { name: 'HostGameStore' }
  )
)

// =============================================================================
// SELECTORS
// =============================================================================

export const selectHostConnectionState = (s: HostGameStore) => s.connectionState
export const selectHostSession = (s: HostGameStore) => s.session
export const selectHostPhase = (s: HostGameStore) => s.phase
export const selectHostCurrentQuestion = (s: HostGameStore) => s.currentQuestion
export const selectHostQuestionResult = (s: HostGameStore) => s.questionResult
export const selectHostLeaderboard = (s: HostGameStore) => s.leaderboard
export const selectHostAnsweredCount = (s: HostGameStore) => s.answeredCount
export const selectHostTotalPlayers = (s: HostGameStore) => s.totalPlayers
export const selectHostError = (s: HostGameStore) => s.error
export const selectHostActions = (s: HostGameStore) => s.actions
export const selectHostIsConnected = (s: HostGameStore) => s.connectionState === 'connected'

