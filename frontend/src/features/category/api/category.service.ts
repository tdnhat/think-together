import { apiClient } from '@/api/client'
import { CategoryDto, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/api'

export const categoryService = {
  async getAll(onlyActive: boolean = true): Promise<CategoryDto[]> {
    const response = await apiClient.get<CategoryDto[]>('/api/categories', {
      params: { onlyActive }
    })
    return response.data
  },

  async getById(id: string): Promise<CategoryDto> {
    const response = await apiClient.get<CategoryDto>(`/api/categories/${id}`)
    return response.data
  },

  async create(data: CreateCategoryRequest): Promise<CategoryDto> {
    const response = await apiClient.post<CategoryDto>('/api/categories', data)
    return response.data
  },

  async update(data: UpdateCategoryRequest): Promise<CategoryDto> {
    const response = await apiClient.put<CategoryDto>(
      `/api/categories/${data.id}`,
      data
    )
    return response.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/categories/${id}`)
  },

  async search(term: string): Promise<CategoryDto[]> {
    const response = await apiClient.get<CategoryDto[]>(
      '/api/categories/search',
      {
        params: { searchTerm: term }
      }
    )
    return response.data
  }
}

