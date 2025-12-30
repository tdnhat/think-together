/**
 * useClasses Hook
 * React Query hook for fetching classes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getClasses, getClassById, createClass, updateClass, deleteClass, joinClass, leaveClass, getHomeworkSubmission, getHomeworkStatistics } from '../api/class.service'
import { CLASS_CONSTANTS } from '../constants'
import type { ClassQueryParams, CreateClassRequest, UpdateClassRequest, JoinClassRequest } from '../types'

export function useClasses(params?: ClassQueryParams) {
  return useQuery({
    queryKey: ['classes', params],
    queryFn: () => getClasses(params),
  })
}

export function useClass(classId: string) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassById(classId),
    enabled: !!classId,
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateClassRequest) => createClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ classId, data }: { classId: string; data: UpdateClassRequest }) =>
      updateClass(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      queryClient.invalidateQueries({ queryKey: ['class', variables.classId] })
    },
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (classId: string) => deleteClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export function useJoinClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: JoinClassRequest) => joinClass(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export function useLeaveClass() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (classId: string) => leaveClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export function useHomeworkSubmission(classId: string, homeworkId: string) {
  return useQuery({
    queryKey: ['homework-submission', classId, homeworkId],
    queryFn: () => getHomeworkSubmission(classId, homeworkId),
    enabled: !!classId && !!homeworkId,
  })
}

export function useHomeworkStatistics(classId: string, homeworkId: string) {
  return useQuery({
    queryKey: ['homework-statistics', classId, homeworkId],
    queryFn: () => getHomeworkStatistics(classId, homeworkId),
    enabled: !!classId && !!homeworkId,
  })
}
