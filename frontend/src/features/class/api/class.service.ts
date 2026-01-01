/**
 * Class API Service
 * Handles API calls for class-related data
 * 
 * NOTE: Currently uses placeholder/mock data. Replace with actual API calls
 * when backend API is ready.
 */

import { api } from '@/lib/api/client'
import { CLASS_ENDPOINTS, PLATFORM_ENDPOINTS, buildQueryString } from '@/lib/api/endpoints'
import type {
  ClassDto,
  ClassDetailDto,
  ClassQueryParams,
  CreateClassRequest,
  UpdateClassRequest,
  JoinClassRequest,
  ClassResponseDto,
  HomeworkSubmissionDetailDto,
  HomeworkStatisticsDto,
} from '../types'

/**
 * Get all classes for current user
 */
export async function getClasses(
  params?: ClassQueryParams
): Promise<ClassResponseDto> {
  const queryParams: Record<string, unknown> = {
    page: params?.page || 1,
    pageSize: params?.pageSize || 20,
  }

  if (params?.search) {
    queryParams.search = params.search
  }

  const queryString = buildQueryString(queryParams)
  const response = await api.get<ClassResponseDto>(
    `${CLASS_ENDPOINTS.GET_CLASSES}${queryString}`
  )

  return response
}

/**
 * Get class by ID
 */
export async function getClassById(classId: string): Promise<ClassDetailDto> {
  const response = await api.get<ClassDetailDto>(
    CLASS_ENDPOINTS.GET_CLASS(classId)
  )

  return response
}

/**
 * Create a new class
 */
export async function createClass(
  data: CreateClassRequest
): Promise<ClassDto> {
  const response = await api.post<ClassDto>(
    CLASS_ENDPOINTS.CREATE_CLASS,
    data
  )

  return response
}

/**
 * Update class
 */
export async function updateClass(
  classId: string,
  data: UpdateClassRequest
): Promise<ClassDto> {
  const response = await api.put<ClassDto>(
    CLASS_ENDPOINTS.UPDATE_CLASS(classId),
    data
  )

  return response
}

/**
 * Delete class
 */
export async function deleteClass(classId: string): Promise<void> {
  await api.delete<void>(
    CLASS_ENDPOINTS.DELETE_CLASS(classId)
  )
}

/**
 * Upload class cover image
 */
export async function uploadCoverImage(classId: string, file: File): Promise<ClassDto> {
  const formData = new FormData()
  formData.append('coverImage', file)

  const response = await api.post<ClassDto>(
    CLASS_ENDPOINTS.UPLOAD_COVER_IMAGE(classId),
    formData
  )

  return response
}

/**
 * Upload class cover image temporarily
 * Reuse quiz set temp endpoint but with 'classes/covers' folder
 */
export async function uploadCoverImageTemp(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<{ url: string }>(
    `${PLATFORM_ENDPOINTS.UPLOAD_IMAGE}?folder=classes/covers`,
    formData
  )

  return response.url
}

/**
 * Join class by join code
 */
export async function joinClass(data: JoinClassRequest): Promise<ClassDto> {
  const response = await api.post<ClassDto>(
    CLASS_ENDPOINTS.JOIN_CLASS,
    data
  )

  return response
}

/**
 * Leave class
 */
export async function leaveClass(classId: string): Promise<void> {
  await api.post<void>(
    CLASS_ENDPOINTS.LEAVE_CLASS(classId)
  )
}

/**
 * Get student's homework submission details
 * @param classId - The class ID
 * @param homeworkId - The homework ID
 * @param studentId - Optional student ID (for teachers to view specific student's submission)
 */
export async function getHomeworkSubmission(
  classId: string,
  homeworkId: string,
  studentId?: string
): Promise<HomeworkSubmissionDetailDto> {
  let url = CLASS_ENDPOINTS.GET_HOMEWORK_SUBMISSION(classId, homeworkId)

  if (studentId) {
    url += `?studentId=${studentId}`
  }

  const response = await api.get<HomeworkSubmissionDetailDto>(url)

  return response
}

/**
 * Get homework statistics (teacher only)
 */
export async function getHomeworkStatistics(
  classId: string,
  homeworkId: string
): Promise<HomeworkStatisticsDto> {
  const response = await api.get<HomeworkStatisticsDto>(
    CLASS_ENDPOINTS.GET_HOMEWORK_STATISTICS(classId, homeworkId)
  )

  return response
}
