/**
 * PDF Export Service
 * Handles PDF export downloads for challenge results, leaderboards, and statistics
 */

import { apiClient } from '@/lib/api/client'
import { env } from '@/config/env'

const CHALLENGE_BASE_URL = '/api/challenges'

export const pdfExportService = {
  /**
   * Download attempt result PDF
   */
  async downloadAttemptPdf(attemptId: string): Promise<void> {
    try {
      const url = `${env.apiUrl}${CHALLENGE_BASE_URL}/attempts/${attemptId}/export/pdf`
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth:accessToken') || '' : ''}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`)
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `ket-qua-${attemptId.slice(0, 8)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading attempt PDF:', error)
      throw error
    }
  },

  /**
   * Download leaderboard PDF
   */
  async downloadLeaderboardPdf(
    challengeId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<void> {
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('pageSize', pageSize.toString())

      const url = `${env.apiUrl}${CHALLENGE_BASE_URL}/${challengeId}/leaderboard/export/pdf?${params.toString()}`

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth:accessToken') || '' : ''}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`)
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `bang-xep-hang-${challengeId.slice(0, 8)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading leaderboard PDF:', error)
      throw error
    }
  },

  /**
   * Download statistics PDF
   */
  async downloadStatisticsPdf(challengeId: string): Promise<void> {
    try {
      const url = `${env.apiUrl}${CHALLENGE_BASE_URL}/${challengeId}/stats/export/pdf`

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth:accessToken') || '' : ''}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`)
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `thong-ke-${challengeId.slice(0, 8)}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading statistics PDF:', error)
      throw error
    }
  },
}
