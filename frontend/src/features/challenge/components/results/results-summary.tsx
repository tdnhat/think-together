'use client'

import { CheckCircle, XCircle, Clock, Target, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { useCountUp } from '@/shared/hooks/use-count-up'
import type { ChallengeResultsSummary } from '@/features/challenge/types'
import { usePdfExport } from '../../hooks/use-pdf-export'

interface ResultsSummaryProps {
  results: ChallengeResultsSummary
  attemptId?: string
  className?: string
}

export function ResultsSummary({ results, attemptId, className = '' }: ResultsSummaryProps) {
  const { downloadAttemptPdf, isLoading } = usePdfExport()
  const accuracy = (results.correctAnswers / results.totalQuestions) * 100
  const incorrectAnswers = results.totalQuestions - results.correctAnswers

  const scoreCount = useCountUp({ end: results.score, duration: 1500 })
  const correctCount = useCountUp({ end: results.correctAnswers, duration: 1500 })
  const incorrectCount = useCountUp({ end: incorrectAnswers, duration: 1500 })
  const accuracyCount = useCountUp({ end: accuracy, duration: 1500, decimals: 1 })

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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-center flex-1">Kết quả của bạn</CardTitle>
          {attemptId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isLoading}
            >
              <Download />
              {isLoading ? 'Đang tải...' : 'Tải PDF'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="text-center">
          <h3 className="font-heading text-xl font-semibold">{results.challengeTitle}</h3>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="text-center space-y-2">
            <div className="text-6xl md:text-7xl font-heading font-bold text-primary">
              {scoreCount.toLocaleString('vi-VN')}
            </div>
            <p className="text-sm text-muted-foreground">Tổng điểm</p>
          </div>

          {results.rank && (
            <Badge variant="default" className="text-base px-4 py-1.5">
              Xếp hạng #{results.rank}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600 mb-3" />
              <div className="text-3xl font-heading font-bold text-green-600">
                {correctCount.toLocaleString('vi-VN')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Câu đúng</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <XCircle className="mx-auto h-8 w-8 text-red-600 mb-3" />
              <div className="text-3xl font-heading font-bold text-red-600">
                {incorrectCount.toLocaleString('vi-VN')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Câu sai</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="mx-auto h-8 w-8 text-blue-600 mb-3" />
              <div className="text-3xl font-heading font-bold text-blue-600">
                {accuracyCount.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          {results.completionTimeMs && (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto h-8 w-8 text-purple-600 mb-3" />
                <div className="text-lg font-heading font-bold text-purple-600">
                  {formatTime(results.completionTimeMs)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Thời gian</p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

