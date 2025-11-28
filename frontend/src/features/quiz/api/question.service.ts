'use client'

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  ApiResponse,
  QuestionDto,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  ReorderQuestionsRequest,
  PaginatedResponse,
  QuestionQueryParams,
} from '@/types/api'

class QuestionService {

  async getQuestionsByQuizSetId(
    quizSetId: string,
    params?: QuestionQueryParams
  ): Promise<ApiResponse<PaginatedResponse<QuestionDto>>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append('search', params.search)
      if (params?.filterBy && params.filterBy !== 'all') queryParams.append('filterBy', params.filterBy)
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

      const url = queryParams.toString()
        ? `${API_ENDPOINTS.QUIZ_SET.LIST_QUESTIONS(quizSetId)}?${queryParams.toString()}`
        : API_ENDPOINTS.QUIZ_SET.LIST_QUESTIONS(quizSetId)

      const response = await apiClient.get<PaginatedResponse<QuestionDto>>(url)
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      return {
        success: false,
        message: 'Không thể tải danh sách câu hỏi',
      }
    }
  }

  async getQuestionById(quizSetId: string, questionId: string): Promise<ApiResponse<QuestionDto>> {
    try {
      const response = await apiClient.get<ApiResponse<QuestionDto>>(
        API_ENDPOINTS.QUIZ_SET.GET_QUESTION(quizSetId, questionId)
      )
      return response
    } catch (error) {
      console.error('Error fetching question:', error)
      return {
        success: false,
        message: 'Không thể tải câu hỏi',
      }
    }
  }

  async createQuestion(data: CreateQuestionRequest): Promise<ApiResponse<QuestionDto>> {
    try {
      const response = await apiClient.post<ApiResponse<QuestionDto>>(
        API_ENDPOINTS.QUIZ_SET.CREATE_QUESTION(data.quizSetId),
        data
      )
      return response
    } catch (error) {
      console.error('Error creating question:', error)
      return {
        success: false,
        message: 'Không thể tạo câu hỏi',
      }
    }
  }

  async updateQuestion(quizSetId: string, data: UpdateQuestionRequest): Promise<ApiResponse<QuestionDto>> {
    try {
      const response = await apiClient.put<ApiResponse<QuestionDto>>(
        API_ENDPOINTS.QUIZ_SET.UPDATE_QUESTION(quizSetId, data.id),
        data
      )
      return response
    } catch (error) {
      console.error('Error updating question:', error)
      return {
        success: false,
        message: 'Không thể cập nhật câu hỏi',
      }
    }
  }

  async deleteQuestion(quizSetId: string, questionId: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(API_ENDPOINTS.QUIZ_SET.DELETE_QUESTION(quizSetId, questionId))
      return {
        success: true,
        message: 'Câu hỏi đã được xóa thành công',
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      return {
        success: false,
        message: 'Không thể xóa câu hỏi',
      }
    }
  }

  async reorderQuestions(data: ReorderQuestionsRequest): Promise<ApiResponse<void>> {
    try {
      await apiClient.put(
        API_ENDPOINTS.QUIZ_SET.REORDER_QUESTIONS(data.quizSetId),
        data
      )
      return {
        success: true,
        message: 'Thứ tự câu hỏi đã được cập nhật',
      }
    } catch (error) {
      console.error('Error reordering questions:', error)
      return {
        success: false,
        message: 'Không thể cập nhật thứ tự câu hỏi',
      }
    }
  }

  async duplicateQuestion(quizSetId: string, questionId: string): Promise<ApiResponse<QuestionDto>> {
    try {
      const response = await apiClient.post<ApiResponse<QuestionDto>>(
        API_ENDPOINTS.QUIZ_SET.DUPLICATE_QUESTION(quizSetId, questionId)
      )
      return response
    } catch (error) {
      console.error('Error duplicating question:', error)
      return {
        success: false,
        message: 'Không thể sao chép câu hỏi',
      }
    }
  }
}

export const questionService = new QuestionService()

