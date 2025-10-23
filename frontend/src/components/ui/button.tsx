import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-lg text-base font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 border-2 border-[var(--color-border-main)] shadow-[4px_4px_0_var(--color-border-main)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--color-border-main)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-secondary)] text-[var(--text-primary)] hover:bg-[var(--brand-secondary-hover)] focus-visible:ring-[var(--brand-secondary)]/40",
        destructive:
          "bg-[var(--color-error)] text-white hover:bg-[var(--color-error-hover)] focus-visible:ring-[var(--color-error)]/30",
        outline:
          "bg-white text-[var(--text-primary)] hover:bg-[var(--bg-surface)]",
        secondary:
          "bg-[var(--brand-primary)] text-white hover:bg-[#0090C8]",
        ghost:
          "border-transparent bg-transparent text-[var(--text-primary)] shadow-none hover:bg-[var(--bg-surface)] hover:shadow-[3px_3px_0_var(--color-border-main)]",
        link: "border-none shadow-none px-0 py-0 text-[var(--brand-primary)] underline-offset-4 hover:underline hover:-translate-y-0 hover:shadow-none active:translate-x-0 active:translate-y-0 focus-visible:ring-0 focus-visible:ring-offset-0",
      },
      size: {
        default: "px-5 py-2 has-[>svg]:px-4",
        sm: "px-4 py-1.5 text-sm gap-1.5 has-[>svg]:px-3.5",
        lg: "px-6 py-3 text-lg has-[>svg]:px-5",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-10 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
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
