'use client'

import { useState, useCallback } from 'react'
import { quizService } from '@/lib/api/services/quiz.service'
import type { QuizSetDto } from '@/types/api'

interface UseImageUploadOptions {
  onSuccess?: (quizSet: QuizSetDto) => void
  onSuccessTemp?: (imageUrl: string) => void
  onError?: (error: string) => void
}

export interface UseImageUploadReturn {
  isUploading: boolean
  uploadProgress: number
  error: string | null
  uploadImage: (quizSetId: string, file: File) => Promise<QuizSetDto | null>
  uploadImageTemp: (file: File) => Promise<string | null>
  clearError: () => void
  reset: () => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function useImageUpload(options?: UseImageUploadOptions): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): string | null => {
    if (!file) {
      return 'File không được trống'
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Kích thước file không được vượt quá ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Chỉ hỗ trợ các định dạng ảnh: JPEG, PNG, WebP, GIF'
    }

    return null
  }, [])

  const uploadImage = useCallback(
    async (quizSetId: string, file: File): Promise<QuizSetDto | null> => {
      setError(null)
      setUploadProgress(0)

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        options?.onError?.(validationError)
        return null
      }

      try {
        setIsUploading(true)
        setUploadProgress(10) // Simulate start

        const result = await quizService.uploadQuizSetCoverImage(quizSetId, file)

        setUploadProgress(100)
        options?.onSuccess?.(result)
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Tải ảnh lên thất bại'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return null
      } finally {
        setIsUploading(false)
        // Reset progress after a delay
        setTimeout(() => setUploadProgress(0), 500)
      }
    },
    [validateFile, options]
  )

  const uploadImageTemp = useCallback(
    async (file: File): Promise<string | null> => {
      setError(null)
      setUploadProgress(0)

      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        options?.onError?.(validationError)
        return null
      }

      try {
        setIsUploading(true)
        setUploadProgress(10) // Simulate start

        const imageUrl = await quizService.uploadQuizSetCoverImageTemp(file)

        setUploadProgress(100)
        options?.onSuccessTemp?.(imageUrl)
        return imageUrl
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Tải ảnh lên thất bại'
        setError(errorMessage)
        options?.onError?.(errorMessage)
        return null
      } finally {
        setIsUploading(false)
        // Reset progress after a delay
        setTimeout(() => setUploadProgress(0), 500)
      }
    },
    [validateFile, options]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const reset = useCallback(() => {
    setIsUploading(false)
    setUploadProgress(0)
    setError(null)
  }, [])

  return {
    isUploading,
    uploadProgress,
    error,
    uploadImage,
    uploadImageTemp,
    clearError,
    reset,
  }
}
