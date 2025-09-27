// User types
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Quiz types
export interface QuizSet {
  id: string
  title: string
  description?: string
  coverImage?: string
  questionCount: number
  createdAt: string
  updatedAt: string
  userId: string
  questions: Question[]
}

export interface Question {
  id: string
  content: string
  type: QuestionType
  timeLimit: number
  points: number
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  order: number
  quizSetId: string
  // Type-specific fields
  options?: MultipleChoiceOption[]
  correctAnswer?: boolean // for true/false
  pairs?: MatchingPair[]
  items?: OrderingItem[]
  videoUrl?: string
  questionTimestamp?: number
  videoDuration?: number
}

export type QuestionType = 
  | 'multiple_choice'
  | 'true_false'
  | 'matching'
  | 'ordering'
  | 'video_question'

export interface MultipleChoiceOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface MatchingPair {
  id: string
  left: string
  right: string
}

export interface OrderingItem {
  id: string
  text: string
  correctOrder: number
}

// Game types
export interface GameSession {
  id: string
  pin: string
  quizSetId: string
  settings: GameSettings
  status: GameStatus
  players: Player[]
  currentQuestionIndex: number
  createdAt: string
  startedAt?: string
  endedAt?: string
}

export interface GameSettings {
  questionCount: number
  shuffleQuestions: boolean
  enableBackgroundMusic: boolean
  showLeaderboard: boolean
  timeBasedScoring: boolean
}

export type GameStatus = 'waiting' | 'playing' | 'finished'

export interface Player {
  id: string
  nickname: string
  score: number
  isConnected: boolean
  joinedAt: string
}

export interface GameState {
  session: GameSession | null
  isHost: boolean
  currentQuestion: Question | null
  leaderboard: Player[]
  timeRemaining: number
  isConnected: boolean
}

// Challenge types
export interface Challenge {
  id: string
  quizSetId: string
  shareUrl: string
  createdAt: string
  leaderboard: ChallengePlayer[]
}

export interface ChallengePlayer {
  id: string
  nickname: string
  score: number
  completedAt: string
}

// Report types
export interface GameReport {
  id: string
  sessionId: string
  quizSetId: string
  quizSetTitle: string
  playerCount: number
  startedAt: string
  endedAt: string
  duration: number
  leaderboard: Player[]
  questionStats: QuestionStat[]
}

export interface QuestionStat {
  questionId: string
  questionContent: string
  correctAnswers: number
  totalAnswers: number
  accuracyPercentage: number
  optionStats: OptionStat[]
}

export interface OptionStat {
  optionId?: string
  optionText?: string
  selectionCount: number
  percentage: number
  isCorrect: boolean
}

// Socket event types
export interface SocketEvents {
  // Game events
  'game:joined': (data: { session: GameSession }) => void
  'game:player-joined': (data: { player: Player }) => void
  'game:player-left': (data: { playerId: string }) => void
  'game:started': (data: { session: GameSession }) => void
  'game:question-started': (data: { question: Question, timeLimit: number }) => void
  'game:question-ended': (data: { leaderboard: Player[] }) => void
  'game:finished': (data: { finalLeaderboard: Player[] }) => void
  
  // Player events
  'player:answer-submitted': (data: { playerId: string, questionId: string, answer: any }) => void
  'player:disconnected': (data: { playerId: string }) => void
  'player:reconnected': (data: { playerId: string }) => void
  
  // Host events
  'host:next-question': () => void
  'host:kick-player': (data: { playerId: string }) => void
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Form types
export interface CreateQuizSetForm {
  title: string
  description?: string
  coverImage?: File
}

export interface CreateQuestionForm {
  type: QuestionType
  content: string
  timeLimit: number
  points: number
  mediaFile?: File
  // Type-specific fields
  options?: Omit<MultipleChoiceOption, 'id'>[]
  correctAnswer?: boolean
  pairs?: Omit<MatchingPair, 'id'>[]
  items?: Omit<OrderingItem, 'id'>[]
  videoFile?: File
  questionTimestamp?: number
}

// UI types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

export interface Modal {
  id: string
  component: string
  props?: any
  isOpen: boolean
}

// Error types
export interface ApiError {
  message: string
  statusCode: number
  field?: string
}

export interface ValidationError {
  field: string
  message: string
}