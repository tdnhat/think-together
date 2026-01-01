/**
 * Game Session API Service
 * 
 * REST API client for game session management.
 * Endpoints from FRONTEND_INTEGRATION_GUIDE_QUIZ_HOST.md
 */

import { api } from '@/lib/api/client'
import type {
  CreateGameSessionRequest,
  CreateGameSessionResponse,
  JoinGameSessionRequest,
  JoinGameSessionResponse,
  ReconnectRequest,
  ReconnectResponse,
  StartGameResponse,
  NextQuestionResponse,
  EndGameResponse,
  GameSession,
  LeaderboardEntry,
  SyncGameSessionResult,
} from '../types'

const GAME_SESSION_ENDPOINTS = {
  BASE: '/api/game-sessions',
  BY_PIN: (pin: string) => `/api/game-sessions/by-pin/${pin}`,
  BY_ID: (id: string) => `/api/game-sessions/${id}`,
  LEADERBOARD: (id: string) => `/api/game-sessions/${id}/leaderboard`,
  SYNC: (id: string) => `/api/game-sessions/${id}/sync`,
  ABANDON_ACTIVE: '/api/game-sessions/abandon-active',
  JOIN: '/api/game-sessions/join',
  RECONNECT: '/api/game-sessions/reconnect',
  START: (id: string) => `/api/game-sessions/${id}/start`,
  NEXT_QUESTION: (id: string) => `/api/game-sessions/${id}/next-question`,
  END: (id: string) => `/api/game-sessions/${id}/end`,
}

class GameSessionService {
  /**
   * Create a new game session (Host only - requires auth)
   */
  async createSession(request: CreateGameSessionRequest): Promise<CreateGameSessionResponse> {
    return api.post<CreateGameSessionResponse>(
      GAME_SESSION_ENDPOINTS.BASE,
      request
    )
  }

  /**
   * Abandon active session (Host only - requires auth)
   */
  async abandonActiveSession(): Promise<boolean> {
    return api.post<boolean>(
      GAME_SESSION_ENDPOINTS.ABANDON_ACTIVE
    )
  }

  /**
   * Get game session by ID (requires auth)
   */
  async getSessionById(id: string): Promise<GameSession> {
    return api.get<GameSession>(
      GAME_SESSION_ENDPOINTS.BY_ID(id)
    )
  }

  /**
   * Get game session by PIN (public endpoint)
   */
  async getSessionByPin(pin: string): Promise<GameSession> {
    return api.get<GameSession>(
      GAME_SESSION_ENDPOINTS.BY_PIN(pin)
    )
  }

  /**
   * Join a game session (public endpoint)
   */
  async joinSession(request: JoinGameSessionRequest): Promise<JoinGameSessionResponse> {
    return api.post<JoinGameSessionResponse>(
      GAME_SESSION_ENDPOINTS.JOIN,
      request
    )
  }

  /**
   * Reconnect to a game session (public endpoint)
   */
  async reconnect(request: ReconnectRequest): Promise<ReconnectResponse> {
    return api.post<ReconnectResponse>(
      GAME_SESSION_ENDPOINTS.RECONNECT,
      request
    )
  }

  /**
   * Start the game (Host only - requires auth)
   */
  async startGame(sessionId: string): Promise<StartGameResponse> {
    return api.post<StartGameResponse>(
      GAME_SESSION_ENDPOINTS.START(sessionId)
    )
  }

  /**
   * Move to next question (Host only - requires auth)
   */
  async nextQuestion(sessionId: string): Promise<NextQuestionResponse> {
    return api.post<NextQuestionResponse>(
      GAME_SESSION_ENDPOINTS.NEXT_QUESTION(sessionId)
    )
  }

  /**
   * Get current leaderboard (Host only - requires auth)
   */
  async getLeaderboard(sessionId: string): Promise<LeaderboardEntry[]> {
    return api.get<LeaderboardEntry[]>(
      GAME_SESSION_ENDPOINTS.LEADERBOARD(sessionId)
    )
  }

  /**
   * End the game (Host only - requires auth)
   */
  async endGame(sessionId: string): Promise<EndGameResponse> {
    return api.post<EndGameResponse>(
      GAME_SESSION_ENDPOINTS.END(sessionId)
    )
  }

  /**
   * Sync game session state (public endpoint)
   * Used for state recovery after browser refresh or reconnection
   */
  async syncGameSession(sessionId: string, playerId?: string): Promise<SyncGameSessionResult> {
    const url = playerId
      ? `${GAME_SESSION_ENDPOINTS.SYNC(sessionId)}?playerId=${playerId}`
      : GAME_SESSION_ENDPOINTS.SYNC(sessionId)
    return api.get<SyncGameSessionResult>(url)
  }
}

export const gameSessionService = new GameSessionService()
export default gameSessionService
