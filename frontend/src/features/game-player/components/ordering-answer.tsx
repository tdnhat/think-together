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
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Card } from '@/shared/ui/card'
import { OrderingItemInfo } from '@/features/game-host/types'
import { OrderingSortableItem } from '@/shared/components/question/ordering-sortable-item'

interface OrderingAnswerProps {
    items: OrderingItemInfo[]
    hasAnswered: boolean
    onAnswersChange: (answers: number[]) => void
}

/**
 * Render options for Ordering questions
 */
export function OrderingAnswer({
    items,
    hasAnswered,
    onAnswersChange,
}: OrderingAnswerProps) {

    // items: { id: number, content: string }
    const [orderedItems, setOrderedItems] = useState<OrderingItemInfo[]>([])

    // Shuffle on mount
    useEffect(() => {
        if (items.length > 0 && orderedItems.length === 0 && typeof onAnswersChange === 'function') {
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
            if (typeof onAnswersChange === 'function') {
                onAnswersChange(newItems.map(i => i.id))
            }
        }
    }

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
                            <OrderingSortableItem
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
