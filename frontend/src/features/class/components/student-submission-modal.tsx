'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
                    <DialogTitle>Chi tiết bài nộp - {studentName}</DialogTitle>
                    <DialogDescription>
                        Xem chi tiết bài làm và kết quả của học sinh.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 scrollbar-thin">
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
                        <QuestionReviewList
                            questions={data.attempt.questions}
                            title="Chi tiết bài làm"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
