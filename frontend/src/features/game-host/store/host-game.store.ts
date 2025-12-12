/**
 * Host Game Store
 * 
 * Zustand store for managing host game state.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  GameSession,
  GameQuestion,
  LeaderboardEntry,
  QuestionEndedMessage,
  GamePhase,
  HostGameState,
  PlayerJoinedMessage,
  PlayerLeftMessage,
  AnswerReceivedMessage,
  GameEndedMessage,
} from '../types'

interface HostGameStore extends HostGameState {
  actions: {
    setPhase: (phase: GamePhase) => void
    setSession: (session: GameSession | null) => void
    setCurrentQuestion: (question: GameQuestion | null) => void
    setQuestionResult: (result: QuestionEndedMessage | null) => void
    setLeaderboard: (leaderboard: LeaderboardEntry[]) => void
    setError: (error: string | null) => void
    setConnected: (connected: boolean) => void
    incrementAnsweredCount: () => void
    resetAnsweredCount: () => void
    handlePlayerJoined: (message: PlayerJoinedMessage) => void
    handlePlayerLeft: (message: PlayerLeftMessage) => void
    handleAnswerReceived: (message: AnswerReceivedMessage) => void
    handleGameEnded: (message: GameEndedMessage) => void
    reset: () => void
  }
}

const initialState: HostGameState = {
  phase: 'idle',
  session: null,
  currentQuestion: null,
  questionResult: null,
  leaderboard: [],
  answeredCount: 0,
  error: null,
  isConnected: false,
}

export const useHostGameStore = create<HostGameStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      actions: {
        setPhase: (phase) => {
          set({ phase }, false, 'hostGame/setPhase')
        },

        setSession: (session) => {
          set({ session }, false, 'hostGame/setSession')
        },

        setCurrentQuestion: (question) => {
          set({ 
            currentQuestion: question, 
            answeredCount: 0 
          }, false, 'hostGame/setCurrentQuestion')
        },

        setQuestionResult: (result) => {
          set({ questionResult: result }, false, 'hostGame/setQuestionResult')
        },

        setLeaderboard: (leaderboard) => {
          set({ leaderboard }, false, 'hostGame/setLeaderboard')
        },

        setError: (error) => {
          set({ 
            error, 
            phase: error ? 'error' : get().phase 
          }, false, 'hostGame/setError')
        },

        setConnected: (connected) => {
          set({ isConnected: connected }, false, 'hostGame/setConnected')
        },

        incrementAnsweredCount: () => {
          set(
            (state) => ({ answeredCount: state.answeredCount + 1 }),
            false,
            'hostGame/incrementAnsweredCount'
          )
        },

        resetAnsweredCount: () => {
          set({ answeredCount: 0 }, false, 'hostGame/resetAnsweredCount')
        },

        handlePlayerJoined: (message) => {
          const { session } = get()
          if (!session) return

          const existingPlayer = session.players.find(p => p.id === message.playerId)
          if (!existingPlayer) {
            const updatedPlayers = [
              ...session.players,
              {
                id: message.playerId,
                nickname: message.nickname,
                connectionStatus: 1, // Connected
                totalPoints: 0,
                rank: null,
              },
            ]
            set(
              { session: { ...session, players: updatedPlayers } },
              false,
              'hostGame/handlePlayerJoined'
            )
          }
        },

        handlePlayerLeft: (message) => {
          const { session } = get()
          if (!session) return

          const updatedPlayers = session.players.filter(p => p.id !== message.playerId)
          set(
            { session: { ...session, players: updatedPlayers } },
            false,
            'hostGame/handlePlayerLeft'
          )
        },

        handleAnswerReceived: (message) => {
          set({ answeredCount: message.answeredCount }, false, 'hostGame/handleAnswerReceived')
        },

        handleGameEnded: (message) => {
          set(
            {
              phase: 'ended',
              leaderboard: message.finalLeaderboard,
            },
            false,
            'hostGame/handleGameEnded'
          )
        },

        reset: () => {
          set(initialState, false, 'hostGame/reset')
        },
      },
    }),
    { name: 'HostGameStore' }
  )
)

// Selectors
export const selectHostPhase = (state: HostGameStore) => state.phase
export const selectHostSession = (state: HostGameStore) => state.session
export const selectHostCurrentQuestion = (state: HostGameStore) => state.currentQuestion
export const selectHostQuestionResult = (state: HostGameStore) => state.questionResult
export const selectHostLeaderboard = (state: HostGameStore) => state.leaderboard
export const selectHostAnsweredCount = (state: HostGameStore) => state.answeredCount
export const selectHostError = (state: HostGameStore) => state.error
export const selectHostIsConnected = (state: HostGameStore) => state.isConnected
export const selectHostActions = (state: HostGameStore) => state.actions
