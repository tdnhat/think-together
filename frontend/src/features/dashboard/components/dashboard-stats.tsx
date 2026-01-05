import { TrendingUp, Users, BookOpen, Tags, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardCountsDto } from '@/types/api'

interface DashboardStatsProps {
    isLoading: boolean
    error: unknown
    data?: DashboardCountsDto | null
}

export function DashboardStats({ isLoading, error, data }: Readonly<DashboardStatsProps>) {
    if (isLoading) return <LoadingSpinner />
    if (error || !data) return <p className="text-red-500">Lỗi tải dữ liệu</p>

    const dashboardStats = [
        {
            title: 'Tổng Quiz',
            value: data.totalQuizzes.toLocaleString(),
            change: `+${data.newQuizzesToday} hôm nay`,
            icon: BookOpen,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'Tổng Người Dùng',
            value: data.totalUsers.toLocaleString(),
            change: `+${data.newUsersToday} hôm nay`,
            icon: Users,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            title: 'Tổng Danh Mục',
            value: data.totalCategories.toLocaleString(),
            change: 'Đang hoạt động',
            icon: Tags,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
        },
        {
            title: 'Quiz Mới Hôm Nay',
            value: data.newQuizzesToday.toLocaleString(),
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
