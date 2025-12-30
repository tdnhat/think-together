'use client'

import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { DashboardLayout } from '@/widgets/dashboard'
import { useHomeworkSubmission } from '@/features/class/hooks/use-classes'
import { SubmissionSummarySide } from '@/features/class/components/submission-summary-side'
import { QuestionReviewList } from '@/features/class/components/question-review-list'
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
        <div className="container max-w-5xl mx-auto py-6">
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-secondary)] mb-4">
                {error ? 'Không thể tải chi tiết bài nộp' : 'Không tìm thấy bài nộp'}
              </p>
              <Button onClick={handleBack} variant="outline">
                Quay lại lớp học
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const { attempt, homework } = data

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content: Questions - Order 2 on mobile, 1 on desktop */}
          <div className="lg:col-span-8 order-2 lg:order-1 space-y-8">
            <div className="space-y-2">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                {homework.title}
              </h1>
              <p className="text-[var(--text-secondary)]">
                Xem lại chi tiết bài làm của bạn
              </p>
            </div>

            <QuestionReviewList questions={attempt.questions} />
          </div>

          {/* Sidebar: Summary - Order 1 on mobile, 2 on desktop */}
          <div className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-6">
            <SubmissionSummarySide data={data} onBack={handleBack} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
