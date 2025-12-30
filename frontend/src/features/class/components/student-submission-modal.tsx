'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Badge } from '@/shared/ui/badge'
import { Progress } from '@/shared/ui/progress'
import { Separator } from '@/shared/ui/separator'
import { Trophy, Clock, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useHomeworkSubmission } from '../hooks/use-classes'
import { QuestionReviewList } from './question-review-list'

interface StudentSubmissionModalProps {
    isOpen: boolean
    onClose: () => void
    classId: string
    homeworkId: string
    studentId: string
    studentName: string
}

export function StudentSubmissionModal({
    isOpen,
    onClose,
    classId,
    homeworkId,
    studentId,
    studentName,
}: StudentSubmissionModalProps) {
    const { data, isLoading, error } = useHomeworkSubmission(classId, homeworkId, studentId)

    const formatTime = (ms?: number) => {
        if (!ms) return '-'
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}p ${seconds}s`
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {studentName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <span className="text-xl">{studentName}</span>
                            <p className="text-sm font-normal text-[var(--text-secondary)]">
                                Chi tiết bài nộp
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <LoadingSpinner />
                    </div>
                )}

                {error && (
                    <div className="flex items-center justify-center py-12 text-red-500">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Không thể tải bài nộp của học sinh
                    </div>
                )}

                {data && (
                    <div className="space-y-6">
                        {/* Summary Section */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Score */}
                            <div className="bg-[var(--primary)]/5 p-4 rounded-lg border text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    <span className="text-3xl font-bold text-[var(--primary)]">
                                        {data.submission.score}
                                    </span>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)]">Điểm số</p>
                            </div>

                            {/* Accuracy */}
                            <div className="bg-green-50 p-4 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--text-secondary)]">Độ chính xác</span>
                                    <span className="font-semibold">
                                        {data.attempt.totalQuestions > 0
                                            ? ((data.attempt.correctAnswers / data.attempt.totalQuestions) * 100).toFixed(0)
                                            : 0}%
                                    </span>
                                </div>
                                <Progress
                                    value={data.attempt.totalQuestions > 0
                                        ? (data.attempt.correctAnswers / data.attempt.totalQuestions) * 100
                                        : 0}
                                    className="h-2"
                                />
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    {data.attempt.correctAnswers}/{data.attempt.totalQuestions} câu đúng
                                </p>
                            </div>

                            {/* Time */}
                            <div className="bg-blue-50 p-4 rounded-lg border text-center">
                                <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                                <p className="font-semibold">{formatTime(data.attempt.completionTimeMs)}</p>
                                <p className="text-sm text-[var(--text-secondary)]">Thời gian</p>
                            </div>

                            {/* Submit Date */}
                            <div className="bg-purple-50 p-4 rounded-lg border text-center">
                                <Calendar className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                                <p className="font-semibold text-sm">
                                    {format(new Date(data.submission.submittedAt), 'dd MMM, HH:mm', { locale: vi })}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    {data.submission.status === 'Late' ? (
                                        <Badge variant="secondary" className="mt-1">Nộp muộn</Badge>
                                    ) : (
                                        <Badge variant="default" className="mt-1">Đúng hạn</Badge>
                                    )}
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Questions */}
                        <QuestionReviewList
                            questions={data.attempt.questions}
                            title="Chi tiết bài làm"
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
