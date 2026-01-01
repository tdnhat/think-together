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
import { Download, Eye } from 'lucide-react'

// Mock type
interface ReportDto {
    id: string
    title: string
    type: 'system' | 'user' | 'quiz'
    generatedBy: string
    status: 'ready' | 'processing'
    createdAt: string
}

interface ReportListProps {
    reports: ReportDto[]
    isLoading: boolean
    onView: (report: ReportDto) => void
}

export function ReportList({ reports, isLoading, onView }: ReportListProps) {
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
                        <TableHead>Tên Báo Cáo</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Người tạo</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Ngày tạo</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                Không tìm thấy báo cáo nào
                            </TableCell>
                        </TableRow>
                    ) : (
                        reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.title}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{report.type}</Badge>
                                </TableCell>
                                <TableCell>{report.generatedBy}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={report.status === 'ready' ? 'default' : 'secondary'}>
                                        {report.status === 'ready' ? 'Sẵn sàng' : 'Đang xử lý'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{report.createdAt}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onView(report)}
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="sr-only">Xem</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <Download className="h-4 w-4" />
                                            <span className="sr-only">Tải về</span>
                                        </Button>
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
