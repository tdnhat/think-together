'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'
import { OrderingItemInfo } from '@/features/game-host/types'

interface OrderingAnswerProps {
    items: OrderingItemInfo[]
    hasAnswered: boolean
    onAnswersChange: (answers: number[]) => void
}

export function OrderingAnswer({
    items,
    hasAnswered,
    onAnswersChange,
}: OrderingAnswerProps) {
    const [orderedItems, setOrderedItems] = useState<OrderingItemInfo[]>([])

    // Shuffle items on mount
    useEffect(() => {
        if (orderedItems.length === 0 && items.length > 0) {
            const shuffled = [...items].sort(() => Math.random() - 0.5)
            setOrderedItems(shuffled)
            // Initial report
            onAnswersChange(shuffled.map(i => i.id))
        }
    }, [items, orderedItems.length, onAnswersChange])

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (hasAnswered) return

        const newItems = [...orderedItems]
        if (direction === 'up') {
            if (index === 0) return
            [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]]
        } else {
            if (index === newItems.length - 1) return
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
        }

        setOrderedItems(newItems)
        onAnswersChange(newItems.map(i => i.id))
    }

    return (
        <div className="space-y-3 max-w-2xl mx-auto">
            <p className="text-center text-sm text-muted-foreground mb-4">
                Sắp xếp các mục theo đúng thứ tự
            </p>

            {orderedItems.map((item, index) => (
                <div
                    key={item.id}
                    className={cn(
                        "flex items-center gap-3 p-3 bg-card border rounded-xl transition-all",
                        hasAnswered && "opacity-80"
                    )}
                >
                    {/* Position indicator */}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground flex-shrink-0">
                        {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 font-medium text-base break-words">
                        {item.content}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        {!hasAnswered && (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-secondary"
                                    disabled={index === 0}
                                    onClick={() => moveItem(index, 'up')}
                                >
                                    <ArrowUp className="h-5 w-5" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-secondary"
                                    disabled={index === orderedItems.length - 1}
                                    onClick={() => moveItem(index, 'down')}
                                >
                                    <ArrowDown className="h-5 w-5" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
