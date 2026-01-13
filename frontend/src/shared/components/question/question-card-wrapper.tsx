import { Card, CardHeader, CardContent, CardTitle, CardAction } from '@/shared/ui/card'
import { QuestionNumberBadge } from '@/shared/components/question-number-badge'
import { Timer } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuestionCardWrapperProps {
    questionNumber: number
    totalQuestions?: number
    content: string
    timerValue?: number
    timerColorClass?: string
    action?: React.ReactNode
    children: React.ReactNode
    className?: string
    badgeVariant?: 'default' | 'compact'
}

export function QuestionCardWrapper({
    questionNumber,
    totalQuestions,
    content,
    timerValue,
    timerColorClass,
    action,
    children,
    className,
    badgeVariant = 'default'
}: QuestionCardWrapperProps) {
    return (
        <Card className={cn("overflow-hidden", className)}>
            <CardHeader className="pb-4 bg-muted/20">
                <div className="flex items-start gap-4 justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <QuestionNumberBadge
                            number={questionNumber}
                            total={totalQuestions}
                            variant={badgeVariant}
                        />
                        <div className="min-w-0 flex-1 pt-1">
                            <CardTitle className="text-xl leading-snug font-heading">
                                {content}
                            </CardTitle>
                        </div>

                        {action && (
                            <CardAction>
                                {action}
                            </CardAction>
                        )}
                    </div>

                    {timerValue !== undefined && (
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm shrink-0 border",
                            timerColorClass
                        )}>
                            <Timer className="h-4 w-4" />
                            <span className="tabular-nums">{timerValue}s</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                {children}
            </CardContent>
        </Card>
    )
}
