'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { useHomeworkStatistics } from '@/features/class/hooks/use-classes'
import { ROUTES } from '@/config/routes'
import { StatisticsOverview } from '@/features/class/components/statistics-overview'
import { StatisticsQuestionAnalysis } from '@/features/class/components/statistics-question-analysis'
import { StatisticsStudentTable } from '@/features/class/components/statistics-student-table'

export default function HomeworkStatisticsPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.classId as string
  const homeworkId = params.homeworkId as string

  const { data, isLoading, error } = useHomeworkStatistics(classId, homeworkId)

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
        <div className="container mx-auto py-6 px-4">
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-secondary)]">
                {error ? 'Không thể tải thống kê' : 'Không tìm thấy thống kê'}
              </p>
              <Button onClick={handleBack} className="mt-4" variant="outline">
                Quay lại
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const {
    homework,
    totalStudents,
    submittedCount,
    notSubmittedCount,
    completionRate,
    averageScore,
    highestScore,
    lowestScore,
    questionStatistics,
    studentSubmissions
  } = data

  return (
    <DashboardLayout>
      <div className="container max-w-7xl mx-auto py-6 px-4 md:px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
              {homework.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Tổng quan thống kê kết quả làm bài
            </p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <section className="space-y-4">
          <h2 className="font-semibold text-lg text-[var(--text-primary)]">Tổng quan</h2>
          <StatisticsOverview
            totalStudents={totalStudents}
            submittedCount={submittedCount}
            notSubmittedCount={notSubmittedCount}
            completionRate={completionRate}
            averageScore={averageScore}
            highestScore={highestScore}
            lowestScore={lowestScore}
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-lg text-[var(--text-primary)]">Phân tích chi tiết</h2>

          <div className="space-y-4">
            <StatisticsQuestionAnalysis stats={questionStatistics} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-semibold text-lg text-[var(--text-primary)]">Danh sách bài nộp</h2>
          <StatisticsStudentTable submissions={studentSubmissions} />
        </section>

        {/* Removed redundant Full Width Table section since it's now in the grid */}
      </div>
    </DashboardLayout>
  )
}
