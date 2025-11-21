import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-border-main)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-brutal-xs transition-all hover:-translate-y-0.5 hover:shadow-brutal-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--bg-surface-secondary)] text-[var(--text-primary)]",
        primary:
          "bg-[var(--brand-primary)] text-white",
        secondary:
          "bg-[var(--brand-secondary)] text-[var(--text-primary)]",
        pink:
          "bg-[var(--accent-pink)] text-white",
        cyan:
          "bg-[var(--accent-cyan)] text-white",
        green:
          "bg-[var(--accent-green)] text-white",
        purple:
          "bg-[var(--accent-purple)] text-white",
        orange:
          "bg-[var(--accent-orange)] text-white",
        outline:
          "bg-[var(--bg-surface)] text-[var(--text-primary)]",
      },
      size: {
        default: "px-4 py-1.5 text-xs",
        sm: "px-3 py-1 text-[0.65rem]",
        lg: "px-5 py-2 text-sm",
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

