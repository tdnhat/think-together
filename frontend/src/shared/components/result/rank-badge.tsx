'use client'

import { Trophy, Medal } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/lib/utils'

interface RankBadgeProps {
  rank: number
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

const getRankColor = (rank: number) => {
  if (rank === 1) {
    return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
  }
  if (rank === 2) {
    return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
  }
  if (rank === 3) {
    return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
  }
  return 'bg-primary/10 text-primary border-primary/30'
}

const getRankIcon = (rank: number, size: 'sm' | 'md' | 'lg' = 'md') => {
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
  
  switch (rank) {
    case 1:
      return <Trophy className={cn(iconSize, 'text-yellow-500')} />
    case 2:
      return <Medal className={cn(iconSize, 'text-gray-400')} />
    case 3:
      return <Medal className={cn(iconSize, 'text-amber-600')} />
    default:
      return null
  }
}

export function RankBadge({
  rank,
  showIcon = true,
  size = 'md',
  className = '',
}: RankBadgeProps) {
  const icon = showIcon ? getRankIcon(rank, size) : null

  return (
    <div className="flex items-center gap-2">
      {icon}
      <Badge
        variant="default"
        className={cn(
          sizeClasses[size],
          getRankColor(rank),
          'border font-semibold',
          className
        )}
      >
        Xếp hạng #{rank}
      </Badge>
    </div>
  )
}

