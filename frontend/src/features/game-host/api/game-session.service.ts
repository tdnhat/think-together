/**
 * Game Session API Service
 * 
 * REST API client for game session management.
 * Endpoints from FRONTEND_INTEGRATION_GUIDE_QUIZ_HOST.md
 */

import { api } from '@/lib/api/client'
import type { ApiResponse } from '@/types/api'
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
} from '../types'

const GAME_SESSION_ENDPOINTS = {
  BASE: '/api/game-sessions',
  BY_PIN: (pin: string) => `/api/game-sessions/by-pin/${pin}`,
  BY_ID: (id: string) => `/api/game-sessions/${id}`,
  LEADERBOARD: (id: string) => `/api/game-sessions/${id}/leaderboard`,
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
  async createSession(request: CreateGameSessionRequest): Promise<ApiResponse<CreateGameSessionResponse>> {
    return api.post<ApiResponse<CreateGameSessionResponse>>(
      GAME_SESSION_ENDPOINTS.BASE,
      request
    )
  }

  /**
   * Abandon active session (Host only - requires auth)
   */
  async abandonActiveSession(): Promise<ApiResponse<boolean>> {
    return api.post<ApiResponse<boolean>>(
      GAME_SESSION_ENDPOINTS.ABANDON_ACTIVE
    )
  }

  /**
   * Get game session by ID (requires auth)
   */
  async getSessionById(id: string): Promise<ApiResponse<GameSession>> {
    return api.get<ApiResponse<GameSession>>(
      GAME_SESSION_ENDPOINTS.BY_ID(id)
    )
  }

  /**
   * Get game session by PIN (public endpoint)
   */
  async getSessionByPin(pin: string): Promise<ApiResponse<GameSession>> {
    return api.get<ApiResponse<GameSession>>(
      GAME_SESSION_ENDPOINTS.BY_PIN(pin)
    )
  }

  /**
   * Join a game session (public endpoint)
   */
  async joinSession(request: JoinGameSessionRequest): Promise<ApiResponse<JoinGameSessionResponse>> {
    return api.post<ApiResponse<JoinGameSessionResponse>>(
      GAME_SESSION_ENDPOINTS.JOIN,
      request
    )
  }

  /**
   * Reconnect to a game session (public endpoint)
   */
  async reconnect(request: ReconnectRequest): Promise<ApiResponse<ReconnectResponse>> {
    return api.post<ApiResponse<ReconnectResponse>>(
      GAME_SESSION_ENDPOINTS.RECONNECT,
      request
    )
  }

  /**
   * Start the game (Host only - requires auth)
   */
  async startGame(sessionId: string): Promise<ApiResponse<StartGameResponse>> {
    return api.post<ApiResponse<StartGameResponse>>(
      GAME_SESSION_ENDPOINTS.START(sessionId)
    )
  }

  /**
   * Move to next question (Host only - requires auth)
   */
  async nextQuestion(sessionId: string): Promise<ApiResponse<NextQuestionResponse>> {
    return api.post<ApiResponse<NextQuestionResponse>>(
      GAME_SESSION_ENDPOINTS.NEXT_QUESTION(sessionId)
    )
  }

  /**
   * Get current leaderboard (Host only - requires auth)
   */
  async getLeaderboard(sessionId: string): Promise<ApiResponse<LeaderboardEntry[]>> {
    return api.get<ApiResponse<LeaderboardEntry[]>>(
      GAME_SESSION_ENDPOINTS.LEADERBOARD(sessionId)
    )
  }

  /**
   * End the game (Host only - requires auth)
   */
  async endGame(sessionId: string): Promise<ApiResponse<EndGameResponse>> {
    return api.post<ApiResponse<EndGameResponse>>(
      GAME_SESSION_ENDPOINTS.END(sessionId)
    )
  }
}

export const gameSessionService = new GameSessionService()
export default gameSessionService

