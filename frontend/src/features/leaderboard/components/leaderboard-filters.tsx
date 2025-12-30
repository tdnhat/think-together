'use client'

import { Button } from '@/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import {
  TIME_PERIOD_LABELS,
  SORT_OPTION_LABELS,
  LEADERBOARD_CONSTANTS,
} from '../constants'
import type { LeaderboardFilters } from '../types'
import type { ClassDto, HomeworkDto } from '@/features/class/types'

interface LeaderboardFiltersProps {
  filters: LeaderboardFilters
  onFiltersChange: (filters: LeaderboardFilters) => void
  showQuizSetFilter?: boolean
  quizSetSelector?: React.ReactNode
  classes?: ClassDto[]
  homeworks?: HomeworkDto[]
  className?: string
}

export function LeaderboardFilters({
  filters,
  onFiltersChange,
  showQuizSetFilter = false,
  quizSetSelector,
  classes = [],
  homeworks = [],
  className = '',
}: LeaderboardFiltersProps) {
  const handleTimePeriodChange = (timePeriod: LeaderboardFilters['timePeriod']) => {
    onFiltersChange({ ...filters, timePeriod })
  }

  const handleSortChange = (sortBy: LeaderboardFilters['sortBy']) => {
    onFiltersChange({ ...filters, sortBy })
  }

  const handleSortOrderToggle = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
    })
  }

  const handleHomeworkTypeChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, isHomework: undefined, classId: undefined, homeworkId: undefined })
    } else if (value === 'homework') {
      onFiltersChange({ ...filters, isHomework: true, homeworkId: undefined })
    } else if (value === 'public') {
      onFiltersChange({ ...filters, isHomework: false, classId: undefined, homeworkId: undefined })
    }
  }

  const handleClassChange = (classId: string) => {
    if (classId === 'all') {
      onFiltersChange({ ...filters, classId: undefined, homeworkId: undefined })
    } else {
      onFiltersChange({ ...filters, classId, homeworkId: undefined })
    }
  }

  const handleHomeworkChange = (homeworkId: string) => {
    if (homeworkId === 'all') {
      onFiltersChange({ ...filters, homeworkId: undefined })
    } else {
      onFiltersChange({ ...filters, homeworkId })
    }
  }

  // Filter homeworks by selected class
  const filteredHomeworks = filters.classId
    ? homeworks.filter(h => h.classId === filters.classId)
    : homeworks

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quiz Set Selector */}
      {quizSetSelector && (
        <div className="flex items-center gap-2">
          {quizSetSelector}
        </div>
      )}

      {/* Homework/Class Filters */}
      {(classes.length > 0 || homeworks.length > 0) && (
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm font-semibold text-[var(--text-secondary)]">
            Loại:
          </span>
          <Select
            value={
              filters.isHomework === undefined
                ? 'all'
                : filters.isHomework
                  ? 'homework'
                  : 'public'
            }
            onValueChange={handleHomeworkTypeChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="public">Thử thách công khai</SelectItem>
              <SelectItem value="homework">Bài tập về nhà</SelectItem>
            </SelectContent>
          </Select>

          {filters.isHomework && classes.length > 0 && (
            <>
              <Select
                value={filters.classId || 'all'}
                onValueChange={handleClassChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filters.classId && filteredHomeworks.length > 0 && (
                <Select
                  value={filters.homeworkId || 'all'}
                  onValueChange={handleHomeworkChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Chọn bài tập" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả bài tập</SelectItem>
                    {filteredHomeworks.map((hw) => (
                      <SelectItem key={hw.id} value={hw.id}>
                        {hw.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </>
          )}
        </div>
      )}

      {/* Time Period and Sort Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Time Period Filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-[var(--text-secondary)] self-center">
            Thời gian:
          </span>
          {Object.entries(TIME_PERIOD_LABELS).map(([value, label]) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={filters.timePeriod === value ? 'default' : 'outline'}
              onClick={() =>
                handleTimePeriodChange(value as LeaderboardFilters['timePeriod'])
              }
              className="rounded-full"
            >
              {label}
            </Button>
          ))}
        </div>

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-semibold text-[var(--text-secondary)] self-center">
          Sắp xếp:
        </span>
        {Object.entries(SORT_OPTION_LABELS).map(([value, label]) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={filters.sortBy === value ? 'default' : 'outline'}
            onClick={() =>
              handleSortChange(value as LeaderboardFilters['sortBy'])
            }
            className="rounded-full"
          >
            {label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleSortOrderToggle}
          className="rounded-full"
        >
          {filters.sortOrder === 'asc' ? '↑ Tăng dần' : '↓ Giảm dần'}
        </Button>
      </div>
      </div>
    </div>
  )
}
