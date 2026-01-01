'use client'

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api'

class CategoryService {
  /**
   * Get all categories
   * @param onlyActive Filter to only active categories
   * @returns API response with categories list
   */
  async getAll(onlyActive: boolean = true): Promise<CategoryDto[]> {
    const queryParams = new URLSearchParams()
    if (onlyActive) {
      queryParams.append('onlyActive', 'true')
    }

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.CATEGORY.LIST_CATEGORIES}?${queryParams.toString()}`
      : API_ENDPOINTS.CATEGORY.LIST_CATEGORIES

    return apiClient.get<CategoryDto[]>(url)
  }

  /**
   * Get category by ID
   * @param id Category ID
   * @returns API response with category details
   */
  async getById(id: string): Promise<CategoryDto> {
    return apiClient.get<CategoryDto>(
      API_ENDPOINTS.CATEGORY.GET_CATEGORY(id)
    )
  }

  /**
   * Create a new category
   * @param data Category creation data
   * @returns API response with created category
   */
  async create(data: CreateCategoryRequest): Promise<CategoryDto> {
    return apiClient.post<CategoryDto>(
      API_ENDPOINTS.CATEGORY.CREATE_CATEGORY,
      data
    )
  }

  /**
   * Update an existing category
   * @param data Category update data
   * @returns API response with updated category
   */
  async update(data: UpdateCategoryRequest): Promise<CategoryDto> {
    return apiClient.put<CategoryDto>(
      API_ENDPOINTS.CATEGORY.UPDATE_CATEGORY(data.id),
      data
    )
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns API response
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CATEGORY.DELETE_CATEGORY(id))
  }

  /**
   * Search categories by name
   * @param term Search term
   * @returns API response with matching categories
   */
  async search(term: string): Promise<CategoryDto[]> {
    const queryParams = new URLSearchParams()
    queryParams.append('searchTerm', term)

    const url = `${API_ENDPOINTS.CATEGORY.SEARCH_CATEGORIES}?${queryParams.toString()}`
    return apiClient.get<CategoryDto[]>(url)
  }
}

export const categoryService = new CategoryService()
