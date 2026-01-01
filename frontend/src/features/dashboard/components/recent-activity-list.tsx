import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { QuizSetDto } from '@/types/api'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface RecentActivityListProps {
    quizzes: QuizSetDto[]
}

export function RecentActivityList({ quizzes }: RecentActivityListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz Mới Tạo</CardTitle>
                <CardDescription>
                    Những bộ câu hỏi mới nhất được tạo trong hệ thống
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Người tạo</TableHead>
                            <TableHead className="text-right">Thời gian</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quizzes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                    Không có hoạt động gần đây
                                </TableCell>
                            </TableRow>
                        ) : (
                            quizzes.map((quiz) => (
                                <TableRow key={quiz.id}>
                                    <TableCell className="font-medium">{quiz.title}</TableCell>
                                    <TableCell>{quiz.creatorName || 'Ẩn danh'}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true, locale: vi })}
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
