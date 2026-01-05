'use client'

/**
 * Timer Display Component
 * Reusable timer display that can be used across challenge, game, and homework features
 */

import { Clock } from 'lucide-react'
import { formatTime, getTimeStatus, getTimeColorClass } from '../utils/time'
import type { TimerFormat } from '../constants'

interface TimerDisplayProps {
    /** Remaining time in milliseconds */
    remainingTimeMs: number
    /** Callback when time runs out */
    onTimeUp?: () => void
    /** Display format */
    format?: TimerFormat
    /** Show clock icon */
    showIcon?: boolean
    /** Additional CSS classes */
    className?: string
}

export function TimerDisplay({
    remainingTimeMs,
    onTimeUp,
    format = 'compact',
    showIcon = true,
    className = '',
}: TimerDisplayProps) {
    const timeString = formatTime(remainingTimeMs)
    const status = getTimeStatus(remainingTimeMs)
    const colorClass = getTimeColorClass(status)

    // Trigger callback when time is up
    if (remainingTimeMs <= 0 && onTimeUp) {
        onTimeUp()
    }

    if (format === 'full') {
        return (
            <div
                className={`flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2 ${className}`}
            >
                {showIcon && <Clock className="size-5" />}
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Thời gian còn lại</span>
                    <span className={`font-mono text-xl font-semibold ${colorClass}`}>
                        {timeString}
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-center gap-2 font-mono ${colorClass} ${className}`}>
            {showIcon && <Clock className="size-5" />}
            <span className="text-lg font-semibold">{timeString}</span>
        </div>
    )
}
