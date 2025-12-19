'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, Trophy, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'
import { LEADERBOARD_HEADERS } from '../constants'
import type { LeaderboardEntryDto } from '../types'

interface LeaderboardTableProps {
  entries: LeaderboardEntryDto[]
  showQuizSet?: boolean
  className?: string
}

const formatTime = (ms?: number) => {
  if (!ms) return '-'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const calculateAccuracy = (correct: number, total: number) => {
  if (total === 0) return '0%'
  return `${Math.round((correct / total) * 100)}%`
}

const getRankIcon = (rank: number) => {
  if (rank === 1) {
    return <Trophy className="h-4 w-4 text-yellow-500" />
  }
  if (rank === 2) {
    return <Trophy className="h-4 w-4 text-gray-400" />
  }
  if (rank === 3) {
    return <Trophy className="h-4 w-4 text-orange-600" />
  }
  return null
}

const getColumnLabel = (columnId: string): string => {
  const columnLabelMap: Record<string, string> = {
    rank: LEADERBOARD_HEADERS.RANK,
    nickname: LEADERBOARD_HEADERS.NICKNAME,
    quizSetTitle: LEADERBOARD_HEADERS.QUIZ_SET,
    score: LEADERBOARD_HEADERS.SCORE,
    correctAnswers: LEADERBOARD_HEADERS.CORRECT_ANSWERS,
    accuracy: LEADERBOARD_HEADERS.ACCURACY,
    completionTimeMs: LEADERBOARD_HEADERS.TIME,
    completedAt: LEADERBOARD_HEADERS.COMPLETED_AT,
  }
  return columnLabelMap[columnId] || columnId
}

export function LeaderboardTable({
  entries,
  showQuizSet = false,
  className = '',
}: LeaderboardTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const columns = React.useMemo<ColumnDef<LeaderboardEntryDto>[]>(
    () => [
      {
        accessorKey: 'rank',
        header: ({ column }) => {
          return (
            <Button
              variant="noShadow"
              size="sm"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto px-2 py-1 font-heading"
            >
              {LEADERBOARD_HEADERS.RANK}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const rank = row.getValue('rank') as number
          return (
            <div className="flex items-center gap-2">
              {getRankIcon(rank)}
              <span className="font-semibold">{rank}</span>
            </div>
          )
        },
        sortingFn: (rowA, rowB) => {
          const rankA = rowA.getValue('rank') as number
          const rankB = rowB.getValue('rank') as number
          return rankA - rankB
        },
      },
      {
        accessorKey: 'nickname',
        header: ({ column }) => {
          return (
            <Button
              variant="noShadow"
              size="sm"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="h-auto px-2 py-1 font-heading"
            >
              {LEADERBOARD_HEADERS.NICKNAME}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const entry = row.original
          return (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--text-primary)]">
                  {entry.nickname}
                </span>
                {entry.isHomework && (
                  <Badge
                    variant="default"
                    className="bg-purple-100 text-purple-700 text-xs"
                  >
                    Bài tập
                  </Badge>
                )}
                {entry.submissionStatus === 'Late' && (
                  <Badge
                    variant="neutral"
                    className="bg-yellow-100 text-yellow-700 text-xs border-yellow-300"
                  >
                    Muộn
                  </Badge>
                )}
              </div>
              {entry.isHomework && entry.className && (
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {entry.className}
                  {entry.homeworkTitle && ` • ${entry.homeworkTitle}`}
                </div>
              )}
            </div>
          )
        },
      },
      ...(showQuizSet
        ? [
            {
              accessorKey: 'quizSetTitle',
              header: LEADERBOARD_HEADERS.QUIZ_SET,
              cell: ({ row }) => {
                const title = row.getValue('quizSetTitle') as string | undefined
                return (
                  <span className="text-sm text-[var(--text-secondary)]">
                    {title || '-'}
                  </span>
                )
              },
            } as ColumnDef<LeaderboardEntryDto>,
          ]
        : []),
      {
        accessorKey: 'score',
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="noShadow"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="h-auto px-2 py-1 font-heading"
              >
                {LEADERBOARD_HEADERS.SCORE}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => {
          const score = row.getValue('score') as number
          return (
            <div className="text-center font-bold text-blue-600">{score}</div>
          )
        },
      },
      {
        accessorKey: 'correctAnswers',
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="noShadow"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="h-auto px-2 py-1 font-heading"
              >
                {LEADERBOARD_HEADERS.CORRECT_ANSWERS}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => {
          const entry = row.original
          return (
            <div className="text-center">
              {entry.correctAnswers}/{entry.totalQuestions}
            </div>
          )
        },
      },
      {
        id: 'accuracy',
        accessorFn: (row) => {
          return row.totalQuestions > 0
            ? row.correctAnswers / row.totalQuestions
            : 0
        },
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="noShadow"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="h-auto px-2 py-1 font-heading"
              >
                {LEADERBOARD_HEADERS.ACCURACY}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => {
          const entry = row.original
          return (
            <div className="text-center">
              {calculateAccuracy(entry.correctAnswers, entry.totalQuestions)}
            </div>
          )
        },
      },
      {
        accessorKey: 'completionTimeMs',
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="noShadow"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="h-auto px-2 py-1 font-heading"
              >
                {LEADERBOARD_HEADERS.TIME}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => {
          const time = row.getValue('completionTimeMs') as number | undefined
          return (
            <div className="text-center text-sm">{formatTime(time)}</div>
          )
        },
      },
      {
        accessorKey: 'completedAt',
        header: ({ column }) => {
          return (
            <div className="text-center">
              <Button
                variant="noShadow"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="h-auto px-2 py-1 font-heading"
              >
                {LEADERBOARD_HEADERS.COMPLETED_AT}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => {
          const date = row.getValue('completedAt') as string
          return (
            <div className="text-center text-xs text-[var(--text-secondary)]">
              {formatDate(date)}
            </div>
          )
        },
      },
    ],
    [showQuizSet],
  )

  const table = useReactTable({
    data: entries,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  })

  if (!entries || entries.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--text-secondary)]">
            Chưa có dữ liệu xếp hạng
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block w-full font-base text-main-foreground">
        <div className="flex items-center py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="noShadow" className="ml-auto">
                Cột <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {getColumnLabel(column.id)}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Table>
            <TableHeader className="font-heading">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  className="bg-secondary-background text-foreground"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="text-foreground" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="bg-secondary-background text-foreground data-[state=selected]:bg-main data-[state=selected]:text-main-foreground hover:bg-[var(--bg-surface-secondary)] transition-colors"
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="px-4 py-2" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có kết quả.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => (
          <Card key={entry.attemptId} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">
                      #{entry.rank}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {entry.nickname}
                    </p>
                    {entry.isHomework && entry.className && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        {entry.className}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="default" className="bg-blue-100 text-blue-700">
                    {entry.score} điểm
                  </Badge>
                  {entry.isHomework && (
                    <Badge
                      variant="default"
                      className="bg-purple-100 text-purple-700 text-xs"
                    >
                      Bài tập
                    </Badge>
                  )}
                  {entry.submissionStatus === 'Late' && (
                    <Badge
                      variant="neutral"
                      className="bg-yellow-100 text-yellow-700 text-xs"
                    >
                      Muộn
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {showQuizSet && entry.quizSetTitle && (
                  <div className="col-span-2">
                    <p className="text-[var(--text-secondary)] text-xs">
                      Bộ câu hỏi
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {entry.quizSetTitle}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[var(--text-secondary)] text-xs">
                    Câu đúng
                  </p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {entry.correctAnswers}/{entry.totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-secondary)] text-xs">
                    Độ chính xác
                  </p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {calculateAccuracy(entry.correctAnswers, entry.totalQuestions)}
                  </p>
                </div>
                {entry.completionTimeMs && (
                  <div>
                    <p className="text-[var(--text-secondary)] text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Thời gian
                    </p>
                    <p className="font-semibold text-[var(--text-primary)]">
                      {formatTime(entry.completionTimeMs)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[var(--text-secondary)] text-xs">
                    Hoàn thành
                  </p>
                  <p className="font-semibold text-[var(--text-primary)] text-xs">
                    {formatDate(entry.completedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
