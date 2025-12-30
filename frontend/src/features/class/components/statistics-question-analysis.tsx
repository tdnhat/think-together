import { BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Progress } from '@/shared/ui/progress'
import type { QuestionStatisticsDto } from '../types'

interface StatisticsQuestionAnalysisProps {
    stats: QuestionStatisticsDto[]
}

export function StatisticsQuestionAnalysis({ stats }: StatisticsQuestionAnalysisProps) {
    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-[var(--primary)]" />
                    Phân tích câu hỏi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.questionId}
                            className="p-4 rounded-lg border bg-[var(--bg-surface-secondary)]/30 hover:bg-[var(--bg-surface-secondary)]/50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3 gap-2">
                                <div className="font-medium text-sm line-clamp-2" title={stat.questionContent}>
                                    <span className="text-[var(--text-secondary)] mr-1">Câu {index + 1}:</span>
                                    {stat.questionContent}
                                </div>
                                <Badge
                                    variant={
                                        stat.correctPercentage >= 70
                                            ? 'default'
                                            : stat.correctPercentage >= 50
                                                ? 'secondary'
                                                : 'destructive'
                                    }
                                    className="shrink-0"
                                >
                                    {stat.correctPercentage.toFixed(0)}%
                                </Badge>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                                    <span>Độ chính xác</span>
                                    <span>{stat.correctAnswerCount} / {stat.totalAnswers} trả lời đúng</span>
                                </div>
                                <Progress
                                    value={stat.correctPercentage}
                                    className={`h-2 ${stat.correctPercentage >= 70
                                        ? '[&>div]:bg-green-500'
                                        : stat.correctPercentage >= 50
                                            ? '[&>div]:bg-yellow-500'
                                            : '[&>div]:bg-red-500'
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
