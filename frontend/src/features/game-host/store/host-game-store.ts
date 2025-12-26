/**
 * Host Game Store
 *
 * Event-driven state management for game host.
 * Reacts to backend SignalR events for state changes.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  GameSession,
  GameQuestion,
  LeaderboardEntry,
  QuestionType,
} from '../types'
import type {
  PlayerJoinedEvent,
  PlayerLeftEvent,
  GameStartedEvent,
  QuestionStartedEvent,
  QuestionEndedEvent,
  AnswerReceivedEvent,
  LeaderboardUpdatedEvent,
  GameEndedEvent,
  ConnectionState,
} from '../services/signalr.service'

// =============================================================================
// TYPES
// =============================================================================

export type HostPhase =
  | 'idle'        // Initial state
  | 'lobby'       // Waiting for players
  | 'starting'    // Game is starting (brief transition)
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
  leaderboard: LeaderboardEntry[]

  // Stats
  answeredCount: number
  totalPlayers: number

  // Loading states
  isLoading: boolean
  isStarting: boolean
  isLoadingNext: boolean

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

  // Stats
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void
  setAnsweredCount: (count: number) => void
  setTotalPlayers: (count: number) => void

  // Loading states
  setIsLoading: (isLoading: boolean) => void
  setIsStarting: (isStarting: boolean) => void
  setIsLoadingNext: (isLoadingNext: boolean) => void

  // Error
  setError: (error: string | null) => void

  // Event handlers (called from SignalR)
  handlePlayerJoined: (event: PlayerJoinedEvent) => void
  handlePlayerLeft: (event: PlayerLeftEvent) => void
  handleGameStarted: (event: GameStartedEvent) => void
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
  leaderboard: [],
  answeredCount: 0,
  totalPlayers: 0,
  isLoading: false,
  isStarting: false,
  isLoadingNext: false,
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
            answeredCount: 0, // Reset answered count for new question
          }, false, 'host/setCurrentQuestion')
        },

        // Stats
        setLeaderboard: (leaderboard) => {
          set({ leaderboard }, false, 'host/setLeaderboard')
        },

        setAnsweredCount: (answeredCount) => {
          set({ answeredCount }, false, 'host/setAnsweredCount')
        },

        setTotalPlayers: (totalPlayers) => {
          set({ totalPlayers }, false, 'host/setTotalPlayers')
        },

        // Loading states
        setIsLoading: (isLoading) => {
          set({ isLoading }, false, 'host/setIsLoading')
        },
        setIsStarting: (isStarting) => {
          set({ isStarting }, false, 'host/setIsStarting')
        },
        setIsLoadingNext: (isLoadingNext) => {
          set({ isLoadingNext }, false, 'host/setIsLoadingNext')
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

        handleGameStarted: (event) => {
          // Brief transition to 'starting', will move to 'question' when QuestionStarted arrives
          set({ phase: 'starting' }, false, 'host/gameStarted')
        },

        handleQuestionStarted: (event) => {
          const question: GameQuestion = {
            id: event.questionId,
            gameQuestionId: event.gameQuestionId,
            content: event.content,
            type: parseInt(event.questionType) as QuestionType,
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
            answeredCount: 0, // Reset for new question
          }, false, 'host/questionStarted')
        },

        handleQuestionEnded: (event) => {
          const leaderboard: LeaderboardEntry[] = event.topPlayers.map(p => ({
            playerId: p.playerId,
            nickname: p.nickname,
            totalPoints: p.totalPoints,
            correctAnswers: p.correctAnswers,
            rank: p.rank,
            accuracyPercentage: 0, // Backend doesn't send this
          }))

          set({
            phase: 'leaderboard',
            leaderboard,
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
export const selectHostLeaderboard = (s: HostGameStore) => s.leaderboard
export const selectHostAnsweredCount = (s: HostGameStore) => s.answeredCount
export const selectHostTotalPlayers = (s: HostGameStore) => s.totalPlayers
export const selectHostIsLoading = (s: HostGameStore) => s.isLoading
export const selectHostIsStarting = (s: HostGameStore) => s.isStarting
export const selectHostIsLoadingNext = (s: HostGameStore) => s.isLoadingNext
export const selectHostError = (s: HostGameStore) => s.error
export const selectHostActions = (s: HostGameStore) => s.actions
export const selectHostIsConnected = (s: HostGameStore) => s.connectionState === 'connected'
