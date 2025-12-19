/**
 * Homework API Service
 * Handles API calls for homework-related data
 */

import { api } from '@/lib/api/client'
import { CLASS_ENDPOINTS, buildQueryString } from '@/lib/api/endpoints'
import type { ApiResponse } from '@/lib/api/types'
import type {
  HomeworkDto,
  HomeworkDetailDto,
  HomeworkQueryParams,
  CreateHomeworkRequest,
  UpdateHomeworkRequest,
  HomeworkResponseDto,
} from '../types'

/**
 * Get homeworks for a class
 */
export async function getHomeworks(
  params: HomeworkQueryParams
): Promise<HomeworkResponseDto> {
  const queryParams: Record<string, unknown> = {
    page: params.page || 1,
    pageSize: params.pageSize || 20,
  }

  const queryString = buildQueryString(queryParams)
  const response = await api.get<ApiResponse<HomeworkResponseDto>>(
    `${CLASS_ENDPOINTS.GET_HOMEWORKS(params.classId)}${queryString}`
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải danh sách bài tập về nhà')
  }

  return response.data
}

/**
 * Get homework by ID
 */
export async function getHomeworkById(
  classId: string,
  homeworkId: string
): Promise<HomeworkDetailDto> {
  const response = await api.get<ApiResponse<HomeworkDetailDto>>(
    CLASS_ENDPOINTS.GET_HOMEWORK(classId, homeworkId)
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải bài tập về nhà')
  }

  return response.data
}

/**
 * Create homework
 */
export async function createHomework(
  data: CreateHomeworkRequest
): Promise<HomeworkDto> {
  const response = await api.post<ApiResponse<HomeworkDto>>(
    CLASS_ENDPOINTS.CREATE_HOMEWORK(data.classId),
    {
      quizSetId: data.quizSetId,
      title: data.title,
      dueDate: data.dueDate,
    }
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tạo bài tập về nhà')
  }

  return response.data
}

/**
 * Update homework
 */
export async function updateHomework(
  classId: string,
  homeworkId: string,
  data: UpdateHomeworkRequest
): Promise<HomeworkDto> {
  const response = await api.put<ApiResponse<HomeworkDto>>(
    CLASS_ENDPOINTS.UPDATE_HOMEWORK(classId, homeworkId),
    data
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể cập nhật bài tập về nhà')
  }

  return response.data
}

/**
 * Delete homework
 */
export async function deleteHomework(
  classId: string,
  homeworkId: string
): Promise<void> {
  const response = await api.delete<ApiResponse<void>>(
    CLASS_ENDPOINTS.DELETE_HOMEWORK(classId, homeworkId)
  )

  if (!response.success) {
    throw new Error(response.message || 'Không thể xóa bài tập về nhà')
  }
}
