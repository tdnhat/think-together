'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
    ReactFlow,
    Node,
    Edge,
    Connection,
    Handle,
    Position,
    type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card } from '@/shared/ui/card'
import { useChallengeStore } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'

interface MatchingQuestionProps {
    question: ChallengeQuestionDto
    onAnswerChange?: (answer: Array<{ leftContent: string; rightContent: string }>) => void
}

/**
 * Custom Node Component for React Flow
 */
function MatchingNode({ data, id }: NodeProps) {
    const { content, isMatched, matchStatus, isCompleted } = data as {
        content: string;
        isMatched: boolean;
        matchStatus: { isCorrect: boolean; isIncorrect: boolean } | null;
        isCompleted: boolean;
    }

    // Determine if this is a left or right node
    const isLeftNode = id.startsWith('left-')

    return (
        <div className="px-4 py-2">
            <Card
                className={`p-4 transition-colors ${isCompleted
                        ? matchStatus?.isCorrect
                            ? 'bg-green-50 border-green-500'
                            : matchStatus?.isIncorrect
                                ? 'bg-red-50 border-red-500'
                                : 'opacity-70'
                        : isMatched
                            ? 'bg-blue-50 border-blue-300'
                            : 'hover:bg-muted'
                    }`}
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

const nodeTypes: { [key: string]: React.ComponentType<NodeProps> } = {
    matching: MatchingNode,
}

/**
 * Render options for Matching questions using React Flow
 */
export function MatchingQuestion({
    question,
    onAnswerChange,
}: Readonly<MatchingQuestionProps>) {
    const storeAnswer = useChallengeStore((s) => s.getAnswer(question.id))
    const answer = question.answer || storeAnswer
    const currentAttempt = useChallengeStore((s) => s.currentAttempt)
    const isCompleted = currentAttempt?.status === 'Completed'

    const matchingPairs = question.matchingPairs || []
    const [matches, setMatches] = useState<Map<number, number>>(() => {
        // Initialize matches from existing answer
        const initialMatches = new Map<number, number>()
        if (answer?.matchingPairs && matchingPairs.length > 0) {
            answer.matchingPairs.forEach((pair) => {
                const leftIndex = matchingPairs.findIndex(
                    (p) => p.leftContent === pair.leftContent
                )
                const rightIndex = matchingPairs.findIndex(
                    (p) => p.rightContent === pair.rightContent
                )
                if (leftIndex !== -1 && rightIndex !== -1) {
                    initialMatches.set(leftIndex, rightIndex)
                }
            })
        }
        return initialMatches
    })

    // Shuffle right items for display (but keep original indices) - only shuffle once
    const [rightItems] = useState(() => {
        return matchingPairs.map((pair, index) => ({ ...pair, originalIndex: index }))
            .sort(() => Math.random() - 0.5)
    })

    const getRightItemMatch = (rightOriginalIndex: number) => {
        for (const [leftIdx, rightIdx] of matches.entries()) {
            if (rightIdx === rightOriginalIndex) {
                return leftIdx
            }
        }
        return null
    }

    const isRightItemMatched = (rightOriginalIndex: number) => {
        return getRightItemMatch(rightOriginalIndex) !== null
    }

    const getMatchStatus = (leftIndex: number, rightOriginalIndex: number) => {
        if (!isCompleted) return null
        const matchedLeft = matches.get(leftIndex)
        const correctMatch = leftIndex === rightOriginalIndex
        const isMatched = matchedLeft === rightOriginalIndex
        return { isCorrect: correctMatch && isMatched, isIncorrect: isMatched && !correctMatch }
    }


    // Create initial nodes for React Flow
    const initialNodes = useMemo(() => {
        const nodes: Node[] = []
        const nodeSpacing = 140
        const leftColumnX = 50
        const rightColumnX = 550
        const startY = 60

        // Left column nodes
        matchingPairs.forEach((pair, index) => {
            const isMatched = matches.has(index)
            const matchedRightIdx = matches.get(index)
            const matchStatus = isCompleted && isMatched && matchedRightIdx !== undefined
                ? getMatchStatus(index, matchedRightIdx)
                : null

            nodes.push({
                id: `left-${index}`,
                type: 'matching',
                position: { x: leftColumnX, y: startY + index * nodeSpacing },
                data: {
                    content: pair.leftContent,
                    isMatched,
                    matchStatus,
                    isCompleted,
                },
                draggable: false,
            })
        })

        // Right column nodes
        rightItems.forEach((item, displayIndex) => {
            const rightOriginalIndex = item.originalIndex
            const isMatched = isRightItemMatched(rightOriginalIndex)
            const matchedLeftIndex = getRightItemMatch(rightOriginalIndex)
            const matchStatus = isCompleted && isMatched && matchedLeftIndex !== null
                ? getMatchStatus(matchedLeftIndex, rightOriginalIndex)
                : null

            nodes.push({
                id: `right-${displayIndex}`,
                type: 'matching',
                position: { x: rightColumnX, y: startY + displayIndex * nodeSpacing },
                data: {
                    content: item.rightContent,
                    isMatched,
                    isSelected: false,
                    matchStatus,
                    isCompleted,
                },
                draggable: false,
            })
        })

        return nodes
    }, [matchingPairs, rightItems, matches, isCompleted])

    // Create initial edges for React Flow
    const initialEdges = useMemo(() => {
        const edges: Edge[] = []

        matches.forEach((rightOriginalIdx, leftIdx) => {
            const rightDisplayIdx = rightItems.findIndex(item => item.originalIndex === rightOriginalIdx)
            if (rightDisplayIdx === -1) return

            const matchStatus = isCompleted ? getMatchStatus(leftIdx, rightOriginalIdx) : null
            const edgeColor = matchStatus?.isCorrect ? '#10b981' : matchStatus?.isIncorrect ? '#ef4444' : '#3b82f6'
            const strokeDasharray = matchStatus ? '0' : '8,4'

            edges.push({
                id: `edge-${leftIdx}-${rightDisplayIdx}`,
                source: `left-${leftIdx}`,
                target: `right-${rightDisplayIdx}`,
                sourceHandle: 'source',
                targetHandle: 'target',
                type: 'simplebezier',
                style: {
                    stroke: edgeColor,
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeDasharray,
                    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.4))',
                },
                animated: true,
            })
        })

        return edges
    }, [matches, rightItems, isCompleted])

    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges] = useState<Edge[]>(initialEdges)

    // Update nodes when dependencies change
    useEffect(() => {
        const updatedNodes = initialNodes.map((node) => {
            if (node.id.startsWith('left-')) {
                const index = parseInt(node.id.replace('left-', ''))
                const isMatched = matches.has(index)
                const matchedRightIdx = matches.get(index)
                const matchStatus = isCompleted && isMatched && matchedRightIdx !== undefined
                    ? getMatchStatus(index, matchedRightIdx)
                    : null
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isMatched,
                        matchStatus,
                    },
                }
            } else if (node.id.startsWith('right-')) {
                const displayIndex = parseInt(node.id.replace('right-', ''))
                const rightItem = rightItems[displayIndex]
                const rightOriginalIndex = rightItem.originalIndex
                const isMatched = isRightItemMatched(rightOriginalIndex)
                const matchedLeftIndex = getRightItemMatch(rightOriginalIndex)
                const matchStatus = isCompleted && isMatched && matchedLeftIndex !== null
                    ? getMatchStatus(matchedLeftIndex, rightOriginalIndex)
                    : null
                return {
                    ...node,
                    data: {
                        ...node.data,
                        isMatched,
                        matchStatus,
                    },
                }
            }
            return node
        })
        setNodes(updatedNodes)
    }, [matches, isCompleted, initialNodes, rightItems])

    // Update edges when matches change
    useEffect(() => {
        const newEdges: Edge[] = []

        matches.forEach((rightOriginalIdx, leftIdx) => {
            const rightDisplayIdx = rightItems.findIndex(item => item.originalIndex === rightOriginalIdx)
            if (rightDisplayIdx === -1) return

            const matchStatus = isCompleted ? getMatchStatus(leftIdx, rightOriginalIdx) : null
            const edgeColor = matchStatus?.isCorrect ? '#10b981' : matchStatus?.isIncorrect ? '#ef4444' : '#3b82f6'
            const strokeDasharray = matchStatus ? '0' : '8,4'

            newEdges.push({
                id: `edge-${leftIdx}-${rightDisplayIdx}`,
                source: `left-${leftIdx}`,
                target: `right-${rightDisplayIdx}`,
                sourceHandle: 'source',
                targetHandle: 'target',
                type: 'simplebezier',
                style: {
                    stroke: edgeColor,
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeDasharray,
                    filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.4))',
                },
                animated: true,
            })
        })

        setEdges(newEdges)
    }, [matches, rightItems, isCompleted])


    // Handle drag connections
    const onConnect = useCallback((params: Connection) => {
        if (isCompleted) return

        const { source, target } = params
        if (!source || !target) return

        // Extract indices from node IDs
        const leftMatch = source.match(/^left-(\d+)$/)
        const rightMatch = target.match(/^right-(\d+)$/)

        if (!leftMatch || !rightMatch) return

        const leftIndex = parseInt(leftMatch[1])
        const rightDisplayIndex = parseInt(rightMatch[1])

        // Get the original right index from shuffled items
        const rightItem = rightItems[rightDisplayIndex]
        const rightOriginalIndex = rightItem.originalIndex

        // Check if left item is already matched
        if (matches.has(leftIndex)) return

        // Check if right item is already matched
        if (isRightItemMatched(rightOriginalIndex)) return

        // Create new match
        const newMatches = new Map(matches)
        newMatches.set(leftIndex, rightOriginalIndex)
        setMatches(newMatches)

        // Convert matches to answer format
        const matchingPairsAnswer: Array<{ leftContent: string; rightContent: string }> = []
        newMatches.forEach((rightIdx, leftIdx) => {
            matchingPairsAnswer.push({
                leftContent: matchingPairs[leftIdx].leftContent,
                rightContent: matchingPairs[rightIdx].rightContent,
            })
        })

        // Call onAnswerChange with the matching pairs
        onAnswerChange?.(matchingPairsAnswer)
    }, [isCompleted, rightItems, matches, matchingPairs, onAnswerChange])

    return (
        <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
                Kéo từ tay cầm bên trái đến tay cầm bên phải để tạo kết nối:
            </div>

            <div style={{ width: '100%', height: `${Math.max(matchingPairs.length * 140, 450)}px`, backgroundColor: 'var(--bg-primary)' }} className="border-2 border-border rounded-lg overflow-hidden">
                <ReactFlow
                    key={`flow-${matches.size}-${isCompleted}`}
                    nodes={nodes}
                    edges={edges}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    nodesConnectable={!isCompleted}
                    elementsSelectable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    onDoubleClick={(e) => e.preventDefault()}
                >
                </ReactFlow>
            </div>


            {matches.size > 0 && !isCompleted && (
                <div className="text-sm text-muted-foreground text-center py-2">
                    Đã ghép {matches.size}/{matchingPairs.length} cặp
                </div>
            )}
        </div>
    )
}
