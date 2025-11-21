import { axiosInstance } from '@/api/client'
import type { ApiResponse } from '@/types/api'
import type { GameSession, Player, Question } from '../types'

class GameService {
  /**
   * Create a new game session
   * @param quizId Quiz ID to create session for
   * @returns API response with game session
   */
  async createSession(quizId: string): Promise<ApiResponse<GameSession>> {
    const response = await axiosInstance.post<ApiResponse<GameSession>>(
      '/api/game/sessions',
      { quizId }
    )
    return response.data
  }

  /**
   * Join a game session with code
   * @param code Game code
   * @param playerName Player display name
   * @returns API response with game session
   */
  async joinSession(code: string, playerName: string): Promise<ApiResponse<GameSession>> {
    const response = await axiosInstance.post<ApiResponse<GameSession>>(
      '/api/game/sessions/join',
      { code, playerName }
    )
    return response.data
  }

  /**
   * Get game session by ID
   * @param sessionId Game session ID
   * @returns API response with game session
   */
  async getSession(sessionId: string): Promise<ApiResponse<GameSession>> {
    const response = await axiosInstance.get<ApiResponse<GameSession>>(
      `/api/game/sessions/${sessionId}`
    )
    return response.data
  }

  /**
   * Start the game session
   * @param sessionId Game session ID
   * @returns API response
   */
  async startSession(sessionId: string): Promise<ApiResponse<object>> {
    const response = await axiosInstance.post<ApiResponse<object>>(
      `/api/game/sessions/${sessionId}/start`
    )
    return response.data
  }

  /**
   * End the game session
   * @param sessionId Game session ID
   * @returns API response
   */
  async endSession(sessionId: string): Promise<ApiResponse<object>> {
    const response = await axiosInstance.post<ApiResponse<object>>(
      `/api/game/sessions/${sessionId}/end`
    )
    return response.data
  }

  /**
   * Get current question for session
   * @param sessionId Game session ID
   * @returns API response with question
   */
  async getCurrentQuestion(sessionId: string): Promise<ApiResponse<Question>> {
    const response = await axiosInstance.get<ApiResponse<Question>>(
      `/api/game/sessions/${sessionId}/current-question`
    )
    return response.data
  }

  /**
   * Submit player answer
   * @param sessionId Game session ID
   * @param questionId Question ID
   * @param answer Player's answer
   * @returns API response with result
   */
  async submitAnswer(
    sessionId: string,
    questionId: string,
    answer: string | number
  ): Promise<ApiResponse<{ isCorrect: boolean; points: number }>> {
    const response = await axiosInstance.post<ApiResponse<{ isCorrect: boolean; points: number }>>(
      `/api/game/sessions/${sessionId}/answers`,
      { questionId, answer }
    )
    return response.data
  }

  /**
   * Get leaderboard for session
   * @param sessionId Game session ID
   * @returns API response with players sorted by score
   */
  async getLeaderboard(sessionId: string): Promise<ApiResponse<Player[]>> {
    const response = await axiosInstance.get<ApiResponse<Player[]>>(
      `/api/game/sessions/${sessionId}/leaderboard`
    )
    return response.data
  }
}

export const gameService = new GameService()

