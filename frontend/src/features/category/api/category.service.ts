'use client'

import { apiClient } from '@/lib/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import type {
  ApiResponse,
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
  async getAll(onlyActive: boolean = true): Promise<ApiResponse<CategoryDto[]>> {
    try {
      const queryParams = new URLSearchParams()
      if (onlyActive) {
        queryParams.append('onlyActive', 'true')
      }

      const url = queryParams.toString()
        ? `${API_ENDPOINTS.CATEGORY.LIST_CATEGORIES}?${queryParams.toString()}`
        : API_ENDPOINTS.CATEGORY.LIST_CATEGORIES

      const response = await apiClient.get<CategoryDto[]>(url)
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return {
        success: false,
        message: 'Không thể tải danh sách danh mục',
      }
    }
  }

  /**
   * Get category by ID
   * @param id Category ID
   * @returns API response with category details
   */
  async getById(id: string): Promise<ApiResponse<CategoryDto>> {
    try {
      const response = await apiClient.get<CategoryDto>(
        API_ENDPOINTS.CATEGORY.GET_CATEGORY(id)
      )
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error fetching category:', error)
      return {
        success: false,
        message: 'Không thể tải danh mục',
      }
    }
  }

  /**
   * Create a new category
   * @param data Category creation data
   * @returns API response with created category
   */
  async create(data: CreateCategoryRequest): Promise<ApiResponse<CategoryDto>> {
    try {
      const response = await apiClient.post<CategoryDto>(
        API_ENDPOINTS.CATEGORY.CREATE_CATEGORY,
        data
      )
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error creating category:', error)
      return {
        success: false,
        message: 'Không thể tạo danh mục',
      }
    }
  }

  /**
   * Update an existing category
   * @param data Category update data
   * @returns API response with updated category
   */
  async update(data: UpdateCategoryRequest): Promise<ApiResponse<CategoryDto>> {
    try {
      const response = await apiClient.put<CategoryDto>(
        API_ENDPOINTS.CATEGORY.UPDATE_CATEGORY(data.id),
        data
      )
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error updating category:', error)
      return {
        success: false,
        message: 'Không thể cập nhật danh mục',
      }
    }
  }

  /**
   * Delete a category
   * @param id Category ID
   * @returns API response
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORY.DELETE_CATEGORY(id))
      return {
        success: true,
        message: 'Danh mục đã được xóa thành công',
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      return {
        success: false,
        message: 'Không thể xóa danh mục',
      }
    }
  }

  /**
   * Search categories by name
   * @param term Search term
   * @returns API response with matching categories
   */
  async search(term: string): Promise<ApiResponse<CategoryDto[]>> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('searchTerm', term)

      const url = `${API_ENDPOINTS.CATEGORY.SEARCH_CATEGORIES}?${queryParams.toString()}`
      const response = await apiClient.get<CategoryDto[]>(url)
      return {
        success: true,
        data: response,
      }
    } catch (error) {
      console.error('Error searching categories:', error)
      return {
        success: false,
        message: 'Không thể tìm kiếm danh mục',
      }
    }
  }
}

export const categoryService = new CategoryService()
