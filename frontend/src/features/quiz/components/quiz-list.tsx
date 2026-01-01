import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Edit2, Trash2, Eye } from 'lucide-react'

// Mock type until we have real QuizDto
interface QuizDto {
    id: string
    title: string
    category: string
    author: string
    questionsCount: number
    status: 'published' | 'draft'
    createdAt: string
}

interface QuizListProps {
    quizzes: QuizDto[]
    isLoading: boolean
    onView: (quiz: QuizDto) => void
}

export function QuizList({ quizzes, isLoading, onView }: QuizListProps) {
    if (isLoading) {
        return (
            <div className="w-full flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên Quiz</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Tác giả</TableHead>
                        <TableHead className="text-center">Số câu hỏi</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {quizzes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Không tìm thấy quiz nào
                            </TableCell>
                        </TableRow>
                    ) : (
                        quizzes.map((quiz) => (
                            <TableRow key={quiz.id}>
                                <TableCell className="font-medium">{quiz.title}</TableCell>
                                <TableCell>{quiz.category}</TableCell>
                                <TableCell>{quiz.author}</TableCell>
                                <TableCell className="text-center">{quiz.questionsCount}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={quiz.status === 'published' ? 'default' : 'secondary'}>
                                        {quiz.status === 'published' ? 'Công khai' : 'Nháp'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(quiz)}
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Xem</span>
                                        </Button>
                                        {/* Add Edit/Delete if admin can manage */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
