import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Input } from '@/shared/ui/input'
import { cn } from '@/lib/utils'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean
}

/**
 * Form input with integrated error state handling
 * Uses aria-invalid for accessibility and styling
 */
export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, className, ...props }, ref) => {
    const hasError = !!error

    return (
      <div className="space-y-1.5">
        <Input
          ref={ref}
          aria-invalid={hasError}
          className={cn(
            hasError && 'border-destructive',
            className
          )}
          {...props}
        />
        {error && typeof error === 'string' && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
