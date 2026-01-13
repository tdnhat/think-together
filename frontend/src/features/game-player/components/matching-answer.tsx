'use client'

import { useEffect, useState, useMemo } from 'react'
import { CheckCircle, Circle, X } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'
import { MatchingItemInfo } from '@/features/game-host/types'

interface MatchingAnswerProps {
    leftItems: MatchingItemInfo[]
    rightItems: MatchingItemInfo[]
    hasAnswered: boolean
    onAnswersChange: (answers: number[]) => void
}

export function MatchingAnswer({
    leftItems,
    rightItems,
    hasAnswered,
    onAnswersChange,
}: MatchingAnswerProps) {
    // Store shuffled right items to maintain order across re-renders
    const [shuffledRightItems, setShuffledRightItems] = useState<MatchingItemInfo[]>([])
    const [selectedLeftId, setSelectedLeftId] = useState<number | null>(null)

    // Map LeftID -> RightID
    const [matches, setMatches] = useState<Record<number, number>>({})

    // Shuffle right items on mount
    useEffect(() => {
        // Only shuffle if not already shuffled (to prevent re-shuffle on re-renders)
        if (shuffledRightItems.length === 0 && rightItems.length > 0) {
            const shuffled = [...rightItems].sort(() => Math.random() - 0.5)
            setShuffledRightItems(shuffled)
        }
    }, [rightItems, shuffledRightItems.length])

    // Reset selection when answered
    useEffect(() => {
        if (hasAnswered) {
            setSelectedLeftId(null)
        }
    }, [hasAnswered])

    // Propagate changes
    useEffect(() => {
        // Convert matches map to array [MatchForLeft0, MatchForLeft1, ...]
        // If not matched, use -1 (or handle partial submission)
        // The backend expects values for ALL items? Or partial?
        // Backend "selectedOptionIndexes[i]" corresponds to Left i.
        const result: number[] = []
        let allMatched = true

        for (const left of leftItems) {
            if (matches[left.id] !== undefined) {
                result.push(matches[left.id])
            } else {
                // We can't push undefined. Push -1?
                // Actually, if we push a partial list, the index mapping breaks.
                // We must push something.
                // But backend doesn't handle -1.
                // So we might only call onAnswersChange when ALL are matched?
                // Or we pass partial array and handle it?
                // Let's pass array of size N, with -1 for unmatched.
                // Parent component should filter or validate.
                result.push(-1)
                allMatched = false
            }
        }

        // Only propagate if we have some matches? Or always?
        // Parent checks "canSubmit".
        // If we have -1s, is it valid?
        // We should probably allow submitting partial answers?
        // But backend checks "if (selectedOptionIndexes.Count != question.MatchingPairs.Count) return false;"
        // So we must submit ALL.
        if (allMatched) {
            onAnswersChange(result)
        } else {
            // Pass empty or special value to indicate incomplete?
            // Or pass the partial array and let parent decide.
            // But parent usually checks "length > 0".
            // If we want to disable submit until all matched:
            onAnswersChange([]) // Treat as empty/invalid
        }

    }, [matches, leftItems, onAnswersChange])

    const handleLeftClick = (id: number) => {
        if (hasAnswered) return

        // If already matched, unmatch
        if (matches[id] !== undefined) {
            const newMatches = { ...matches }
            delete newMatches[id]
            setMatches(newMatches)
            return
        }

        setSelectedLeftId(id === selectedLeftId ? null : id)
    }

    const handleRightClick = (id: number) => {
        if (hasAnswered) return
        if (selectedLeftId === null) return

        // Create match
        const newMatches = { ...matches }
        newMatches[selectedLeftId] = id
        setMatches(newMatches)
        setSelectedLeftId(null)
    }

    // Helper to check if right item is matched
    const isRightMatched = (id: number) => {
        return Object.values(matches).includes(id)
    }

    // Get Color for a match pair
    // We can use distinct colors for visualization
    const getMatchColor = (leftId: number) => {
        const colors = [
            "border-red-500 bg-red-50 text-red-700",
            "border-blue-500 bg-blue-50 text-blue-700",
            "border-green-500 bg-green-50 text-green-700",
            "border-yellow-500 bg-yellow-50 text-yellow-700",
            "border-purple-500 bg-purple-50 text-purple-700",
        ]
        return colors[leftId % colors.length]
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:gap-8">
            {/* Left Column */}
            <div className="space-y-3">
                <h3 className="text-center font-semibold text-muted-foreground mb-2">Cột A</h3>
                {leftItems.map((item) => {
                    const isMatched = matches[item.id] !== undefined
                    const isSelected = selectedLeftId === item.id
                    const matchColor = isMatched ? getMatchColor(item.id) : ""

                    return (
                        <Button
                            key={item.id}
                            type="button"
                            variant="outline"
                            className={cn(
                                "w-full h-auto min-h-[60px] p-3 justify-start whitespace-normal text-left relative",
                                isSelected && "ring-2 ring-primary border-primary",
                                isMatched && matchColor,
                                hasAnswered && "opacity-80 disabled:opacity-80"
                            )}
                            onClick={() => handleLeftClick(item.id)}
                            disabled={hasAnswered}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <span className="font-bold opacity-50">{item.id + 1}</span>
                                <span className="flex-1">{item.content}</span>
                                {isMatched && <CheckCircle className="h-5 w-5 opacity-50" />}
                                {isSelected && !isMatched && <Circle className="h-5 w-5 opacity-50" />}
                            </div>
                        </Button>
                    )
                })}
            </div>

            {/* Right Column */}
            <div className="space-y-3">
                <h3 className="text-center font-semibold text-muted-foreground mb-2">Cột B</h3>
                {shuffledRightItems.map((item) => {
                    // Find which left ID maps to this right ID
                    const matchedLeftId = Object.keys(matches).find(key => matches[Number(key)] === item.id)
                    const isMatched = matchedLeftId !== undefined
                    const matchColor = isMatched ? getMatchColor(Number(matchedLeftId)) : ""
                    const canSelect = selectedLeftId !== null && !isMatched

                    return (
                        <Button
                            key={item.id}
                            type="button"
                            variant="outline"
                            className={cn(
                                "w-full h-auto min-h-[60px] p-3 justify-start whitespace-normal text-left",
                                isMatched && matchColor,
                                canSelect && "hover:border-primary hover:bg-primary/5 cursor-pointer",
                                !canSelect && !isMatched && "opacity-50 cursor-not-allowed",
                                hasAnswered && "opacity-80 disabled:opacity-80"
                            )}
                            onClick={() => isMatched ? null : handleRightClick(item.id)}
                            disabled={hasAnswered || (!canSelect && !isMatched)}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <span className="flex-1">{item.content}</span>
                                {isMatched && <CheckCircle className="h-5 w-5 opacity-50" />}
                            </div>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
