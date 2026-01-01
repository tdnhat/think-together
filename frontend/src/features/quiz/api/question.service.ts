'use client'

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  
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
  ): Promise<PaginatedResponse<QuestionDto>> {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.filterBy && params.filterBy !== 'all') queryParams.append('filterBy', params.filterBy)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.QUIZ_SET.LIST_QUESTIONS(quizSetId)}?${queryParams.toString()}`
      : API_ENDPOINTS.QUIZ_SET.LIST_QUESTIONS(quizSetId)

    return apiClient.get<PaginatedResponse<QuestionDto>>(url)
  }

  async getQuestionById(quizSetId: string, questionId: string): Promise<QuestionDto> {
    return apiClient.get<QuestionDto>(
      API_ENDPOINTS.QUIZ_SET.GET_QUESTION(quizSetId, questionId)
    )
  }

  async createQuestion(data: CreateQuestionRequest): Promise<QuestionDto> {
    return apiClient.post<QuestionDto>(
      API_ENDPOINTS.QUIZ_SET.CREATE_QUESTION(data.quizSetId),
      data
    )
  }

  async updateQuestion(quizSetId: string, data: UpdateQuestionRequest): Promise<QuestionDto> {
    return apiClient.put<QuestionDto>(
      API_ENDPOINTS.QUIZ_SET.UPDATE_QUESTION(quizSetId, data.id),
      data
    )
  }

  async deleteQuestion(quizSetId: string, questionId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.QUIZ_SET.DELETE_QUESTION(quizSetId, questionId))
  }

  async reorderQuestions(data: ReorderQuestionsRequest): Promise<void> {
    await apiClient.put(
      API_ENDPOINTS.QUIZ_SET.REORDER_QUESTIONS(data.quizSetId),
      data
    )
  }

  async duplicateQuestion(quizSetId: string, questionId: string): Promise<QuestionDto> {
    return apiClient.post<QuestionDto>(
      API_ENDPOINTS.QUIZ_SET.DUPLICATE_QUESTION(quizSetId, questionId)
    )
  }
}

export const questionService = new QuestionService()
