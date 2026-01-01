/**
 * Quiz API Service
 * 
 * Handles all quiz-related API calls.
 */

import { api } from '../client';
import { QUIZ_SET_ENDPOINTS, QUIZ_ENDPOINTS, buildUrl } from '../endpoints';
import type {

  PaginatedResponse,
  PaginationParams,
  SearchParams,
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  ReorderQuestionsRequest,
} from '../types';
import type { QuizSetDto } from '@/types/api';

// ============================================================================
// QUIZ SERVICE
// ============================================================================

export class QuizService {
  // ==========================================================================
  // QUIZ CRUD
  // ==========================================================================

  /**
   * Get list of quizzes with pagination
   */
  async listQuizzes(params?: PaginationParams): Promise<PaginatedResponse<Quiz>> {
    const url = buildUrl(QUIZ_ENDPOINTS.LIST_QUIZZES, params);
    const response = await api.get<PaginatedResponse<Quiz>>(url);

    return response;

    // Response handled by error interceptor
  }

  /**
   * Get quiz by ID
   */
  async getQuiz(id: string): Promise<Quiz> {
    const response = await api.get<Quiz>(
      QUIZ_ENDPOINTS.GET_QUIZ(id)
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Create new quiz
   */
  async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    const response = await api.post<Quiz>(
      QUIZ_ENDPOINTS.CREATE_QUIZ,
      data
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Update quiz
   */
  async updateQuiz(id: string, data: UpdateQuizRequest): Promise<Quiz> {
    const response = await api.put<Quiz>(
      QUIZ_ENDPOINTS.UPDATE_QUIZ(id),
      data
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Delete quiz
   */
  async deleteQuiz(id: string): Promise<void> {
    await api.delete(
      QUIZ_ENDPOINTS.DELETE_QUIZ(id)
    );
  }

  /**
   * Duplicate quiz
   */
  async duplicateQuiz(id: string): Promise<Quiz> {
    const response = await api.post<Quiz>(
      QUIZ_ENDPOINTS.DUPLICATE_QUIZ(id)
    );

    return response;

    // Response handled by error interceptor
  }

  // ==========================================================================
  // QUESTIONS
  // ==========================================================================

  /**
   * Get questions for a quiz
   */
  async listQuestions(quizId: string): Promise<Question[]> {
    const response = await api.get<Question[]>(
      QUIZ_ENDPOINTS.LIST_QUESTIONS(quizId)
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Get question by ID
   */
  async getQuestion(quizId: string, questionId: string): Promise<Question> {
    const response = await api.get<Question>(
      QUIZ_ENDPOINTS.GET_QUESTION(quizId, questionId)
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Create new question
   */
  async createQuestion(quizId: string, data: CreateQuestionRequest): Promise<Question> {
    const response = await api.post<Question>(
      QUIZ_ENDPOINTS.CREATE_QUESTION(quizId),
      data
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Update question
   */
  async updateQuestion(
    quizId: string,
    questionId: string,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    const response = await api.put<Question>(
      QUIZ_ENDPOINTS.UPDATE_QUESTION(quizId, questionId),
      data
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Delete question
   */
  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    await api.delete(
      QUIZ_ENDPOINTS.DELETE_QUESTION(quizId, questionId)
    );
  }

  /**
   * Reorder questions
   */
  async reorderQuestions(quizId: string, data: ReorderQuestionsRequest): Promise<void> {
    await api.post(
      QUIZ_ENDPOINTS.REORDER_QUESTIONS(quizId),
      data
    );
  }

  // ==========================================================================
  // SEARCH & FILTER
  // ==========================================================================

  /**
   * Search quizzes
   */
  async searchQuizzes(params: SearchParams): Promise<PaginatedResponse<Quiz>> {
    const url = buildUrl(QUIZ_ENDPOINTS.SEARCH_QUIZZES, params);
    const response = await api.get<PaginatedResponse<Quiz>>(url);

    return response;

    // Response handled by error interceptor
  }

  /**
   * Get popular quizzes
   */
  async getPopularQuizzes(limit: number = 10): Promise<Quiz[]> {
    const url = buildUrl(QUIZ_ENDPOINTS.GET_POPULAR_QUIZZES, { limit });
    const response = await api.get<Quiz[]>(url);

    return response;

    // Response handled by error interceptor
  }

  /**
   * Get featured quizzes
   */
  async getFeaturedQuizzes(limit: number = 10): Promise<Quiz[]> {
    const url = buildUrl(QUIZ_ENDPOINTS.GET_FEATURED_QUIZZES, { limit });
    const response = await api.get<Quiz[]>(url);

    return response;

    // Response handled by error interceptor
  }

  // ==========================================================================
  // PUBLISHING
  // ==========================================================================

  /**
   * Publish quiz
   */
  async publishQuiz(id: string): Promise<Quiz> {
    const response = await api.post<Quiz>(
      QUIZ_ENDPOINTS.PUBLISH_QUIZ(id)
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Unpublish quiz
   */
  async unpublishQuiz(id: string): Promise<Quiz> {
    const response = await api.post<Quiz>(
      QUIZ_ENDPOINTS.UNPUBLISH_QUIZ(id)
    );

    return response;

    // Response handled by error interceptor
  }

  // ==========================================================================
  // QUIZ SET IMAGE UPLOAD
  // ==========================================================================

  /**
   * Upload cover image temporarily (before quiz set is created)
   * Returns the image URL that can be saved with the quiz set
   */
  async uploadQuizSetCoverImageTemp(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('coverImage', file);

    // Don't set Content-Type header - let axios set it automatically with boundary
    const response = await api.post<string>(
      QUIZ_SET_ENDPOINTS.UPLOAD_COVER_IMAGE_TEMP,
      formData
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Upload cover image for a quiz set
   */
  async uploadQuizSetCoverImage(quizSetId: string, file: File): Promise<QuizSetDto> {
    const formData = new FormData();
    formData.append('coverImage', file);

    // Don't set Content-Type header - let axios set it automatically with boundary
    const response = await api.post<QuizSetDto>(
      QUIZ_SET_ENDPOINTS.UPLOAD_COVER_IMAGE(quizSetId),
      formData
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Upload audio file for questions
   * Backend returns { url, fileName, size } directly (not wrapped in ApiResponse)
   */
  async uploadAudio(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    // Don't set Content-Type header - let axios set it automatically with boundary
    // Backend returns { url, fileName, size } directly
    const result = await api.post<{ url: string; fileName: string; size: number }>(
      QUIZ_SET_ENDPOINTS.UPLOAD_AUDIO,
      formData
    );

    if (result && result.url) {
      return result.url;
    }

    throw new Error('Tải âm thanh lên thất bại');
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const quizService = new QuizService();
export default quizService;

