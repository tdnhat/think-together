import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-border-main)] px-4 py-1 text-xs font-semibold uppercase tracking-wide shadow-[4px_4px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--bg-surface)] text-[var(--text-primary)]",
        brand:
          "bg-[var(--brand-primary)] text-white",
        secondary:
          "bg-[var(--brand-secondary)] text-[var(--text-primary)]",
        outline:
          "bg-white text-[var(--text-primary)]",
      },
      size: {
        default: "px-4 py-1",
        sm: "px-3 py-0.5 text-[0.7rem]",
        lg: "px-5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }

