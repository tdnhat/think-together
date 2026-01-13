import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Card } from '@/shared/ui/card'
import { cn } from '@/lib/utils'

/**
 * Custom Node Component for React Flow Matching Questions
 * Can be used for both Left and Right columns
 */
export function MatchingNode({ data, id }: NodeProps) {
    const {
        content,
        isMatched,
        matchStatus, // { isCorrect: boolean, isIncorrect: boolean }
        isCompleted
    } = data as {
        content: string;
        isMatched: boolean;
        matchStatus?: { isCorrect: boolean; isIncorrect: boolean } | null;
        isCompleted?: boolean;
    }

    // Determine if this is a left or right node based on ID convention 'left-...'
    const isLeftNode = id.startsWith('left-')

    // Determine styles
    let bgColor = 'hover:bg-muted'
    let borderColor = 'border-border'

    if (isCompleted) {
        if (matchStatus?.isCorrect) {
            bgColor = 'bg-green-50'
            borderColor = 'border-green-500'
        } else if (matchStatus?.isIncorrect) {
            bgColor = 'bg-red-50'
            borderColor = 'border-red-500'
        } else {
            bgColor = 'opacity-70' // Unmatched or irrelevant
        }
    } else if (isMatched) {
        bgColor = 'bg-blue-50'
        borderColor = 'border-blue-300'
    }

    return (
        <div className="px-4 py-2">
            <Card
                className={cn(
                    "p-4 transition-colors border",
                    bgColor,
                    borderColor
                )}
            >
                <div className="flex items-center gap-2">
                    {isLeftNode && (
                        <Handle
                            id="source"
                            type="source"
                            position={Position.Right}
                            className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
                        />
                    )}
                    <span className="flex-1 text-sm font-medium text-foreground">{content}</span>
                    {!isLeftNode && (
                        <Handle
                            id="target"
                            type="target"
                            position={Position.Left}
                            className="!bg-blue-500 !w-3 !h-3 !border-2 !border-white"
                        />
                    )}
                </div>
            </Card>
        </div>
    )
}
