'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { TrendingUp, Users, BookOpen, Tags, Activity } from 'lucide-react'

const dashboardStats = [
  {
    title: 'Tổng Quiz',
    value: '1,234',
    change: '+12%',
    icon: BookOpen,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Tổng Người Dùng',
    value: '5,678',
    change: '+8%',
    icon: Users,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Danh Mục',
    value: '24',
    change: '+2',
    icon: Tags,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    title: 'Hoạt Động Hôm Nay',
    value: '342',
    change: '+15%',
    icon: Activity,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
]

const quizTrendData = [
  { month: 'Jan', quizzes: 65, users: 120 },
  { month: 'Feb', quizzes: 78, users: 145 },
  { month: 'Mar', quizzes: 82, users: 165 },
  { month: 'Apr', quizzes: 95, users: 189 },
  { month: 'May', quizzes: 110, users: 210 },
  { month: 'Jun', quizzes: 145, users: 289 },
]

const categoryDistribution = [
  { name: 'Toán', value: 245 },
  { name: 'Tiếng Anh', value: 189 },
  { name: 'Khoa học', value: 167 },
  { name: 'Lịch sử', value: 98 },
  { name: 'Khác', value: 135 },
]

const COLORS = ['#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981']

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Chào mừng bạn trở lại. Đây là tổng quan về hệ thống của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </div>
                <Badge variant="neutral" className="mt-2 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
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
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}`}
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
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt Động Gần Đây</CardTitle>
          <CardDescription>
            Những sự kiện mới nhất trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Quiz mới được tạo', user: 'Nguyễn Văn A', time: '2 giờ trước' },
              { action: 'Người dùng mới đăng ký', user: 'Trần Thị B', time: '4 giờ trước' },
              { action: 'Danh mục được cập nhật', user: 'Admin', time: '6 giờ trước' },
              { action: 'Quiz được yêu thích', user: 'Hoàng Văn C', time: '1 ngày trước' },
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    {activity.action}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Bởi {activity.user}
                  </p>
                </div>
                <span className="text-xs text-[var(--text-secondary)]">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
