'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { useHomeworkSubmission } from '@/features/class/hooks/use-classes'
import { QuestionReviewCard } from '@/features/class/components/question-review-card'
import { ROUTES } from '@/config/routes'

export default function HomeworkSubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.classId as string
  const homeworkId = params.homeworkId as string

  const { data, isLoading, error } = useHomeworkSubmission(classId, homeworkId)

  const handleBack = () => {
    router.push(ROUTES.classes.detail(classId))
  }

  const formatTime = (ms?: number) => {
    if (!ms) return '-'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes} phút ${seconds} giây`
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-secondary)]">
                {error ? 'Không thể tải chi tiết bài nộp' : 'Không tìm thấy bài nộp'}
              </p>
              <Button onClick={handleBack} className="mt-4" variant="neutral">
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const { submission, attempt, homework } = data
  const accuracy = attempt.totalQuestions > 0
    ? (attempt.correctAnswers / attempt.totalQuestions) * 100
    : 0
  const incorrectAnswers = attempt.totalQuestions - attempt.correctAnswers

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="neutral" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              {homework.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Chi tiết bài nộp
            </p>
          </div>
        </div>

        {/* Submission Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Kết quả của bạn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600">{submission.score}</div>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Tổng điểm</p>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{attempt.correctAnswers}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Câu đúng</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-red-50">
                <XCircle className="h-6 w-6 text-red-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Câu sai</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50">
                <Clock className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{accuracy.toFixed(1)}%</p>
                  <p className="text-xs text-[var(--text-secondary)]">Độ chính xác</p>
                </div>
              </div>

              {attempt.completionTimeMs && (
                <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-purple-600">
                      {formatTime(attempt.completionTimeMs)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">Thời gian</p>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Calendar className="h-4 w-4" />
                <span>
                  Nộp lúc:{' '}
                  {new Date(submission.submittedAt).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={submission.status === 'Late' ? 'destructive' : 'default'}>
                  {submission.status === 'Late' ? 'Nộp muộn' : 'Đã nộp'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
            Chi tiết câu trả lời
          </h2>
          {attempt.questions.map((question, index) => (
            <QuestionReviewCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}


