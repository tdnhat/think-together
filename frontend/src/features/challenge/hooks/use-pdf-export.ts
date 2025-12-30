/**
 * PDF Export Hook
 * Provides PDF export functionality with loading and error states
 */

import { useState } from 'react'
import { pdfExportService } from '../api/pdf-export.service'
import { toast } from '@/lib/utils/toast'

export function usePdfExport() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadAttemptPdf = async (attemptId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await pdfExportService.downloadAttemptPdf(attemptId)
      toast.success('PDF đã được tải xuống thành công')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lỗi khi tải PDF'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadLeaderboardPdf = async (
    challengeId: string,
    page?: number,
    pageSize?: number
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      await pdfExportService.downloadLeaderboardPdf(
        challengeId,
        page,
        pageSize
      )
      toast.success('PDF bảng xếp hạng đã được tải xuống')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lỗi khi tải PDF'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadStatisticsPdf = async (challengeId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await pdfExportService.downloadStatisticsPdf(challengeId)
      toast.success('PDF thống kê đã được tải xuống')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Lỗi khi tải PDF'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    downloadAttemptPdf,
    downloadLeaderboardPdf,
    downloadStatisticsPdf,
    isLoading,
    error,
  }
}
