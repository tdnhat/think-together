'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { ReportList } from '@/features/report/components/report-list'
import { ReportFilters } from '@/features/report/components/report-filters'

export default function ReportsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reports = [] as any[]
  const isLoading = false

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Báo Cáo Hệ Thống
        </h1>
        <p className="text-muted-foreground mt-2">
          Xem và phân tích các báo cáo về hoạt động hệ thống.
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Báo Cáo</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả báo cáo trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReportFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <ReportList
            reports={reports}
            isLoading={isLoading}
            onView={(report) => console.log('View report', report)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
