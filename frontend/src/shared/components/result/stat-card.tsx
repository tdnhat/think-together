'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ReactNode
  value: string | number
  label: string
  color?: 'green' | 'red' | 'blue' | 'purple' | 'yellow'
  className?: string
  animate?: boolean
}

const colorClasses = {
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-500',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-500',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-500',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-500',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-500',
  },
}

export function StatCard({
  icon,
  value,
  label,
  color = 'blue',
  className = '',
  animate = true,
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow',
        colors.bg,
        colors.border,
        animate && 'animate-in fade-in slide-in-from-bottom-4 duration-500',
        className
      )}
    >
      <div className={cn('p-3 rounded-full', colors.iconBg)}>
        <div className={cn('h-7 w-7', colors.text)}>{icon}</div>
      </div>
      <div className="text-center">
        <p className={cn('text-3xl font-heading font-bold', colors.text)}>
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </p>
        <p className="text-xs font-medium text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  )
}

