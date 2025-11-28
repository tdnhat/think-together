import { Fragment } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  steps: string[]
  currentStepIndex: number
}

export function ProgressIndicator({ steps, currentStepIndex }: Readonly<ProgressIndicatorProps>) {
  return (
    <div className="mb-8 flex w-full items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = currentStepIndex > index
        const isCurrent = currentStepIndex === index
        const isActive = isCompleted || isCurrent

        return (
          <Fragment key={step}>
            {/* Step Circle */}
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                isActive
                  ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white shadow-brutal-sm"
                  : "border-[var(--color-border-main)] bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-brutal-sm"
              )}
            >
              {isCompleted ? (
                <Check className="h-6 w-6" strokeWidth={3} />
              ) : (
                <span className="font-bold text-lg">{index + 1}</span>
              )}
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-1">
                <div
                  className={cn(
                    "w-full h-[4px] transition-all duration-300 border-y border-[var(--color-border-main)]",
                    isCompleted
                      ? "bg-[var(--brand-primary)]"
                      : "bg-[var(--bg-surface-secondary)]"
                  )}
                />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
