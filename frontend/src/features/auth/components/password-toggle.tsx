import type { ButtonHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

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
      size="icon-sm"
      variant="ghost"
      onClick={onToggle}
      className={cn("h-7 w-7", className)}
      tabIndex={-1}
      {...props}
    >
      {show ? (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Eye className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">{show ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}</span>
    </Button>
  )
}

