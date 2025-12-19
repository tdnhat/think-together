'use client'

import { Button } from '@/shared/ui/button'
import {
  TIME_PERIOD_LABELS,
  SORT_OPTION_LABELS,
  LEADERBOARD_CONSTANTS,
} from '../constants'
import type { LeaderboardFilters } from '../types'

interface LeaderboardFiltersProps {
  filters: LeaderboardFilters
  onFiltersChange: (filters: LeaderboardFilters) => void
  showQuizSetFilter?: boolean
  quizSetSelector?: React.ReactNode
  className?: string
}

export function LeaderboardFilters({
  filters,
  onFiltersChange,
  showQuizSetFilter = false,
  quizSetSelector,
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quiz Set Selector */}
      {quizSetSelector && (
        <div className="flex items-center gap-2">
          {quizSetSelector}
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
              variant={filters.timePeriod === value ? 'default' : 'neutral'}
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
            variant={filters.sortBy === value ? 'default' : 'neutral'}
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
          variant="neutral"
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
