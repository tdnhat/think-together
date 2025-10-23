import type { ButtonHTMLAttributes } from "react"

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
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-lg border-2 border-[var(--color-border-main)] bg-[var(--brand-secondary)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-primary)] shadow-[2px_2px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {show ? "Ẩn" : "Hiển thị"}
    </button>
  )
}

