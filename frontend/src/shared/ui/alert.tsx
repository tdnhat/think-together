import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-xl border-2 border-[var(--color-border-main)] p-5 transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--bg-surface-secondary)] text-[var(--text-primary)] shadow-brutal-xs",
        info: "bg-[var(--accent-cyan-light)] text-[var(--text-primary)] shadow-brutal-cyan",
        success:
          "bg-[var(--accent-green-light)] text-[var(--text-primary)] shadow-brutal-green",
        warning:
          "bg-[var(--brand-secondary-light)] text-[var(--text-primary)] shadow-brutal-secondary",
        destructive:
          "bg-red-50 text-[var(--color-error)] shadow-[6px_6px_0_var(--color-error)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  const Icon = {
    default: Info,
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    destructive: XCircle,
  }[variant || "default"]

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="absolute left-5 top-5 h-5 w-5" strokeWidth={3} />
      <div className="pl-8">{props.children}</div>
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 font-bold text-lg tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-medium leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

