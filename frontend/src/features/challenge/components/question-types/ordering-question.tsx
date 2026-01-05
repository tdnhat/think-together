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
    useSortable,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { useChallengeStore } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'

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
        if (!isCompleted) return null
        const isCorrect = item.correctPosition === currentPosition
        return { isCorrect }
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
                            const status = getItemStatus(item, index)

                            return (
                                <SortableOrderingItem
                                    key={item.id}
                                    id={item.id}
                                    item={item}
                                    index={index}
                                    status={status}
                                    isCompleted={isCompleted}
                                    isDragging={activeId === item.id}
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

// Sortable Ordering Item Component (Horizontal)
function SortableOrderingItem({
    id,
    item,
    index,
    status,
    isCompleted,
    isDragging,
}: {
    id: string
    item: { content: string; correctPosition: number; originalIndex: number }
    index: number
    status: { isCorrect: boolean } | null
    isCompleted: boolean
    isDragging: boolean
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
        disabled: isCompleted,
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDndDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                className={`p-4 cursor-grab active:cursor-grabbing min-w-[120px] transition-colors ${isCompleted
                        ? status?.isCorrect
                            ? 'bg-green-50 border-green-500'
                            : 'bg-red-50 border-red-500'
                        : isDragging
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
                            : 'bg-muted border-border hover:bg-background'
                    }`}
            >
                {/* Content */}
                <div className="text-center">
                    <p
                        className={`text-sm font-medium ${isCompleted
                                ? status?.isCorrect
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                : 'text-foreground'
                            }`}
                    >
                        {item.content}
                    </p>
                </div>

                {/* Status Indicator */}
                {isCompleted && (
                    <div className="mt-2 flex justify-center">
                        {status?.isCorrect ? (
                            <Badge variant="default" className="bg-green-500 text-white">✓</Badge>
                        ) : (
                            <Badge variant="default" className="bg-red-500 text-white">✗</Badge>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}
