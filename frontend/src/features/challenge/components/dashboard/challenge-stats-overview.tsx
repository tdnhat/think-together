'use client'

import { Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart'
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'
import type { ChallengeStatsDto } from '../../types'

interface ChallengeStatsOverviewProps {
  stats: ChallengeStatsDto
  className?: string
}

const chartConfig = {
  attempts: {
    label: 'Lượt hoàn thành',
    color: 'var(--chart-1)',
  },
  participants: {
    label: 'Người tham gia',
    color: 'var(--chart-2)',
  },
  averageScore: {
    label: 'Điểm TB',
    color: 'var(--chart-3)',
  },
  averageAccuracy: {
    label: 'Độ chính xác TB',
    color: 'var(--chart-4)',
  },
  completed: {
    label: 'Đã hoàn thành',
    color: 'var(--chart-1)',
  },
  incomplete: {
    label: 'Chưa hoàn thành',
    color: '#94a3b8',
  },
}

export function ChallengeStatsOverview({
  stats,
  className = '',
}: ChallengeStatsOverviewProps) {
  const completionRate = Math.round(stats.completionRate)

  // Prepare data for Bar Chart
  const barChartData = [
    {
      metric: 'Lượt hoàn thành',
      value: stats.completedAttempts,
      type: 'attempts',
    },
    {
      metric: 'Người tham gia',
      value: stats.totalParticipants,
      type: 'participants',
    },
    {
      metric: 'Điểm trung bình',
      value: Math.round(stats.averageScore),
      type: 'averageScore',
    },
    {
      metric: 'Độ chính xác TB',
      value: Math.round(stats.averageAccuracy),
      type: 'averageAccuracy',
    },
  ]

  // Prepare data for Donut Chart (Completion Rate)
  const donutChartData = [
    {
      name: 'Đã hoàn thành',
      value: completionRate,
      fill: chartConfig.completed.color,
    },
    {
      name: 'Chưa hoàn thành',
      value: 100 - completionRate,
      fill: chartConfig.incomplete.color,
    },
  ]

  return (
    <div className={`grid grid-cols-1 gap-6 lg:grid-cols-4 ${className}`}>
      {/* Bar Chart - Tổng quan thống kê */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Tổng quan thống kê</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={barChartData}>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <XAxis
                dataKey="metric"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {barChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartConfig[entry.type as keyof typeof chartConfig].color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            {Object.entries(chartConfig)
              .filter(([key]) =>
                ['attempts', 'participants', 'averageScore', 'averageAccuracy'].includes(
                  key
                )
              )
              .map(([key, config]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span className="text-muted-foreground">
                    {config.label}
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Column 2: Recent Activity Card + Donut Chart */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Card - Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng lượt làm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalAttempts.toLocaleString('vi-VN')}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tổng số lượt làm
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart - Tỷ lệ hoàn thành */}
        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={donutChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={5}
                  stroke="hsl(var(--border))"
                >
                  {donutChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="text-3xl font-bold">
                {completionRate}%
              </div>
              <p className="text-sm text-muted-foreground">
                Tỷ lệ hoàn thành
              </p>
              <div className="mt-2 flex gap-4 text-xs">
                {donutChartData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
