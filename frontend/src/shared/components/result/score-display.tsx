'use client'

import { cn } from '@/lib/utils'

interface ScoreDisplayProps {
  score: number
  label?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'green' | 'blue' | 'yellow' | 'red'
  className?: string
  animate?: boolean
}

const sizeClasses = {
  sm: 'text-3xl md:text-4xl',
  md: 'text-4xl md:text-5xl',
  lg: 'text-5xl md:text-6xl',
  xl: 'text-6xl md:text-7xl',
}

const colorClasses = {
  primary: 'text-primary',
  green: 'text-green-600 dark:text-green-500',
  blue: 'text-blue-600 dark:text-blue-500',
  yellow: 'text-yellow-600 dark:text-yellow-500',
  red: 'text-red-600 dark:text-red-500',
}

export function ScoreDisplay({
  score,
  label = 'Tổng điểm',
  size = 'lg',
  color = 'primary',
  className = '',
  animate = true,
}: ScoreDisplayProps) {
  return (
    <div className={cn('text-center space-y-2', className)}>
      <div
        className={cn(
          'font-heading font-bold',
          sizeClasses[size],
          colorClasses[color],
          animate && 'animate-in fade-in zoom-in duration-700'
        )}
      >
        {score.toLocaleString('vi-VN')}
      </div>
      {label && (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      )}
    </div>
  )
}

