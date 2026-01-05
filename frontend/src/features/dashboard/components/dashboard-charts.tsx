import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardChartsDto } from '@/types/api'

const COLORS = ['#3b82f6', '#a855f7', '#ec4899', '#f59e0b', '#10b981']

interface DashboardChartsProps {
    isLoading: boolean
    error: unknown
    data?: DashboardChartsDto | null
}

export function DashboardCharts({ isLoading, error, data }: Readonly<DashboardChartsProps>) {
    if (isLoading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>
    if (error || !data) return <p className="text-red-500">Lỗi tải biểu đồ</p>

    const quizTrendData = data.quizTrends.map((q, idx) => ({
        month: q.label,
        quizzes: q.value,
        users: data.userTrends[idx]?.value || 0
    }))
    const categoryDistribution = data.categoryDistribution

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
