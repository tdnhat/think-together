import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-xl text-base font-bold disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 border-2 border-[var(--color-border-main)] btn-press-effect focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-secondary)] text-[var(--text-primary)] hover:bg-[var(--brand-secondary-hover)]",
        primary:
          "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)]",
        destructive:
          "bg-[var(--color-error)] text-white hover:bg-[var(--color-error-hover)]",
        success:
          "bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green-hover)]",
        outline:
          "bg-[var(--bg-surface)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-secondary)]",
        secondary:
          "bg-[var(--accent-cyan)] text-white hover:bg-[var(--accent-cyan-hover)]",
        pink:
          "bg-[var(--accent-pink)] text-white hover:bg-[var(--accent-pink-hover)]",
        purple:
          "bg-[var(--accent-purple)] text-white hover:bg-[var(--accent-purple-hover)]",
        ghost:
          "border-transparent bg-transparent text-[var(--text-primary)] !shadow-none !transform-none hover:bg-[var(--bg-surface-secondary)] hover:border-[var(--color-border-main)] hover:!shadow-brutal-xs hover:!translate-x-0 hover:!translate-y-0 active:!translate-x-0 active:!translate-y-0",
        link: "border-none !shadow-none px-0 py-0 text-[var(--brand-primary)] underline-offset-4 hover:underline hover:text-[var(--brand-primary-hover)] hover:!translate-x-0 hover:!translate-y-0 active:!translate-x-0 active:!translate-y-0 focus-visible:ring-0 focus-visible:ring-offset-0 !transform-none",
      },
      size: {
        default: "px-6 py-2.5 text-base has-[>svg]:px-5",
        sm: "px-4 py-2 text-sm gap-1.5 has-[>svg]:px-3.5",
        lg: "px-8 py-3.5 text-lg has-[>svg]:px-7",
        xl: "px-10 py-4 text-xl has-[>svg]:px-9",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
