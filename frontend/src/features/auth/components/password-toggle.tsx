import type { ButtonHTMLAttributes } from 'react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'

type PasswordToggleProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    show: boolean
    onToggle: () => void
  }
>

export function PasswordToggle({ show, onToggle, className, ...props }: PasswordToggleProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="default"
      onClick={onToggle}
      className={cn(
        'h-auto rounded-lg border-2 border-[var(--color-border-main)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)] shadow-brutal-sm hover:shadow-brutal-sm',
        'transition-transform',
        className,
      )}
      {...props}
    >
      {show ? 'Ẩn' : 'Hiển thị'}
    </Button>
  )
}

