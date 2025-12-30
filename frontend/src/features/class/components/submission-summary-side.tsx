import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ArrowLeft, Calendar, Clock, Trophy } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { Progress } from '@/shared/ui/progress'
import type { HomeworkSubmissionDetailDto } from '../types'

interface SubmissionSummarySideProps {
    data: HomeworkSubmissionDetailDto
    onBack: () => void
}

export function SubmissionSummarySide({ data, onBack }: SubmissionSummarySideProps) {
    const { submission, attempt, homework } = data

    const accuracy = attempt.totalQuestions > 0
        ? (attempt.correctAnswers / attempt.totalQuestions) * 100
        : 0

    const formatTime = (ms?: number) => {
        if (!ms) return '-'
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}p ${seconds}s`
    }

    return (
        <div className="space-y-6">
            <Button
                variant="outline"
                className="w-full justify-start pl-0 hover:bg-transparent hover:text-[var(--primary)]"
                onClick={onBack}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại lớp học
            </Button>

            <Card className="border-2 shadow-sm overflow-hidden">
                <div className="bg-[var(--primary)]/5 p-6 text-center border-b">
                    <h3 className="font-heading text-lg font-semibold text-[var(--text-secondary)] mb-2">
                        Tổng điểm
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        <span className="text-5xl font-bold tracking-tighter text-[var(--primary)]">
                            {submission.score}
                        </span>
                        <span className="text-xl text-[var(--text-secondary)] self-end mb-2">/ 10</span>
                    </div>
                </div>

                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[var(--text-secondary)]">Độ chính xác</span>
                            <span className="font-medium">{accuracy.toFixed(0)}%</span>
                        </div>
                        <Progress value={accuracy} className="h-2" />
                        <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
                            <span>{attempt.correctAnswers} câu đúng</span>
                            <span>{attempt.totalQuestions} câu hỏi</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Clock className="h-4 w-4" />
                                <span>Thời gian làm bài</span>
                            </div>
                            <span className="font-medium text-sm">
                                {formatTime(attempt.completionTimeMs)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Calendar className="h-4 w-4" />
                                <span>Ngày nộp</span>
                            </div>
                            <span className="font-medium text-sm">
                                {format(new Date(submission.submittedAt), 'dd MMM, HH:mm', { locale: vi })}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--text-secondary)]">Trạng thái</span>
                            <Badge variant={submission.status === 'Late' ? 'destructive' : 'default'}>
                                {submission.status === 'Late' ? 'Nộp muộn' : 'Đúng hạn'}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mobile-only info or tips could go here if needed */}
        </div>
    )
}
