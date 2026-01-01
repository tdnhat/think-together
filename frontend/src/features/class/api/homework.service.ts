/**
 * Homework API Service
 * Handles API calls for homework-related data
 */

import { api } from '@/lib/api/client'
import { CLASS_ENDPOINTS, buildQueryString } from '@/lib/api/endpoints'
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
  const response = await api.get<HomeworkResponseDto>(
    `${CLASS_ENDPOINTS.GET_HOMEWORKS(params.classId)}${queryString}`
  )

  return response
}

/**
 * Get homework by ID
 */
export async function getHomeworkById(
  classId: string,
  homeworkId: string
): Promise<HomeworkDetailDto> {
  const response = await api.get<HomeworkDetailDto>(
    CLASS_ENDPOINTS.GET_HOMEWORK(classId, homeworkId)
  )

  return response
}

/**
 * Create homework
 */
export async function createHomework(
  data: CreateHomeworkRequest
): Promise<HomeworkDto> {
  const response = await api.post<HomeworkDto>(
    CLASS_ENDPOINTS.CREATE_HOMEWORK(data.classId),
    {
      quizSetId: data.quizSetId,
      title: data.title,
      dueDate: data.dueDate,
    }
  )

  return response
}

/**
 * Update homework
 */
export async function updateHomework(
  classId: string,
  homeworkId: string,
  data: UpdateHomeworkRequest
): Promise<HomeworkDto> {
  const response = await api.put<HomeworkDto>(
    CLASS_ENDPOINTS.UPDATE_HOMEWORK(classId, homeworkId),
    data
  )

  return response
}

/**
 * Delete homework
 */
export async function deleteHomework(
  classId: string,
  homeworkId: string
): Promise<void> {
  await api.delete<void>(
    CLASS_ENDPOINTS.DELETE_HOMEWORK(classId, homeworkId)
  )
}
