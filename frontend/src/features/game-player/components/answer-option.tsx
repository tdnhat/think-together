import { CheckCircle, Circle } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'
import { GAME_PLAYER_CONSTANTS } from '../constants'

interface AnswerOptionProps {
    index: number
    content: string
    isSelected: boolean
    hasAnswered: boolean
    onSelect: () => void
}

export function AnswerOption({
    index,
    content,
    isSelected,
    hasAnswered,
    onSelect,
}: AnswerOptionProps) {
    const colorScheme = GAME_PLAYER_CONSTANTS.ANSWER_COLORS[index] || GAME_PLAYER_CONSTANTS.ANSWER_COLORS[0]

    return (
        <Button
            type="button"
            variant="neutral" // Use neutral as base, but we will override heavily
            onClick={onSelect}
            disabled={hasAnswered}
            className={cn(
                "h-auto w-full justify-start p-5 gap-4 rounded-xl border-2 transition-all whitespace-normal",
                // Override default button styles to match the game design
                isSelected
                    ? cn(
                        colorScheme.bg,
                        "border-black ring-2 ring-black ring-offset-2", // Use black border for selected
                        colorScheme.text
                    )
                    : cn(
                        "bg-white hover:bg-white", // Reset background
                        "border-border", // Standard border
                        colorScheme.hover,
                        "hover:border-black"
                    ),
                hasAnswered && "opacity-60 cursor-not-allowed hover:translate-x-0 hover:translate-y-0 hover:shadow-shadow"
            )}
        >
            {/* Letter indicator */}
            <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg flex-shrink-0 border-2 border-border",
                isSelected ? "bg-white/30" : cn(colorScheme.bg, colorScheme.text)
            )}>
                {String.fromCharCode(65 + index)}
            </div>

            {/* Content */}
            <span className={cn(
                "flex-1 text-left font-medium text-base",
                isSelected ? colorScheme.text : "text-black"
            )}>
                {content}
            </span>

            {/* Selection indicator */}
            <div className="flex-shrink-0">
                {isSelected ? (
                    <CheckCircle className={cn("h-6 w-6", colorScheme.text)} />
                ) : (
                    <Circle className="h-6 w-6 text-gray-400" />
                )}
            </div>
        </Button>
    )
}
