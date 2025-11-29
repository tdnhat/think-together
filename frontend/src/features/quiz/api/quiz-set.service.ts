import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  ApiResponse,
  QuizSetDto,
  CreateQuizSetRequest,
  UpdateQuizSetRequest,
  PaginatedResponse,
  QuizSetQueryParams,
} from '@/types/api'

class QuizSetService {
  /**
   * Get public published quiz sets for discovery with filtering, sorting, and pagination
   * @param params Query parameters for filtering, sorting, and pagination
   * @returns API response with paginated quiz sets
   */
  async getPublicQuizSets(params?: QuizSetQueryParams): Promise<ApiResponse<PaginatedResponse<QuizSetDto>>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append('search', params.search)
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

      const url = queryParams.toString() 
        ? `${API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS}/public?${queryParams.toString()}`
        : `${API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS}/public`

      const response = await apiClient.get<PaginatedResponse<QuizSetDto>>(url)
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error fetching public quiz sets:', error)
      return {
        success: false,
        message: 'Không thể tải danh sách bài kiểm tra',
      }
    }
  }

  /**
   * Get all quiz sets for the current user with filtering, sorting, and pagination
   * @param params Query parameters for filtering, sorting, and pagination
   * @returns API response with paginated quiz sets
   */
  async getAllQuizSets(params?: QuizSetQueryParams): Promise<ApiResponse<PaginatedResponse<QuizSetDto>>> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.search) queryParams.append('search', params.search)
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
      if (params?.filterBy && params.filterBy !== 'all') queryParams.append('filterBy', params.filterBy)
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

      const url = queryParams.toString() 
        ? `${API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS}?${queryParams.toString()}`
        : API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS

      const response = await apiClient.get<PaginatedResponse<QuizSetDto>>(url)
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error fetching quiz sets:', error)
      return {
        success: false,
        message: 'Không thể tải danh sách bộ trắc nghiệm',
      }
    }
  }

  /**
   * Get a specific quiz set by ID
   * @param id Quiz set ID
   * @returns API response with quiz set details
   */
  async getQuizSetById(id: string): Promise<ApiResponse<QuizSetDto>> {
    try {
      const response = await apiClient.get<ApiResponse<QuizSetDto>>(
        API_ENDPOINTS.QUIZ_SET.GET_QUIZ_SET(id)
      )
      return response
    } catch (error) {
      console.error('Error fetching quiz set:', error)
      return {
        success: false,
        message: 'Không thể tải bộ trắc nghiệm',
      }
    }
  }

  /**
   * Create a new quiz set
   * @param data Quiz set creation data
   * @returns API response with created quiz set
   */
  async createQuizSet(data: CreateQuizSetRequest): Promise<ApiResponse<QuizSetDto>> {
    try {
      const response = await apiClient.post<ApiResponse<QuizSetDto>>(
        API_ENDPOINTS.QUIZ_SET.CREATE_QUIZ_SET,
        data
      )
      return response
    } catch (error) {
      console.error('Error creating quiz set:', error)
      return {
        success: false,
        message: 'Không thể tạo bộ trắc nghiệm',
      }
    }
  }

  /**
   * Update an existing quiz set
   * @param data Quiz set update data
   * @returns API response with updated quiz set
   */
  async updateQuizSet(data: UpdateQuizSetRequest): Promise<ApiResponse<QuizSetDto>> {
    try {
      const response = await apiClient.put<ApiResponse<QuizSetDto>>(
        API_ENDPOINTS.QUIZ_SET.UPDATE_QUIZ_SET(data.id),
        data
      )
      return response
    } catch (error) {
      console.error('Error updating quiz set:', error)
      return {
        success: false,
        message: 'Không thể cập nhật bộ trắc nghiệm',
      }
    }
  }

  /**
   * Delete a quiz set
   * @param id Quiz set ID to delete
   * @returns API response
   */
  async deleteQuizSet(id: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(API_ENDPOINTS.QUIZ_SET.DELETE_QUIZ_SET(id))
      return {
        success: true,
        message: 'Bộ trắc nghiệm đã được xóa thành công',
      }
    } catch (error) {
      console.error('Error deleting quiz set:', error)
      return {
        success: false,
        message: 'Không thể xóa bộ trắc nghiệm',
      }
    }
  }

  /**
   * Publish a quiz set
   * @param id Quiz set ID to publish
   * @returns API response
   */
  async publishQuizSet(id: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.post(API_ENDPOINTS.QUIZ_SET.PUBLISH_QUIZ_SET(id))
      return {
        success: true,
        message: 'Bộ trắc nghiệm đã được xuất bản thành công',
      }
    } catch (error) {
      console.error('Error publishing quiz set:', error)
      return {
        success: false,
        message: 'Không thể xuất bản bộ trắc nghiệm',
      }
    }
  }

  /**
   * Duplicate a quiz set
   * @param id Quiz set ID to duplicate
   * @returns API response with duplicated quiz set
   */
  async duplicateQuizSet(id: string): Promise<ApiResponse<QuizSetDto>> {
    try {
      const response = await apiClient.post<ApiResponse<QuizSetDto>>(
        API_ENDPOINTS.QUIZ_SET.DUPLICATE_QUIZ_SET(id)
      )
      return response
    } catch (error) {
      console.error('Error duplicating quiz set:', error)
      return {
        success: false,
        message: 'Không thể sao chép bộ trắc nghiệm',
      }
    }
  }
}

export const quizSetService = new QuizSetService()
