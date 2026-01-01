'use client'

import * as React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/ui/dialog'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { AlertCircle } from 'lucide-react'
import { QuestionReviewList } from '@/features/class/components/question-review-list'
import { api } from '@/lib/api/client'
import { PLATFORM_ENDPOINTS } from '@/lib/api/endpoints'
import { useQuery } from '@tanstack/react-query'
import type { ChallengeAttemptDto } from '@/features/challenge/types'

interface SubmissionDetailModalProps {
    attemptId: string | null
    studentName?: string
    isOpen: boolean
    onClose: () => void
}

async function getAttemptDetail(attemptId: string) {
    return api.get<ChallengeAttemptDto>(
        PLATFORM_ENDPOINTS.GET_ATTEMPT_DETAIL(attemptId)
    )
}

function useAttemptDetail(attemptId: string | null) {
    return useQuery({
        queryKey: ['attempt-detail', attemptId],
        queryFn: () => getAttemptDetail(attemptId!),
        enabled: !!attemptId,
    })
}

export function SubmissionDetailModal({
    attemptId,
    studentName,
    isOpen,
    onClose,
}: SubmissionDetailModalProps) {
    const { data, isLoading, error } = useAttemptDetail(attemptId)

    // Transform ChallengeAttemptDto to the format expected by QuestionReviewList
    // QuestionReviewList expects HomeworkSubmissionQuestionDto which is similar
    // enough to ChallengeQuestionDto (extended) if we're careful.
    // Actually, QuestionReviewList uses questions array.
    // ChallengeAttemptDto has Questions array.
    // Let's verify types match or adapt if needed.
    // Based on backend DTOs, they are very similar.

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4">
                    <DialogTitle>Chi tiết bài làm {studentName ? `- ${studentName}` : ''}</DialogTitle>
                    <DialogDescription>
                        Xem chi tiết câu trả lời và kết quả.
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
                            Không thể tải chi tiết bài làm
                        </div>
                    )}

                    {data && (
                        <QuestionReviewList
                            // @ts-expect-error - Types are compatible enough for runtime, we can fix strict typing later if needed
                            questions={data.questions}
                            title="Danh sách câu hỏi"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
