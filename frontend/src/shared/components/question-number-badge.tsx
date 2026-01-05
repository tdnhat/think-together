'use client'

/**
 * Question Number Badge Component
 * Displays question number with optional total count
 */

interface QuestionNumberBadgeProps {
    /** Current question number (1-indexed) */
    number: number
    /** Total number of questions */
    total?: number
    /** Display variant */
    variant?: 'default' | 'compact'
    /** Additional CSS classes */
    className?: string
}

export function QuestionNumberBadge({
    number,
    total,
    variant = 'default',
    className = '',
}: QuestionNumberBadgeProps) {
    if (variant === 'compact') {
        return (
            <div
                className={`flex size-8 items-center justify-center rounded-full border border-border bg-muted text-sm font-semibold text-foreground ${className}`}
            >
                {number}
            </div>
        )
    }

    return (
        <div
            className={`flex items-center justify-center rounded-lg border border-border bg-muted px-3 py-1.5 ${className}`}
        >
            <span className="text-sm font-semibold text-foreground">
                Câu {number}
                {total && <span className="text-muted-foreground">/{total}</span>}
            </span>
        </div>
    )
}
