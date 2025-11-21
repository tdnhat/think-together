import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] px-5 py-3 text-base text-[var(--text-primary)] shadow-brutal-xs placeholder:text-[var(--text-tertiary)] transition-all focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:translate-x-[1px] focus-visible:translate-y-[1px] focus-visible:shadow-none disabled:cursor-not-allowed disabled:bg-[var(--bg-surface-secondary)] disabled:opacity-50 disabled:text-[var(--text-tertiary)]",
        "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-[var(--brand-primary)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
