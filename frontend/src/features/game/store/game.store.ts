import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { GameState, GameSession, Question, Player } from '../types'

interface GameStore extends GameState {
  actions: {
    setSession: (session: GameSession | null) => void
    setCurrentQuestion: (question: Question | null) => void
    setLeaderboard: (leaderboard: Player[]) => void
    setTimeRemaining: (time: number) => void
    setIsConnected: (connected: boolean) => void
    updatePlayerScore: (playerId: string, score: number) => void
    addPlayer: (player: Player) => void
    removePlayer: (playerId: string) => void
    resetGame: () => void
  }
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set, get) => ({
      // State
      session: null,
      isHost: false,
      currentQuestion: null,
      leaderboard: [],
      timeRemaining: 0,
      isConnected: false,

      // Actions
      actions: {
        setSession: (session: GameSession | null) => {
          set(
            {
              session,
              isHost: session?.status === 'waiting',
            },
            false,
            'game/setSession'
          )
        },

        setCurrentQuestion: (question: Question | null) => {
          set({ currentQuestion: question }, false, 'game/setCurrentQuestion')
        },

        setLeaderboard: (leaderboard: Player[]) => {
          set({ leaderboard }, false, 'game/setLeaderboard')
        },

        setTimeRemaining: (time: number) => {
          set({ timeRemaining: time }, false, 'game/setTimeRemaining')
        },

        setIsConnected: (connected: boolean) => {
          set({ isConnected: connected }, false, 'game/setIsConnected')
        },

        updatePlayerScore: (playerId: string, score: number) => {
          const { leaderboard } = get()
          const updatedLeaderboard = leaderboard
            .map((player) => (player.id === playerId ? { ...player, score } : player))
            .sort((a, b) => b.score - a.score)

          set({ leaderboard: updatedLeaderboard }, false, 'game/updatePlayerScore')
        },

        addPlayer: (player: Player) => {
          const { leaderboard } = get()
          const existingPlayer = leaderboard.find((p) => p.id === player.id)

          if (!existingPlayer) {
            const updatedLeaderboard = [...leaderboard, player].sort((a, b) => b.score - a.score)
            set({ leaderboard: updatedLeaderboard }, false, 'game/addPlayer')
          }
        },

        removePlayer: (playerId: string) => {
          const { leaderboard } = get()
          const updatedLeaderboard = leaderboard.filter((player) => player.id !== playerId)
          set({ leaderboard: updatedLeaderboard }, false, 'game/removePlayer')
        },

        resetGame: () => {
          set(
            {
              session: null,
              isHost: false,
              currentQuestion: null,
              leaderboard: [],
              timeRemaining: 0,
              isConnected: false,
            },
            false,
            'game/resetGame'
          )
        },
      },
    }),
    { name: 'GameStore' }
  )
)

// Selectors for optimized re-renders
export const selectSession = (state: GameStore) => state.session
export const selectIsHost = (state: GameStore) => state.isHost
export const selectCurrentQuestion = (state: GameStore) => state.currentQuestion
export const selectLeaderboard = (state: GameStore) => state.leaderboard
export const selectTimeRemaining = (state: GameStore) => state.timeRemaining
export const selectIsConnected = (state: GameStore) => state.isConnected
export const selectGameActions = (state: GameStore) => state.actions

