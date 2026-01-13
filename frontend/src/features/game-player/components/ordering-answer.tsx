'use client'

import { useState, useEffect } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/shared/ui/card'
import { OrderingItemInfo } from '@/features/game-host/types'

interface OrderingAnswerProps {
    items: OrderingItemInfo[]
    hasAnswered: boolean
    onAnswersChange: (answers: number[]) => void
}

/**
 * Render options for Ordering questions: vertical list drag and drop items (optimized for mobile)
 * NOTE: Challenge uses Horizontal, but Mobile might prefer Vertical?
 * The user said "Take challenge as reference". Challenge uses horizontal.
 * However, long text items in horizontal list form "cards".
 * Let's stick to Horizontal `horizontalListSortingStrategy` with `flex-wrap` like Challenge.
 */
export function OrderingAnswer({
    items,
    hasAnswered,
    onAnswersChange,
}: OrderingAnswerProps) {

    // Store items with a generic unique DND ID, but keep track of original ID.
    // items: { id: number, content: string }

    const [orderedItems, setOrderedItems] = useState<OrderingItemInfo[]>([])

    // Shuffle on mount
    useEffect(() => {
        if (items.length > 0 && orderedItems.length === 0) {
            const shuffled = [...items].sort(() => Math.random() - 0.5)
            setOrderedItems(shuffled)
            onAnswersChange(shuffled.map(i => i.id))
        }
    }, [items, orderedItems.length, onAnswersChange])

    const [activeId, setActiveId] = useState<number | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        if (hasAnswered) return
        setActiveId(event.active.id as number)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        if (hasAnswered) return

        const { active, over } = event
        setActiveId(null)

        if (!over || active.id === over.id) return

        // active.id is the ITEM ID (number)
        const oldIndex = orderedItems.findIndex((item) => item.id === active.id)
        const newIndex = orderedItems.findIndex((item) => item.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(orderedItems, oldIndex, newIndex)
            setOrderedItems(newItems)
            onAnswersChange(newItems.map(i => i.id))
        }
    }

    // We use item.id as the key. Dnd-kit expects string or number.

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-3">
                <SortableContext items={orderedItems.map(i => i.id)} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {orderedItems.map((item) => (
                            <SortableOrderingItem
                                key={item.id}
                                id={item.id}
                                content={item.content}
                                isDragging={activeId === item.id}
                                disabled={hasAnswered}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>

            <DragOverlay>
                {activeId !== null ? (
                    <Card className="p-4 shadow-lg opacity-90 cursor-grabbing bg-primary/5 border-primary">
                        <p className="text-sm font-medium text-foreground">
                            {orderedItems.find((item) => item.id === activeId)?.content}
                        </p>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

function SortableOrderingItem({
    id,
    content,
    isDragging,
    disabled
}: {
    id: number
    content: string
    isDragging: boolean
    disabled: boolean
}) {
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Card
                className={`p-4 min-w-[120px] max-w-[200px] transition-all
                     ${disabled ? 'opacity-80 cursor-default' : 'cursor-grab active:cursor-grabbing hover:border-primary/50'}
                     ${isDragging ? 'bg-primary/5 border-primary ring-2 ring-primary/20' : 'bg-card'}
                `}
            >
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground break-words select-none">
                        {content}
                    </p>
                </div>
            </Card>
        </div>
    )
}
