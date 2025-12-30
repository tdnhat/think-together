'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
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
import { Checkbox } from '@/shared/ui/checkbox'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { useChallengeStore, selectCurrentQuestion, selectCurrentQuestionIndex } from '@/features/challenge/store/challenge.store'
import type { ChallengeQuestionDto } from '@/features/challenge/types'
import { Flag, Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface QuestionDisplayProps {
  onAnswerChange?: (
    answer:
      | number[]
      | Array<[number, number]>
      | Array<[string, number]>
      | Array<{ leftContent: string; rightContent: string }>
      | Array<{ content: string; position: number }>
  ) => void
  className?: string
}

export function QuestionDisplay({ onAnswerChange, className = '' }: QuestionDisplayProps) {
  const question = useChallengeStore(selectCurrentQuestion)
  const currentQuestionIndex = useChallengeStore(selectCurrentQuestionIndex)
  const toggleFlagQuestion = useChallengeStore((s) => s.toggleFlagQuestion)
  const isFlagged = useChallengeStore((s) => (question ? s.isFlagged(question.id) : false))
  const currentAttempt = useChallengeStore((s) => s.currentAttempt)
  const isCompleted = currentAttempt?.status === 'Completed'

  if (!question) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--text-secondary)]">Không có câu hỏi để hiển thị</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-surface-secondary)] text-sm font-semibold text-[var(--text-primary)]">
            {currentQuestionIndex + 1}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base leading-snug">{question.content}</CardTitle>
          </div>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10"
              onClick={() => toggleFlagQuestion(question.id)}
              disabled={isCompleted}
              aria-pressed={isFlagged}
              title={isFlagged ? 'Bỏ đánh dấu' : 'Đánh dấu'}
            >
              <Flag className={isFlagged ? 'text-orange-600' : ''} />
            </Button>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent>
        {/* Video display for Video questions */}
        {question.type === 'Video' && question.videoUrl && (() => {
          // Convert YouTube URL to embed format
          let embedUrl = question.videoUrl
          if (question.videoUrl.includes('youtube.com/watch?v=')) {
            const videoId = question.videoUrl.split('v=')[1]?.split('&')[0]
            embedUrl = `https://www.youtube.com/embed/${videoId}`
          } else if (question.videoUrl.includes('youtu.be/')) {
            const videoId = question.videoUrl.split('youtu.be/')[1]?.split('?')[0]
            embedUrl = `https://www.youtube.com/embed/${videoId}`
          }
          
          // Add timestamp if provided
          if (question.videoTimestamp && question.videoTimestamp > 0) {
            embedUrl += embedUrl.includes('?') ? `&start=${question.videoTimestamp}` : `?start=${question.videoTimestamp}`
          }
          
          return (
            <div className="mb-6">
              <div className="bg-black rounded-lg overflow-hidden aspect-video">
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Video player"
                />
              </div>
            </div>
          )
        })()}

        {/* Audio display for Audio questions */}
        {question.type === 'Audio' && question.audioUrl && (
          <div className="mb-6">
            <AudioPlayer
              src={question.audioUrl}
              startTime={question.audioTimestamp || 0}
            />
          </div>
        )}
        
        {question.type === 'SingleChoice' || question.type === 'MultipleChoice' || question.type === 'Video' || question.type === 'Audio' ? (
          <RenderChoiceOptions key={question.id} question={question} onAnswerChange={onAnswerChange} />
        ) : question.type === 'TrueFalse' ? (
          <RenderTrueFalseOptions key={question.id} question={question} onAnswerChange={onAnswerChange} />
        ) : question.type === 'Matching' ? (
          <RenderMatchingOptions key={question.id} question={question} onAnswerChange={onAnswerChange} />
        ) : question.type === 'Ordering' ? (
          <RenderOrderingOptions key={question.id} question={question} onAnswerChange={onAnswerChange} />
        ) : null}
      </CardContent>
    </Card>
  )
}

/**
 * Render options for Single Choice and Multiple Choice questions
 */
function RenderChoiceOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: number[]) => void
}) {
  const storeAnswer = useChallengeStore((s) => s.getAnswer(question.id))
  // Use answer from question data (API response) if available, otherwise fall back to store
  const answer = question.answer || storeAnswer
  const selectedIndexes = answer?.selectedOptionIndexes || []
  const isMultiple = question.type === 'MultipleChoice'
  // Video questions are treated as single choice (only one correct answer)
  const currentAttempt = useChallengeStore((s) => s.currentAttempt)
  const isCompleted = currentAttempt?.status === 'Completed'

  const handleChange = (index: number, checked: boolean | 'indeterminate') => {
    // Don't allow changes when completed
    if (isCompleted) return

    const isChecked = checked === true

    let newIndexes: number[]
    if (isMultiple) {
      newIndexes = isChecked ? [...selectedIndexes, index] : selectedIndexes.filter((i) => i !== index)
    } else {
      newIndexes = isChecked ? [index] : []
    }
    onAnswerChange?.(newIndexes)
  }

  const getVariant = (index: number) => {
    const isSelected = selectedIndexes.includes(index)
    return isSelected ? 'default' : 'outline'
  }

  const getClassName = (index: number) => {
    const isSelected = selectedIndexes.includes(index)
    const isCorrect = question.options?.[index]?.isCorrect

    if (isCompleted) {
      if (isCorrect) {
        return 'bg-green-50 text-green-700'
      }
      if (isSelected && !isCorrect) {
        return 'bg-red-50 text-red-700'
      }
      return 'opacity-70'
    }

    if (isSelected) {
      return ''
    }
    return ''
  }

  const getCheckboxStyle = (index: number) => {
    const isSelected = selectedIndexes.includes(index)
    const isCorrect = question.options?.[index]?.isCorrect

    if (isCompleted) {
      if (isCorrect) {
        return 'border-green-500 data-[state=checked]:bg-green-500'
      }
      if (isSelected && !isCorrect) {
        return 'border-red-500 data-[state=checked]:bg-red-500'
      }
      return ''
    }

    if (isSelected) {
      return 'border-blue-500 data-[state=checked]:bg-blue-500'
    }
    return ''
  }

  return (
    <div className="space-y-3">
      {isMultiple ? (
        question.options?.map((option, index) => (
          <Button
            key={index}
            type="button"
            variant={getVariant(index)}
            className={`w-full justify-start h-auto py-4 whitespace-normal ${getClassName(index)}`}
            onClick={() => handleChange(index, !selectedIndexes.includes(index))}
            disabled={isCompleted}
          >
            <Checkbox
              checked={selectedIndexes.includes(index)}
              onCheckedChange={(checked) => handleChange(index, checked)}
              className={getCheckboxStyle(index)}
              disabled={isCompleted}
            />
            <span className="flex-1">{option.content}</span>
          </Button>
        ))
      ) : (
        question.options?.map((option, index) => {
          const isSelected = selectedIndexes.includes(index)
          const isCorrect = question.options?.[index]?.isCorrect

          const getRadioStyle = () => {
            if (isCompleted) {
              if (isCorrect) return 'border-green-500'
              if (isSelected && !isCorrect) return 'border-red-500'
              return 'border-border opacity-70'
            }
            if (isSelected) return 'border-blue-500'
            return 'border-border'
          }

          const getDotStyle = () => {
            if (isCompleted) {
              if (isCorrect) return 'bg-green-500'
              if (isSelected && !isCorrect) return 'bg-red-500'
              return 'bg-[var(--text-tertiary)]'
            }
            if (isSelected) return 'bg-blue-500'
            return 'bg-main'
          }

          return (
            <Button
              key={index}
              type="button"
              variant={getVariant(index)}
              className={`w-full justify-start h-auto py-4 whitespace-normal ${getClassName(index)}`}
              onClick={() => {
                if (isCompleted) return
                onAnswerChange?.([index])
              }}
              disabled={isCompleted}
            >
              <span
                className={`size-4 shrink-0 rounded-full border-2 bg-background inline-flex items-center justify-center ${getRadioStyle()}`}
                aria-hidden="true"
              >
                {isSelected && <span className={`size-2 rounded-full ${getDotStyle()}`} />}
              </span>
              <span className="flex-1">{option.content}</span>
            </Button>
          )
        })
      )}
    </div>
  )
}

/**
 * Render options for True/False questions
 */
function RenderTrueFalseOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: number[]) => void
}) {
  const storeAnswer = useChallengeStore((s) => s.getAnswer(question.id))
  const answer = question.answer || storeAnswer
  const selectedIndex = answer?.selectedOptionIndexes?.[0]
  const currentAttempt = useChallengeStore((s) => s.currentAttempt)
  const isCompleted = currentAttempt?.status === 'Completed'

  const handleChange = (index: number) => {
    if (isCompleted) return
    onAnswerChange?.([index])
  }

  // For TrueFalse, index 0 = True (Đúng), index 1 = False (Sai)
  // The correct answer is determined by the options from the API
  const getCorrectIndex = () => {
    const correctOption = question.options?.findIndex(o => o.isCorrect)
    return correctOption ?? -1
  }

  const getVariant = (index: number) => (selectedIndex === index ? 'default' : 'outline')

  const getClassName = (index: number) => {
    const isSelected = selectedIndex === index
    const correctIndex = getCorrectIndex()
    const isCorrect = index === correctIndex

    if (!isCompleted) return ''

    if (isCorrect) return 'bg-green-50 text-green-700'
    if (isSelected && !isCorrect) return 'bg-red-50 text-red-700'
    return 'opacity-70'
  }

  return (
    <div className="space-y-3">
      {['Đúng', 'Sai'].map((label, index) => {
        const correctIndex = getCorrectIndex()
        const isCorrect = index === correctIndex
        const isSelected = selectedIndex === index

        const getRadioStyle = () => {
          if (isCompleted) {
            if (isCorrect) return 'border-green-500'
            if (isSelected && !isCorrect) return 'border-red-500'
            return 'border-[var(--border)] opacity-60'
          }
          if (isSelected) return 'border-blue-500'
          return 'border-[var(--border)]'
        }

        const getDotStyle = () => {
          if (isCompleted) {
            if (isCorrect) return 'bg-green-500'
            if (isSelected && !isCorrect) return 'bg-red-500'
            return 'bg-[var(--text-tertiary)]'
          }
          if (isSelected) return 'bg-blue-500'
          return 'bg-main'
        }

        return (
          <Button
            key={index}
            type="button"
            variant={getVariant(index)}
            className={`w-full justify-start h-auto py-4 whitespace-normal ${getClassName(index)}`}
            onClick={() => handleChange(index)}
            disabled={isCompleted}
          >
            <span
              className={`size-4 shrink-0 rounded-full border-2 bg-background inline-flex items-center justify-center ${getRadioStyle()}`}
              aria-hidden="true"
            >
              {isSelected && <span className={`size-2 rounded-full ${getDotStyle()}`} />}
            </span>
            <span className="flex-1">{label}</span>
            {isCompleted && isCorrect && (
              <span className="text-green-600 text-sm font-medium">✓ Đúng</span>
            )}
            {isCompleted && isSelected && !isCorrect && (
              <span className="text-red-600 text-sm font-medium">✗ Sai</span>
            )}
          </Button>
        )
      })}
    </div>
  )
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
        className={`p-4 transition-colors ${
          isCompleted
            ? matchStatus?.isCorrect
              ? 'bg-green-50 border-green-500'
              : matchStatus?.isIncorrect
                ? 'bg-red-50 border-red-500'
                : 'opacity-70'
            : isMatched
              ? 'bg-blue-50 border-blue-300'
              : 'hover:bg-[var(--bg-surface-secondary)]'
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
          <span className="flex-1 text-sm font-medium text-[var(--text-primary)]">{content}</span>
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
function RenderMatchingOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: Array<{ leftContent: string; rightContent: string }>) => void
}) {
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
    console.log('RenderMatchingOptions - initialMatches:', initialMatches, 'answer:', answer, 'matchingPairs:', matchingPairs)
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

  const isLeftItemMatched = (leftIndex: number) => {
    return matches.has(leftIndex)
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
      <div className="text-sm text-[var(--text-secondary)] mb-2">
        Kéo từ tay cầm bên trái đến tay cầm bên phải để tạo kết nối:
      </div>
      
      <div style={{ width: '100%', height: `${Math.max(matchingPairs.length * 140, 450)}px`, backgroundColor: 'var(--bg-primary)' }} className="border-2 border-[var(--border)] rounded-lg overflow-hidden">
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
        <div className="text-sm text-[var(--text-secondary)] text-center py-2">
          Đã ghép {matches.size}/{matchingPairs.length} cặp
        </div>
      )}
    </div>
  )
}

/**
 * Render options for Ordering questions: horizontal drag and drop items
 */
function RenderOrderingOptions({
  question,
  onAnswerChange,
}: {
  question: ChallengeQuestionDto
  onAnswerChange?: (answer: Array<{ content: string; position: number }>) => void
}) {
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
        <div className="text-sm text-[var(--text-secondary)] mb-4">
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
            <p className="text-sm font-medium text-[var(--text-primary)]">
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
        className={`p-4 cursor-grab active:cursor-grabbing min-w-[120px] transition-colors ${
          isCompleted
            ? status?.isCorrect
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
            : isDragging
              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500'
              : 'bg-[var(--bg-surface-secondary)] border-[var(--border)] hover:bg-[var(--bg-surface)]'
        }`}
      >
        {/* Content */}
        <div className="text-center">
          <p
            className={`text-sm font-medium ${
              isCompleted
                ? status?.isCorrect
                  ? 'text-green-700'
                  : 'text-red-700'
                : 'text-[var(--text-primary)]'
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

/**
 * Custom Audio Player Component with beautiful UI
 */
function AudioPlayer({ src, startTime = 0 }: { src: string; startTime?: number }) {
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const audio = new Audio(src)
    setAudioRef(audio)

    // Set start time if provided
    if (startTime > 0) {
      audio.currentTime = startTime
      setCurrentTime(startTime)
    }

    // Event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    // Set volume
    audio.volume = volume
    audio.muted = isMuted

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.pause()
      audio.src = ''
    }
  }, [src, startTime])

  useEffect(() => {
    if (audioRef) {
      audioRef.volume = volume
      audioRef.muted = isMuted
    }
  }, [audioRef, volume, isMuted])

  const togglePlayPause = () => {
    if (!audioRef) return

    if (isPlaying) {
      audioRef.pause()
    } else {
      audioRef.play().catch((error) => {
        console.error('Error playing audio:', error)
      })
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = percentage * duration

    audioRef.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newVolume = Math.max(0, Math.min(1, x / rect.width))

    setVolume(newVolume)
    audioRef.volume = newVolume
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (!audioRef) return
    setIsMuted(!isMuted)
    audioRef.muted = !isMuted
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
  const volumePercentage = volume * 100

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl border border-purple-200 dark:border-purple-800 p-6 shadow-lg">
      <div className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <Button
            type="button"
            variant="default"
            size="icon"
            className="size-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all"
            onClick={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="size-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="size-6 text-white" fill="white" />
            ) : (
              <Play className="size-6 text-white ml-0.5" fill="white" />
            )}
          </Button>

          {/* Progress Bar */}
          <div className="flex-1 space-y-2">
            <div
              className="relative h-2 bg-white/50 dark:bg-white/10 rounded-full cursor-pointer overflow-hidden group"
              onClick={handleSeek}
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 w-4 h-4 bg-white rounded-full shadow-md transform -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-secondary)]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-10"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="size-5" />
              ) : (
                <Volume2 className="size-5" />
              )}
            </Button>
            <div
              className="relative w-20 h-2 bg-white/50 dark:bg-white/10 rounded-full cursor-pointer overflow-hidden group"
              onClick={handleVolumeChange}
            >
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${volumePercentage}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 w-3 h-3 bg-white rounded-full shadow-md transform -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${volumePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Waveform Visualization (Animated) */}
        <div className="flex items-center justify-center gap-1 h-12">
          {Array.from({ length: 40 }).map((_, i) => {
            // Create a pattern based on index and current time for consistent animation
            const waveValue = Math.sin((i * 0.3 + currentTime * 2) * Math.PI)
            const baseHeight = isPlaying ? 30 + waveValue * 40 : 20
            const opacity = isPlaying ? 0.7 + Math.abs(waveValue) * 0.3 : 0.3
            
            return (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-400 to-blue-400 rounded-full transition-all duration-150"
                style={{
                  height: `${Math.max(20, baseHeight)}%`,
                  opacity,
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
