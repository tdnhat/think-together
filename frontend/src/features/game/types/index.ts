// Game-specific types

export interface Player {
  id: string
  name: string
  score: number
  avatarUrl?: string | null
  isHost?: boolean
}

export interface Question {
  id: string
  text: string
  type: 'multiple-choice' | 'true-false' | 'short-answer'
  timeLimit: number
  points: number
  options?: string[]
  correctAnswer?: string | number
  mediaUrl?: string | null
  mediaType?: 'image' | 'video' | 'audio' | null
}

export interface GameSession {
  id: string
  code: string
  hostId: string
  quizId: string
  status: 'waiting' | 'in-progress' | 'finished'
  currentQuestionIndex: number
  totalQuestions: number
  players: Player[]
  createdAt: string
  startedAt?: string | null
  endedAt?: string | null
}

export interface GameState {
  session: GameSession | null
  isHost: boolean
  currentQuestion: Question | null
  leaderboard: Player[]
  timeRemaining: number
  isConnected: boolean
}

export interface PlayerAnswer {
  playerId: string
  questionId: string
  answer: string | number
  timeTaken: number
  isCorrect: boolean
  points: number
}

export interface GameResult {
  sessionId: string
  winners: Player[]
  allPlayers: Player[]
  totalQuestions: number
  duration: number
}

