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
    ReactFlowProvider,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Card } from '@/shared/ui/card'
import { MatchingItemInfo } from '@/features/game-host/types'

interface MatchingAnswerProps {
    leftItems: MatchingItemInfo[]
    rightItems: MatchingItemInfo[]
    hasAnswered: boolean
    onAnswersChange: (answers: number[]) => void
}

/**
 * Custom Node Component for React Flow
 */
function MatchingNode({ data, id }: NodeProps) {
    const { content, isMatched } = data as {
        content: string;
        isMatched: boolean;
    }

    // Determine if this is a left or right node
    const isLeftNode = id.startsWith('left-')

    return (
        <div className="px-4 py-2">
            <Card
                className={`p-4 transition-colors ${isMatched
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

const nodeTypes = {
    matching: MatchingNode,
}

function MatchingAnswerInternal({
    leftItems,
    rightItems,
    hasAnswered,
    onAnswersChange,
}: MatchingAnswerProps) {
    // We need to map left indices to right IDs (which we know are same as indices in the source, BUT shuffled in display)
    // The previous implementation assumed IDs 0..N.
    // Let's verify if rightItems passed here are already shuffled or not. 
    // In PlayerQuestion, we pass `question.matchingRight`.
    // The backend `QuestionStartedMessage` sends `MatchingRight` which are the items.
    // NOTE: In `GameQuestionMappingService`, we likely sent them in original order?
    // Wait, `MatchingRight` is a list. The backend sends `RightItem`.
    // We should shuffle them here for display, but keep track of their original ID.
    // Effectively, `MatchingItemInfo` has `id` and `content`.

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
        // Backend expects array of size LeftItems.length.
        // value at [i] is the Right Item ID matched to Left Item i.
        const result: number[] = new Array(leftItems.length).fill(-1)

        matches.forEach((rightId, leftId) => {
            // Find index of left item with this leftId (if leftItems is not sorted by ID? Assumed sorted 0..N)
            // Backend sends "MatchingLeft" list. We assume Left ID 0 is at index 0.
            // If `MatchingItemInfo` IDs are reliable 0..N indices:
            result[leftId] = rightId
        })

        // Only propagate if we have matches?
        // Parent component logic handles "canSubmit" based on non-empty/complete.
        // Note: previous implementation filtered -1? No, it pushed -1.

        // We probably want to submit mostly complete answers.
        // Let's send the result array as is.
        // Wait, if result contains -1, can we submit? 
        // Backend check: `if (selectedOptionIndexes.Count != question.MatchingPairs.Count) return false;`
        // So we must have a value for every left item.
        // `selectedOptionIndexes[i] != i` is check for correctness.
        // If we send -1, it won't match i (0..N). So it's counted as wrong.
        // But we need to ensure we don't submit `null` or missing entries to backend via SignalR if it expects strict Int32.
        // -1 is fine as integer.

        // Only trigger change if we have at least one match?
        // Actually parent checks `selectedAnswers.length > 0`.
        // If we pass an array of -1s, length > 0.
        // But we want `canSubmit` to be true only if ALL are matched?
        // Or partial?
        // Backend checks `Count`. It doesn't say "All must be valid IDs".
        // But conventionally, usually we force user to complete all matches.
        // But let's allow partial for now or check parent logic.
        // Parent: `canSubmit = selectedAnswers.length > 0`.
        // If we return `[-1, -1, ...]`, length is N. So user can submit empty!
        // We should probably filter out -1s in parent? No, parent stores `number[]`.
        // We should effectively return EMPTY array if not fully matched?
        // OR, better: We only populate `selectedAnswers` with valid connections.
        // But `selectedAnswers` equates to `selectedOptionIndexes` in SignalR.
        // SignalR sends `int[]`.
        // If we send `[-1, 0, -1]`, backend receives `[-1, 0, -1]`. count is 3. Matches count is 3.
        // Correctness check: `selectedOptionIndexes[0] == -1 != 0` -> Write.
        // So submitting partials is interpreted as wrong answers.
        // That is acceptable behavior: unanswered pairs are wrong.

        // HOWEVER, to prevent accidental submission of empty/partial, maybe we should only call onAnswersChange with valid stuff?
        // But `selectedAnswers` in parent is used for "canSubmit".
        // If I want to prevent submit until AT LEAST ONE match:
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
                connectable: !hasAnswered && !isMatched // Can't connect if already matched (must disconnect first? Or just allow overwrite?)
                // Actually MatchingQuestion allowed overwrite via onConnect logic, but `nodesConnectable` prop on Handle handles UI.
                // Using `connectable` here on Node might disable handles.
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

            // Should we support 1-to-1 only? Yes.
            // If rightId is already matched to another leftId, remove that match?
            // "Bijective" matching usually implies unique pairs.
            // Check if rightId is used
            for (const [l, r] of prev.entries()) {
                if (r === rightId && l !== leftId) {
                    next.delete(l)
                }
            }
            return next
        })

    }, [hasAnswered])

    // Disconnect on edge click? Or double click?
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
