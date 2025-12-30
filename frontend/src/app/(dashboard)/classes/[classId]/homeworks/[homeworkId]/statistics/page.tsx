'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Users, CheckCircle, XCircle, TrendingUp, BarChart3 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { useHomeworkStatistics } from '@/features/class/hooks/use-classes'
import { ROUTES } from '@/config/routes'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

export default function HomeworkStatisticsPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.classId as string
  const homeworkId = params.homeworkId as string

  const { data, isLoading, error } = useHomeworkStatistics(classId, homeworkId)

  const handleBack = () => {
    router.push(ROUTES.classes.detail(classId))
  }

  const handleViewStudentSubmission = (studentId: string) => {
    // Navigate to student submission detail (if needed)
    // For now, we'll just show the statistics
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
                {error ? 'Không thể tải thống kê' : 'Không tìm thấy thống kê'}
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

  const { homework, totalStudents, submittedCount, notSubmittedCount, completionRate, averageScore, highestScore, lowestScore, questionStatistics, studentSubmissions } = data

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
              Thống kê bài tập
            </p>
          </div>
        </div>

        {/* Overall Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Tổng học sinh</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{submittedCount}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Đã nộp bài</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-orange-50">
                <XCircle className="h-6 w-6 text-orange-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{notSubmittedCount}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Chưa nộp bài</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-purple-50">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{completionRate.toFixed(1)}%</p>
                  <p className="text-xs text-[var(--text-secondary)]">Tỷ lệ hoàn thành</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <p className="text-sm text-[var(--text-secondary)]">Điểm trung bình</p>
                <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {averageScore.toFixed(1)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[var(--text-secondary)]">Điểm cao nhất</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{highestScore}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[var(--text-secondary)]">Điểm thấp nhất</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{lowestScore}</p>
              </div>
            </div>

            {/* Completion Rate Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Tỷ lệ hoàn thành
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {submittedCount}/{totalStudents}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-[var(--bg-surface-secondary)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Per-Question Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Thống kê theo câu hỏi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questionStatistics.map((stat, index) => (
                <div key={stat.questionId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        Câu {index + 1}: {stat.questionContent}
                      </h4>
                    </div>
                    <Badge
                      variant={
                        stat.correctPercentage >= 70
                          ? 'default'
                          : stat.correctPercentage >= 50
                            ? 'warning'
                            : 'destructive'
                      }
                    >
                      {stat.correctPercentage.toFixed(1)}% đúng
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-sm text-[var(--text-secondary)]">Trả lời đúng</p>
                      <p className="text-xl font-bold text-green-600 mt-1">
                        {stat.correctAnswerCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[var(--text-secondary)]">Trả lời sai</p>
                      <p className="text-xl font-bold text-red-600 mt-1">
                        {stat.wrongAnswerCount}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[var(--text-secondary)]">Tổng câu trả lời</p>
                      <p className="text-xl font-bold text-[var(--text-primary)] mt-1">
                        {stat.totalAnswers}
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-[var(--bg-surface-secondary)] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300"
                        style={{ width: `${stat.correctPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách học sinh</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học sinh</TableHead>
                  <TableHead className="text-center">Điểm</TableHead>
                  <TableHead className="text-center">Câu đúng</TableHead>
                  <TableHead className="text-center">Thời gian</TableHead>
                  <TableHead className="text-center">Ngày nộp</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-[var(--text-secondary)]">
                      Chưa có học sinh nào nộp bài
                    </TableCell>
                  </TableRow>
                ) : (
                  studentSubmissions.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className="cursor-pointer hover:bg-[var(--bg-surface-secondary)]"
                      onClick={() => handleViewStudentSubmission(submission.studentId)}
                    >
                      <TableCell className="font-medium">
                        {submission.studentName || 'Học sinh'}
                      </TableCell>
                      <TableCell className="text-center font-bold text-blue-600">
                        {submission.score}
                      </TableCell>
                      <TableCell className="text-center">
                        {/* Note: This would need to be calculated from attempt data */}
                        -
                      </TableCell>
                      <TableCell className="text-center text-sm text-[var(--text-secondary)]">
                        {/* Note: This would need to be calculated from attempt data */}
                        -
                      </TableCell>
                      <TableCell className="text-center text-sm text-[var(--text-secondary)]">
                        {new Date(submission.submittedAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={submission.status === 'Late' ? 'destructive' : 'default'}
                        >
                          {submission.status === 'Late' ? 'Muộn' : 'Đúng hạn'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

