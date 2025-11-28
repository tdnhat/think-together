import { forwardRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { cn } from '@/lib/utils'

type AuthFieldProps = Readonly<
  InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  helperText?: string
  trailingSlot?: ReactNode
  }
>

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ id, label, error, helperText, className, trailingSlot, ...props }, ref) => {
    const inputId = id ?? props.name

    return (
      <div className="space-y-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <div className="relative">
          <Input
            id={inputId}
            ref={ref}
            className={cn(trailingSlot ? 'pr-12' : null, className)}
            {...props}
          />
          {trailingSlot ? (
            <div className="absolute inset-y-0 right-3 flex items-center">{trailingSlot}</div>
          ) : null}
        </div>
        {helperText ? (
          <span className="mt-2 block text-xs text-foreground/60">{helperText}</span>
        ) : null}
        {error ? (
          <span className="mt-2 block text-sm font-base text-[var(--color-error)]">{error}</span>
        ) : null}
      </div>
    )
  },
)

AuthField.displayName = 'AuthField'

