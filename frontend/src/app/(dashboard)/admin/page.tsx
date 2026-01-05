'use client'

import { dashboardService } from '@/features/dashboard/services/dashboard-service'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardStats } from '@/features/dashboard/components/dashboard-stats'
import { DashboardCharts } from '@/features/dashboard/components/dashboard-charts'
import { RecentActivityList } from '@/features/dashboard/components/recent-activity-list'

export default function AdminDashboard() {
  const countsQuery = useQuery({
    queryKey: ['dashboard-counts'],
    queryFn: dashboardService.getCounts
  })

  const chartsQuery = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: dashboardService.getCharts
  })

  const recentActivityQuery = useQuery({
    queryKey: ['dashboard-recent'],
    queryFn: dashboardService.getRecentActivity
  })

  // Helper to render recent activity
  const renderRecent = () => {
    if (recentActivityQuery.isLoading) return <LoadingSpinner />
    if (recentActivityQuery.error || !recentActivityQuery.data) return <p className="text-red-500">Lỗi tải hoạt động</p>

    return <RecentActivityList quizzes={recentActivityQuery.data} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="text-muted-foreground mt-2">
          Chào mừng bạn trở lại. Đây là tổng quan về hệ thống của bạn.
        </p>
      </div>

      <DashboardStats
        isLoading={countsQuery.isLoading}
        error={countsQuery.error}
        data={countsQuery.data}
      />

      <DashboardCharts
        isLoading={chartsQuery.isLoading}
        error={chartsQuery.error}
        data={chartsQuery.data}
      />

      {renderRecent()}
    </div>
  )
}
