import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  
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
  async getPublicQuizSets(params?: QuizSetQueryParams): Promise<PaginatedResponse<QuizSetDto>> {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS}/public?${queryParams.toString()}`
      : `${API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS}/public`

    return apiClient.get<PaginatedResponse<QuizSetDto>>(url)
  }

  /**
   * Get all quiz sets for the current user with filtering, sorting, and pagination
   * @param params Query parameters for filtering, sorting, and pagination
   * @returns API response with paginated quiz sets
   */
  async getAllQuizSets(params?: QuizSetQueryParams): Promise<PaginatedResponse<QuizSetDto>> {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.filterBy && params.filterBy !== 'all') queryParams.append('filterBy', params.filterBy)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS}?${queryParams.toString()}`
      : API_ENDPOINTS.QUIZ_SET.LIST_QUIZ_SETS

    return apiClient.get<PaginatedResponse<QuizSetDto>>(url)
  }

  /**
   * Get a specific quiz set by ID
   * @param id Quiz set ID
   * @returns API response with quiz set details
   */
  async getQuizSetById(id: string): Promise<QuizSetDto> {
    return apiClient.get<QuizSetDto>(
      API_ENDPOINTS.QUIZ_SET.GET_QUIZ_SET(id)
    )
  }

  /**
   * Create a new quiz set
   * @param data Quiz set creation data
   * @returns API response with created quiz set
   */
  async createQuizSet(data: CreateQuizSetRequest): Promise<QuizSetDto> {
    // Clean data: convert empty strings to undefined for optional fields
    const cleanedData: CreateQuizSetRequest = {
      title: data.title,
      description: data.description === "" ? undefined : data.description,
      coverImageUrl: data.coverImageUrl === "" ? undefined : data.coverImageUrl,
      categoryId: data.categoryId === "" ? undefined : data.categoryId,
    }

    return apiClient.post<QuizSetDto>(
      API_ENDPOINTS.QUIZ_SET.CREATE_QUIZ_SET,
      cleanedData
    )
  }

  /**
   * Update an existing quiz set
   * @param data Quiz set update data
   * @returns API response with updated quiz set
   */
  async updateQuizSet(data: UpdateQuizSetRequest): Promise<QuizSetDto> {
    // Clean data: convert empty strings to undefined for optional fields
    const cleanedData: UpdateQuizSetRequest = {
      id: data.id,
      title: data.title,
      description: data.description === "" ? undefined : data.description,
      coverImageUrl: data.coverImageUrl === "" ? undefined : data.coverImageUrl,
      categoryId: data.categoryId === "" ? undefined : data.categoryId,
    }

    return apiClient.put<QuizSetDto>(
      API_ENDPOINTS.QUIZ_SET.UPDATE_QUIZ_SET(data.id),
      cleanedData
    )
  }

  /**
   * Delete a quiz set
   * @param id Quiz set ID to delete
   * @returns API response
   */
  async deleteQuizSet(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.QUIZ_SET.DELETE_QUIZ_SET(id))
  }

  /**
   * Publish a quiz set
   * @param id Quiz set ID to publish
   * @returns API response
   */
  async publishQuizSet(id: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.QUIZ_SET.PUBLISH_QUIZ_SET(id))
  }

  /**
   * Duplicate a quiz set
   * @param id Quiz set ID to duplicate
   * @returns API response with duplicated quiz set
   */
  async duplicateQuizSet(id: string): Promise<QuizSetDto> {
    return apiClient.post<QuizSetDto>(
      API_ENDPOINTS.QUIZ_SET.DUPLICATE_QUIZ_SET(id)
    )
  }

  /**
   * Export quiz set to PDF
   * @param id Quiz set ID
   * @returns Blob data
   */
  async exportPdf(id: string): Promise<Blob | null> {
    try {
      const response = await apiClient.get<Blob>(
        `${API_ENDPOINTS.QUIZ_SET.GET_QUIZ_SET(id)}/export-pdf`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { responseType: 'blob' } as any
      )
      return response
    } catch (error) {
      console.error('Error exporting quiz set:', error)
      return null
    }
  }
}

export const quizSetService = new QuizSetService()
