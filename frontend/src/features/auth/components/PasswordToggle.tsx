import type { ButtonHTMLAttributes } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PasswordToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  show: boolean
  onToggle: () => void
}

export function PasswordToggle({
  show,
  onToggle,
  className,
  ...props
}: PasswordToggleProps) {
  return (
    <Button
      type="button"
      size="sm"
      variant="default"
      onClick={onToggle}
      className={cn(
        "h-auto rounded-lg border-2 border-[var(--color-border-main)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)] shadow-[2px_2px_0_var(--color-border-main)] hover:shadow-[2px_2px_0_var(--color-border-main)]",
        "transition-transform",
        className
      )}
      {...props}
    >
      {show ? "Ẩn" : "Hiển thị"}
    </Button>
  )
}

