'use client'

import { CheckCircle, XCircle, Clock, Target, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import type { ChallengeResultsSummary } from '@/features/challenge/types'
import { usePdfExport } from '../hooks/use-pdf-export'

interface ResultsSummaryProps {
  results: ChallengeResultsSummary
  attemptId?: string
  className?: string
}

export function ResultsSummary({ results, attemptId, className = '' }: ResultsSummaryProps) {
  const { downloadAttemptPdf, isLoading } = usePdfExport()
  const accuracy = (results.correctAnswers / results.totalQuestions) * 100
  const incorrectAnswers = results.totalQuestions - results.correctAnswers

  const handleDownloadPdf = async () => {
    if (attemptId) {
      await downloadAttemptPdf(attemptId)
    }
  }

  const formatTime = (ms?: number) => {
    if (!ms) return '-'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes} phút ${seconds} giây`
  }

  // Determine performance badge color
  let performanceColor = 'bg-gray-100 text-gray-700'
  if (accuracy >= 90) {
    performanceColor = 'bg-green-100 text-green-700'
  } else if (accuracy >= 70) {
    performanceColor = 'bg-blue-100 text-blue-700'
  } else if (accuracy >= 50) {
    performanceColor = 'bg-yellow-100 text-yellow-700'
  } else {
    performanceColor = 'bg-red-100 text-red-700'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-center flex-1">Kết quả của bạn</CardTitle>
          {attemptId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isLoading}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isLoading ? 'Đang tải...' : 'Tải PDF'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] text-lg">{results.challengeTitle}</h3>
        </div>

        {/* Score Display */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600">{results.score}</div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Tổng điểm</p>
          </div>

          {results.rank && (
            <Badge variant="default" className={performanceColor}>
              Xếp hạng #{results.rank}
            </Badge>
          )}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Correct Answers */}
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{results.correctAnswers}</p>
              <p className="text-xs text-[var(--text-secondary)]">Câu đúng</p>
            </div>
          </div>

          {/* Incorrect Answers */}
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-red-50">
            <XCircle className="h-6 w-6 text-red-600" />
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
              <p className="text-xs text-[var(--text-secondary)]">Câu sai</p>
            </div>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50">
            <Target className="h-6 w-6 text-blue-600" />
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{accuracy.toFixed(1)}%</p>
              <p className="text-xs text-[var(--text-secondary)]">Độ chính xác</p>
            </div>
          </div>

          {/* Time */}
          {results.completionTimeMs && (
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50">
              <Clock className="h-6 w-6 text-purple-600" />
              <div className="text-center">
                <p className="text-sm font-bold text-purple-600">
                  {formatTime(results.completionTimeMs)}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Thời gian</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar for accuracy */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--text-secondary)]">Tiến độ</span>
            <span className="text-sm font-bold text-[var(--text-primary)]">{results.correctAnswers}/{results.totalQuestions}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-[var(--bg-surface-secondary)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

