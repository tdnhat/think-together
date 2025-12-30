/**
 * Class API Service
 * Handles API calls for class-related data
 * 
 * NOTE: Currently uses placeholder/mock data. Replace with actual API calls
 * when backend API is ready.
 */

import { api } from '@/lib/api/client'
import { CLASS_ENDPOINTS, buildQueryString } from '@/lib/api/endpoints'
import type { ApiResponse } from '@/lib/api/types'
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
  const response = await api.get<ApiResponse<ClassResponseDto>>(
    `${CLASS_ENDPOINTS.GET_CLASSES}${queryString}`
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải danh sách lớp học')
  }

  return response.data
}

/**
 * Get class by ID
 */
export async function getClassById(classId: string): Promise<ClassDetailDto> {
  const response = await api.get<ApiResponse<ClassDetailDto>>(
    CLASS_ENDPOINTS.GET_CLASS(classId)
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải lớp học')
  }

  return response.data
}

/**
 * Create a new class
 */
export async function createClass(
  data: CreateClassRequest
): Promise<ClassDto> {
  const response = await api.post<ApiResponse<ClassDto>>(
    CLASS_ENDPOINTS.CREATE_CLASS,
    data
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tạo lớp học')
  }

  return response.data
}

/**
 * Update class
 */
export async function updateClass(
  classId: string,
  data: UpdateClassRequest
): Promise<ClassDto> {
  const response = await api.put<ApiResponse<ClassDto>>(
    CLASS_ENDPOINTS.UPDATE_CLASS(classId),
    data
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể cập nhật lớp học')
  }

  return response.data
}

/**
 * Delete class
 */
export async function deleteClass(classId: string): Promise<void> {
  const response = await api.delete<ApiResponse<void>>(
    CLASS_ENDPOINTS.DELETE_CLASS(classId)
  )

  if (!response.success) {
    throw new Error(response.message || 'Không thể xóa lớp học')
  }
}

/**
 * Join class by join code
 */
export async function joinClass(data: JoinClassRequest): Promise<ClassDto> {
  const response = await api.post<ApiResponse<ClassDto>>(
    CLASS_ENDPOINTS.JOIN_CLASS,
    data
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tham gia lớp học')
  }

  return response.data
}

/**
 * Leave class
 */
export async function leaveClass(classId: string): Promise<void> {
  const response = await api.post<ApiResponse<void>>(
    CLASS_ENDPOINTS.LEAVE_CLASS(classId)
  )

  if (!response.success) {
    throw new Error(response.message || 'Không thể rời khỏi lớp học')
  }
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

  const response = await api.get<ApiResponse<HomeworkSubmissionDetailDto>>(url)

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải chi tiết bài nộp')
  }

  return response.data
}

/**
 * Get homework statistics (teacher only)
 */
export async function getHomeworkStatistics(
  classId: string,
  homeworkId: string
): Promise<HomeworkStatisticsDto> {
  const response = await api.get<ApiResponse<HomeworkStatisticsDto>>(
    CLASS_ENDPOINTS.GET_HOMEWORK_STATISTICS(classId, homeworkId)
  )

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Không thể tải thống kê bài tập')
  }

  return response.data
}
