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
        'h-auto rounded-base px-2 py-1 text-xs font-base uppercase tracking-wide text-main-foreground',
        'transition-transform',
        className,
      )}
      {...props}
    >
      {show ? 'Ẩn' : 'Hiển thị'}
    </Button>
  )
}

