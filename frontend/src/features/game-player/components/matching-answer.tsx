'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import {
    ReactFlow,
    Node,
    Edge,
    Connection,
    ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { MatchingItemInfo } from '@/features/game-host/types'
import { MatchingNode } from '@/shared/components/question/matching-node'

interface MatchingAnswerProps {
    leftItems: MatchingItemInfo[]
    rightItems: MatchingItemInfo[]
    hasAnswered: boolean
    onAnswersChange: (answers: number[]) => void
}

const nodeTypes = {
    matching: MatchingNode,
}

function MatchingAnswerInternal({
    leftItems,
    rightItems,
    hasAnswered,
    onAnswersChange,
}: MatchingAnswerProps) {
    // State for matches: Left Item ID -> Right Item ID
    const [matches, setMatches] = useState<Map<number, number>>(new Map())

    // Shuffle right items once on mount
    const [shuffledRightItems] = useState(() => {
        return [...rightItems].sort(() => Math.random() - 0.5)
    })

    const isRightItemMatched = useCallback((rightId: number) => {
        return Array.from(matches.values()).includes(rightId)
    }, [matches])

    // Propagate changes
    useEffect(() => {
        if (typeof onAnswersChange !== 'function') return

        const result: number[] = new Array(leftItems.length).fill(-1)
        matches.forEach((rightId, leftId) => {
            result[leftId] = rightId
        })

        const hasAnyMatch = matches.size > 0
        if (hasAnyMatch) {
            onAnswersChange(result)
        } else {
            onAnswersChange([])
        }
    }, [matches, leftItems.length, onAnswersChange])

    // Create Nodes
    const nodes = useMemo(() => {
        const _nodes: Node[] = []
        const nodeSpacing = 80 // Vertical spacing
        const leftColumnX = 20
        const rightColumnX = 400 // Fixed width for mobile support? Or use percentage?
        // ReactFlow works with absolute pixels mostly.

        // Left Column
        leftItems.forEach((item, index) => {
            const isMatched = matches.has(item.id)
            _nodes.push({
                id: `left-${item.id}`,
                type: 'matching',
                position: { x: leftColumnX, y: index * nodeSpacing },
                data: {
                    content: item.content,
                    isMatched
                },
                draggable: false,
                connectable: !hasAnswered && !isMatched
            })
        })

        // Right Column
        shuffledRightItems.forEach((item, index) => {
            const isMatched = isRightItemMatched(item.id)
            _nodes.push({
                id: `right-${item.id}`,
                type: 'matching',
                position: { x: rightColumnX, y: index * nodeSpacing },
                data: {
                    content: item.content,
                    isMatched
                },
                draggable: false
            })
        })

        return _nodes
    }, [leftItems, shuffledRightItems, matches, hasAnswered, isRightItemMatched])

    // Create Edges
    const edges = useMemo(() => {
        const _edges: Edge[] = []

        matches.forEach((rightId, leftId) => {
            _edges.push({
                id: `edge-${leftId}-${rightId}`,
                source: `left-${leftId}`,
                target: `right-${rightId}`,
                sourceHandle: 'source',
                targetHandle: 'target',
                type: 'default', // Simple bezier or default
                style: {
                    stroke: '#3b82f6', // Blue
                    strokeWidth: 2,
                },
                animated: false
            })
        })
        return _edges
    }, [matches])

    const onConnect = useCallback((params: Connection) => {
        if (hasAnswered) return

        const { source, target } = params
        if (!source || !target) return

        // Parse IDs (left-ID, right-ID)
        const leftId = parseInt(source.replace('left-', ''))
        const rightId = parseInt(target.replace('right-', ''))

        if (isNaN(leftId) || isNaN(rightId)) return

        // Update matches
        setMatches(prev => {
            const next = new Map(prev)
            // Remove any existing match for this leftId (overwrite)
            next.set(leftId, rightId)

            // Check if rightId is used, remove old match
            for (const [l, r] of prev.entries()) {
                if (r === rightId && l !== leftId) {
                    next.delete(l)
                }
            }
            return next
        })

    }, [hasAnswered])

    // Disconnect on edge click
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        if (hasAnswered) return

        // id format: edge-LeftID-RightID
        const parts = edge.id.split('-')
        if (parts.length < 3) return

        const leftId = parseInt(parts[1])
        setMatches(prev => {
            const next = new Map(prev)
            next.delete(leftId)
            return next
        })
    }, [hasAnswered])

    return (
        <div style={{ height: Math.max(leftItems.length * 80 + 50, 400), width: '100%' }} className="border rounded-lg bg-card">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onEdgeClick={onEdgeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodesDraggable={false}
                nodesConnectable={!hasAnswered}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                proOptions={{ hideAttribution: true }}
            />
            {!hasAnswered && (
                <div className="text-xs text-center text-muted-foreground mt-2 pb-2">
                    Kéo nối các mục để ghép cặp. Nhấp vào đường nối để xóa.
                </div>
            )}
        </div>
    )
}

// Wrap in Provider to ensure context exists
export function MatchingAnswer(props: MatchingAnswerProps) {
    return (
        <ReactFlowProvider>
            <MatchingAnswerInternal {...props} />
        </ReactFlowProvider>
    )
}
