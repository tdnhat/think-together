/**
 * useHomeworks Hook
 * React Query hook for fetching homeworks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getHomeworks,
  createHomework,
  updateHomework,
  deleteHomework,
} from '../api/homework.service'
import type {
  HomeworkQueryParams,
  CreateHomeworkRequest,
  UpdateHomeworkRequest,
} from '../types'

export function useHomeworks(params: HomeworkQueryParams) {
  return useQuery({
    queryKey: ['homeworks', params],
    queryFn: () => getHomeworks(params),
    enabled: !!params.classId,
  })
}

export function useHomework(classId: string, homeworkId: string) {
  return useQuery({
    queryKey: ['homework', classId, homeworkId],
    queryFn: () => {
      // This will be implemented when we add getHomeworkById to the service
      throw new Error('Not implemented')
    },
    enabled: !!classId && !!homeworkId,
  })
}

export function useCreateHomework() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateHomeworkRequest) => createHomework(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['homeworks', { classId: variables.classId }] })
      queryClient.invalidateQueries({ queryKey: ['class', variables.classId] })
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}

export function useUpdateHomework() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      classId,
      homeworkId,
      data,
    }: {
      classId: string
      homeworkId: string
      data: UpdateHomeworkRequest
    }) => updateHomework(classId, homeworkId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['homeworks', { classId: variables.classId }],
      })
      queryClient.invalidateQueries({
        queryKey: ['homework', variables.classId, variables.homeworkId],
      })
      queryClient.invalidateQueries({ queryKey: ['class', variables.classId] })
    },
  })
}

export function useDeleteHomework() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ classId, homeworkId }: { classId: string; homeworkId: string }) =>
      deleteHomework(classId, homeworkId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['homeworks', { classId: variables.classId }],
      })
      queryClient.invalidateQueries({ queryKey: ['class', variables.classId] })
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
  })
}
