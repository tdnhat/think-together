'use client'

import { useState } from 'react'
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
import { useChallengeStore } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'
import { OrderingSortableItem } from '@/shared/components/question/ordering-sortable-item'

interface OrderingQuestionProps {
    question: ChallengeQuestionDto
    onAnswerChange?: (answer: Array<{ content: string; position: number }>) => void
}

/**
 * Render options for Ordering questions: horizontal drag and drop items
 */
export function OrderingQuestion({
    question,
    onAnswerChange,
}: Readonly<OrderingQuestionProps>) {
    const storeAnswer = useChallengeStore((s) => s.getAnswer(question.id))
    const answer = question.answer || storeAnswer
    const currentAttempt = useChallengeStore((s) => s.currentAttempt)
    const isCompleted = currentAttempt?.status === 'Completed'

    const orderingItems = question.orderingItems || []

    // Initialize ordered items from answer or shuffle original items
    const [orderedItems, setOrderedItems] = useState<Array<{ content: string; correctPosition: number; originalIndex: number; id: string }>>(() => {
        if (answer?.orderingItems && answer.orderingItems.length > 0) {
            // Restore from answer - sort by position from answer
            const sortedAnswer = [...answer.orderingItems].sort((a, b) => a.position - b.position)
            return sortedAnswer.map((item, index) => {
                const originalIndex = orderingItems.findIndex((oi) => oi.content === item.content)
                return {
                    content: item.content,
                    correctPosition: originalIndex >= 0 ? orderingItems[originalIndex].correctPosition : 0,
                    originalIndex: originalIndex >= 0 ? originalIndex : 0,
                    id: `item-${originalIndex >= 0 ? originalIndex : index}`,
                }
            })
        }
        // Shuffle for new answer
        return orderingItems
            .map((item, index) => ({ ...item, originalIndex: index, id: `item-${index}` }))
            .sort(() => Math.random() - 0.5)
    })

    const [activeId, setActiveId] = useState<string | null>(null)

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
        if (isCompleted) return
        setActiveId(event.active.id as string)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        if (isCompleted) return

        const { active, over } = event
        setActiveId(null)

        if (!over || active.id === over.id) return

        const oldIndex = orderedItems.findIndex((item) => item.id === active.id)
        const newIndex = orderedItems.findIndex((item) => item.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
            const newItems = arrayMove(orderedItems, oldIndex, newIndex)
            setOrderedItems(newItems)

            // Convert to answer format
            const orderingItemsAnswer: Array<{ content: string; position: number }> = newItems.map(
                (item, index) => ({
                    content: item.content,
                    position: index,
                })
            )

            onAnswerChange?.(orderingItemsAnswer)
        }
    }

    const getItemStatus = (item: { content: string; correctPosition: number; originalIndex: number }, currentPosition: number) => {
        if (!isCompleted) return undefined
        return item.correctPosition === currentPosition // boolean
    }

    const itemIds = orderedItems.map((item) => item.id)

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-3">
                <div className="text-sm text-muted-foreground mb-4">
                    Kéo thả các mục để sắp xếp theo thứ tự đúng:
                </div>

                <SortableContext items={itemIds} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-wrap gap-3">
                        {orderedItems.map((item, index) => {
                            const isCorrect = getItemStatus(item, index)

                            return (
                                <OrderingSortableItem
                                    key={item.id}
                                    id={item.id}
                                    content={item.content}
                                    isDragging={activeId === item.id}
                                    disabled={isCompleted}
                                    isCompleted={isCompleted}
                                    isCorrect={isCorrect}
                                />
                            )
                        })}
                    </div>
                </SortableContext>
            </div>

            <DragOverlay>
                {activeId ? (
                    <Card className="p-3 shadow-lg opacity-90">
                        <p className="text-sm font-medium text-foreground">
                            {orderedItems.find((item) => item.id === activeId)?.content}
                        </p>
                    </Card>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
