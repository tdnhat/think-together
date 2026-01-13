import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/lib/utils'

interface OrderingSortableItemProps {
    id: string | number
    content: string
    isDragging?: boolean
    disabled?: boolean
    // Validation props
    isCompleted?: boolean
    isCorrect?: boolean
}

export function OrderingSortableItem({
    id,
    content,
    isDragging,
    disabled,
    isCompleted,
    isCorrect
}: OrderingSortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isDndDragging,
    } = useSortable({
        id,
        disabled
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDndDragging ? 0.5 : 1,
    }

    // Determine styles based on state
    let borderColor = 'border-border'
    let bgColor = 'bg-card'
    let hoverEffects = 'hover:border-primary/50'
    let textColor = 'text-foreground'

    if (disabled) {
        hoverEffects = ''
        if (isCompleted) {
            if (isCorrect === true) {
                bgColor = 'bg-green-50'
                borderColor = 'border-green-500'
                textColor = 'text-green-700'
            } else if (isCorrect === false) {
                bgColor = 'bg-red-50'
                borderColor = 'border-red-500'
                textColor = 'text-red-700'
            }
        } else {
            // Just disabled during answering (e.g. submitted)
            bgColor = 'opacity-80'
        }
    } else if (isDragging) {
        bgColor = 'bg-primary/5'
        borderColor = 'border-primary'
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Card
                className={cn(
                    "p-4 min-w-[120px] max-w-[200px] transition-all border-2",
                    bgColor,
                    borderColor,
                    !disabled && "cursor-grab active:cursor-grabbing",
                    disabled && "cursor-default",
                    hoverEffects,
                    isDragging && "ring-2 ring-primary/20"
                )}
            >
                <div className="text-center">
                    <p className={cn("text-sm font-medium break-words select-none", textColor)}>
                        {content}
                    </p>
                </div>

                {/* Status Indicator for Completed state */}
                {isCompleted && isCorrect !== undefined && (
                    <div className="mt-2 flex justify-center">
                        {isCorrect ? (
                            <Badge variant="default" className="bg-green-500 text-white hover:bg-green-600">✓</Badge>
                        ) : (
                            <Badge variant="default" className="bg-red-500 text-white hover:bg-red-600">✗</Badge>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}
