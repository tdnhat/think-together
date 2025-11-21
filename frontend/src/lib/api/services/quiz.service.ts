/**
 * Quiz API Service
 * 
 * Handles all quiz-related API calls.
 */

import { api } from '../client';
import { QUIZ_ENDPOINTS, buildUrl } from '../endpoints';
import type {
  ApiResponse,
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
    const response = await api.get<ApiResponse<PaginatedResponse<Quiz>>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải danh sách quiz');
  }
  
  /**
   * Get quiz by ID
   */
  async getQuiz(id: string): Promise<Quiz> {
    const response = await api.get<ApiResponse<Quiz>>(
      QUIZ_ENDPOINTS.GET_QUIZ(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải quiz');
  }
  
  /**
   * Create new quiz
   */
  async createQuiz(data: CreateQuizRequest): Promise<Quiz> {
    const response = await api.post<ApiResponse<Quiz>>(
      QUIZ_ENDPOINTS.CREATE_QUIZ,
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Tạo quiz thất bại');
  }
  
  /**
   * Update quiz
   */
  async updateQuiz(id: string, data: UpdateQuizRequest): Promise<Quiz> {
    const response = await api.put<ApiResponse<Quiz>>(
      QUIZ_ENDPOINTS.UPDATE_QUIZ(id),
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Cập nhật quiz thất bại');
  }
  
  /**
   * Delete quiz
   */
  async deleteQuiz(id: string): Promise<void> {
    const response = await api.delete<ApiResponse>(
      QUIZ_ENDPOINTS.DELETE_QUIZ(id)
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Xóa quiz thất bại');
    }
  }
  
  /**
   * Duplicate quiz
   */
  async duplicateQuiz(id: string): Promise<Quiz> {
    const response = await api.post<ApiResponse<Quiz>>(
      QUIZ_ENDPOINTS.DUPLICATE_QUIZ(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Sao chép quiz thất bại');
  }
  
  // ==========================================================================
  // QUESTIONS
  // ==========================================================================
  
  /**
   * Get questions for a quiz
   */
  async listQuestions(quizId: string): Promise<Question[]> {
    const response = await api.get<ApiResponse<Question[]>>(
      QUIZ_ENDPOINTS.LIST_QUESTIONS(quizId)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải danh sách câu hỏi');
  }
  
  /**
   * Get question by ID
   */
  async getQuestion(quizId: string, questionId: string): Promise<Question> {
    const response = await api.get<ApiResponse<Question>>(
      QUIZ_ENDPOINTS.GET_QUESTION(quizId, questionId)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải câu hỏi');
  }
  
  /**
   * Create new question
   */
  async createQuestion(quizId: string, data: CreateQuestionRequest): Promise<Question> {
    const response = await api.post<ApiResponse<Question>>(
      QUIZ_ENDPOINTS.CREATE_QUESTION(quizId),
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Tạo câu hỏi thất bại');
  }
  
  /**
   * Update question
   */
  async updateQuestion(
    quizId: string,
    questionId: string,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    const response = await api.put<ApiResponse<Question>>(
      QUIZ_ENDPOINTS.UPDATE_QUESTION(quizId, questionId),
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Cập nhật câu hỏi thất bại');
  }
  
  /**
   * Delete question
   */
  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    const response = await api.delete<ApiResponse>(
      QUIZ_ENDPOINTS.DELETE_QUESTION(quizId, questionId)
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Xóa câu hỏi thất bại');
    }
  }
  
  /**
   * Reorder questions
   */
  async reorderQuestions(quizId: string, data: ReorderQuestionsRequest): Promise<void> {
    const response = await api.post<ApiResponse>(
      QUIZ_ENDPOINTS.REORDER_QUESTIONS(quizId),
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Sắp xếp câu hỏi thất bại');
    }
  }
  
  // ==========================================================================
  // SEARCH & FILTER
  // ==========================================================================
  
  /**
   * Search quizzes
   */
  async searchQuizzes(params: SearchParams): Promise<PaginatedResponse<Quiz>> {
    const url = buildUrl(QUIZ_ENDPOINTS.SEARCH_QUIZZES, params);
    const response = await api.get<ApiResponse<PaginatedResponse<Quiz>>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Tìm kiếm quiz thất bại');
  }
  
  /**
   * Get popular quizzes
   */
  async getPopularQuizzes(limit: number = 10): Promise<Quiz[]> {
    const url = buildUrl(QUIZ_ENDPOINTS.GET_POPULAR_QUIZZES, { limit });
    const response = await api.get<ApiResponse<Quiz[]>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải quiz phổ biến');
  }
  
  /**
   * Get featured quizzes
   */
  async getFeaturedQuizzes(limit: number = 10): Promise<Quiz[]> {
    const url = buildUrl(QUIZ_ENDPOINTS.GET_FEATURED_QUIZZES, { limit });
    const response = await api.get<ApiResponse<Quiz[]>>(url);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải quiz nổi bật');
  }
  
  // ==========================================================================
  // PUBLISHING
  // ==========================================================================
  
  /**
   * Publish quiz
   */
  async publishQuiz(id: string): Promise<Quiz> {
    const response = await api.post<ApiResponse<Quiz>>(
      QUIZ_ENDPOINTS.PUBLISH_QUIZ(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Xuất bản quiz thất bại');
  }
  
  /**
   * Unpublish quiz
   */
  async unpublishQuiz(id: string): Promise<Quiz> {
    const response = await api.post<ApiResponse<Quiz>>(
      QUIZ_ENDPOINTS.UNPUBLISH_QUIZ(id)
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Hủy xuất bản quiz thất bại');
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const quizService = new QuizService();
export default quizService;

