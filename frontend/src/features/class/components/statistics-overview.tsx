import { Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/shared/ui/card'

interface StatisticsOverviewProps {
    totalStudents: number
    submittedCount: number
    notSubmittedCount: number
    completionRate: number
    averageScore: number
    highestScore: number
    lowestScore: number
}

export function StatisticsOverview({
    totalStudents,
    submittedCount,
    notSubmittedCount,
    completionRate,
    averageScore,
    highestScore,
    lowestScore,
}: StatisticsOverviewProps) {
    // Ensure non-negative values
    const safeNotSubmittedCount = Math.max(0, notSubmittedCount)
    const safeCompletionRate = Math.max(0, Math.min(100, completionRate))

    const metrics = [
        {
            label: 'Tổng học sinh',
            value: totalStudents,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Đã nộp bài',
            value: submittedCount,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Chưa nộp bài',
            value: safeNotSubmittedCount,
            icon: XCircle,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            label: 'Tỷ lệ hoàn thành',
            value: `${safeCompletionRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon
                    return (
                        <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${metric.bg}`}>
                                    <Icon className={`h-6 w-6 ${metric.color}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{metric.value}</p>
                                    <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">Điểm trung bình</p>
                        <p className="text-3xl font-bold text-[var(--text-primary)] mt-2">
                            {averageScore.toFixed(1)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">Cao nhất</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{highestScore}</p>
                    </CardContent>
                </Card>
                <Card className="border shadow-sm">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">Thấp nhất</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">{lowestScore}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
