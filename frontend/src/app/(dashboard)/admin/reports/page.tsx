'use client'

import { FileText, Eye } from 'lucide-react'
import { useState } from 'react'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer, ContentCard, FilterBar, EmptyState, DataTable } from '@/shared/components/page'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

// Mock type until we have real ReportDto
interface ReportDto {
  id: string
  title: string
  type: string
  createdBy: string
  createdAt: string
  status: 'pending' | 'reviewed' | 'resolved'
}

export default function ReportsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const reports: ReportDto[] = []
  const isLoading = false

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          icon={FileText}
          title="Báo Cáo Hệ Thống"
          description="Xem và phân tích các báo cáo về hoạt động hệ thống."
        />

        <ContentCard
          title="Danh Sách Báo Cáo"
          description="Xem và quản lý tất cả báo cáo trong hệ thống"
        >
          <FilterBar
            searchPlaceholder="Tìm kiếm báo cáo..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <DataTable<ReportDto>
            data={reports}
            columns={[
              {
                key: 'title',
                header: 'Tiêu đề',
                cell: (report) => <span className="font-medium">{report.title}</span>,
              },
              {
                key: 'type',
                header: 'Loại',
                cell: (report) => report.type,
              },
              {
                key: 'createdBy',
                header: 'Người tạo',
                cell: (report) => report.createdBy,
              },
              {
                key: 'createdAt',
                header: 'Ngày tạo',
                cell: (report) => report.createdAt,
                headerClassName: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'status',
                header: 'Trạng thái',
                cell: (report) => {
                  const statusMap = {
                    pending: { label: 'Chờ xem xét', variant: 'secondary' as const },
                    reviewed: { label: 'Đã xem', variant: 'default' as const },
                    resolved: { label: 'Đã xử lý', variant: 'outline' as const },
                  }
                  const status = statusMap[report.status]
                  return <Badge variant={status.variant}>{status.label}</Badge>
                },
                headerClassName: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'actions',
                header: 'Hành động',
                cell: (report) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('View report', report)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </div>
                ),
                headerClassName: 'text-right',
                cellClassName: 'text-right',
              },
            ]}
            getRowKey={(report) => report.id}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                icon={FileText}
                title="Chưa có báo cáo nào"
                description="Hệ thống chưa có báo cáo nào. Báo cáo sẽ được tạo tự động từ hoạt động của người dùng."
              />
            }
          />
        </ContentCard>
      </PageContainer>
    </DashboardLayout>
  )
}
