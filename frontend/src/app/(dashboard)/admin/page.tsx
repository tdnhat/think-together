'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { RecentActivityList } from '@/features/dashboard/components/recent-activity-list'
import { TrendingUp, Users, BookOpen, Tags, Activity } from 'lucide-react'
import { dashboardService } from '@/features/dashboard/services/dashboard-service'
import { useQuery } from '@tanstack/react-query'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardChartsDto, DashboardCountsDto, QuizSetDto } from '@/types/api'

const COLORS = ['#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981']

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

  // Helper to render stats section
  const renderStats = () => {
    if (countsQuery.isLoading) return <LoadingSpinner />
    if (countsQuery.error || !countsQuery.data) return <p className="text-red-500">Lỗi tải dữ liệu</p>

    const stats = countsQuery.data
    const dashboardStats = [
      {
        title: 'Tổng Quiz',
        value: stats.totalQuizzes.toLocaleString(),
        change: `+${stats.newQuizzesToday} hôm nay`,
        icon: BookOpen,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      },
      {
        title: 'Tổng Người Dùng',
        value: stats.totalUsers.toLocaleString(),
        change: `+${stats.newUsersToday} hôm nay`,
        icon: Users,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
      },
      {
        title: 'Tổng Danh Mục',
        value: stats.totalCategories.toLocaleString(),
        change: 'Đang hoạt động',
        icon: Tags,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
      },
      {
        title: 'Quiz Mới Hôm Nay',
        value: stats.newQuizzesToday.toLocaleString(),
        change: 'Tăng trưởng',
        icon: Activity,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
      },
    ]

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  // Helper to render charts
  const renderCharts = () => {
    if (chartsQuery.isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>
    if (chartsQuery.error || !chartsQuery.data) return <p className="text-red-500">Lỗi tải biểu đồ</p>

    const stats = chartsQuery.data
    const quizTrendData = stats.quizTrends.map((q, idx) => ({
      month: q.label,
      quizzes: q.value,
      users: stats.userTrends[idx]?.value || 0
    }))
    const categoryDistribution = stats.categoryDistribution

    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quiz Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Xu Hướng Quiz & Người Dùng</CardTitle>
            <CardDescription>
              Thống kê 6 tháng gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quizTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="quizzes" fill="#3b82f6" name="Quiz" />
                <Bar dataKey="users" fill="#a855f7" name="Người dùng" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân Bố Danh Mục</CardTitle>
            <CardDescription>
              Quiz theo danh mục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Chưa có dữ liệu
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm w-full">
                {categoryDistribution.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="truncate" title={entry.name}>{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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

      {renderStats()}
      {renderCharts()}
      {renderRecent()}
    </div>
  )
}
