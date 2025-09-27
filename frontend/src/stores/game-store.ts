import { create } from 'zustand'
import { GameState, GameSession, Question, Player } from '@/types'

interface GameStore extends GameState {
  // Actions
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

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  session: null,
  isHost: false,
  currentQuestion: null,
  leaderboard: [],
  timeRemaining: 0,
  isConnected: false,

  // Actions
  setSession: (session: GameSession | null) => {
    set({ 
      session,
      isHost: session?.status === 'waiting' // Simple way to determine if host
    })
  },

  setCurrentQuestion: (question: Question | null) => {
    set({ currentQuestion: question })
  },

  setLeaderboard: (leaderboard: Player[]) => {
    set({ leaderboard })
  },

  setTimeRemaining: (time: number) => {
    set({ timeRemaining: time })
  },

  setIsConnected: (connected: boolean) => {
    set({ isConnected: connected })
  },

  updatePlayerScore: (playerId: string, score: number) => {
    const { leaderboard } = get()
    const updatedLeaderboard = leaderboard.map(player =>
      player.id === playerId ? { ...player, score } : player
    ).sort((a, b) => b.score - a.score) // Sort by score descending
    
    set({ leaderboard: updatedLeaderboard })
  },

  addPlayer: (player: Player) => {
    const { leaderboard } = get()
    const existingPlayer = leaderboard.find(p => p.id === player.id)
    
    if (!existingPlayer) {
      const updatedLeaderboard = [...leaderboard, player]
        .sort((a, b) => b.score - a.score)
      set({ leaderboard: updatedLeaderboard })
    }
  },

  removePlayer: (playerId: string) => {
    const { leaderboard } = get()
    const updatedLeaderboard = leaderboard.filter(player => player.id !== playerId)
    set({ leaderboard: updatedLeaderboard })
  },

  resetGame: () => {
    set({
      session: null,
      isHost: false,
      currentQuestion: null,
      leaderboard: [],
      timeRemaining: 0,
      isConnected: false,
    })
  },
}))