import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import type { HomeworkSubmissionDto } from '../types'

interface StatisticsStudentTableProps {
    submissions: HomeworkSubmissionDto[]
}

export function StatisticsStudentTable({ submissions }: StatisticsStudentTableProps) {
    const formatTime = (ms?: number) => {
        if (!ms) return '-'
        const minutes = Math.floor(ms / 60000)
        const seconds = Math.floor((ms % 60000) / 1000)
        return `${minutes}p ${seconds}s`
    }

    return (
        <Card className="border shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg">Danh sách học sinh nộp bài</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[200px]">Học sinh</TableHead>
                            <TableHead className="text-center">Điểm số</TableHead>
                            <TableHead className="text-center">Câu đúng</TableHead>
                            <TableHead className="text-center">Thời gian</TableHead>
                            <TableHead className="text-center">Ngày nộp</TableHead>
                            <TableHead className="text-center">Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-[var(--text-secondary)]">
                                    Chưa có học sinh nào nộp bài
                                </TableCell>
                            </TableRow>
                        ) : (
                            submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {/* Placeholder avatar logic could go here */}
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs ring-2 ring-white">
                                                {(submission.studentName?.[0] || 'U').toUpperCase()}
                                            </div>
                                            <span>{submission.studentName || 'Học sinh'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded">
                                            {submission.score}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center text-[var(--text-secondary)]">
                                        {submission.correctAnswers !== undefined
                                            ? `${submission.correctAnswers}/${submission.totalQuestions}`
                                            : '-'}
                                    </TableCell>
                                    <TableCell className="text-center text-sm text-[var(--text-secondary)]">
                                        {formatTime(submission.completionTimeMs)}
                                    </TableCell>
                                    <TableCell className="text-center text-sm text-[var(--text-secondary)]">
                                        {format(new Date(submission.submittedAt), 'dd MMM, HH:mm', { locale: vi })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={submission.status === 'Late' ? 'destructive' : 'default'}
                                            className="font-normal"
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
    )
}
