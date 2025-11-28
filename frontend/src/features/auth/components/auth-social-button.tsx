import Image from 'next/image'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/lib/utils'

type AuthSocialButtonProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    icon?: ReactNode
    iconSrc?: string
    label: string
    description?: string
  }
>

export function AuthSocialButton({
  icon,
  iconSrc,
  label,
  description,
  className,
  ...props
}: AuthSocialButtonProps) {
  return (
    <Button
      type="button"
      variant="neutral"
      size="lg"
      className={cn(
        'w-full justify-start gap-4',
        className,
      )}
      {...props}
    >
      <span className="flex size-10 items-center justify-center rounded-base base-border bg-secondary-background shadow-brutal-primary-xs">
        {iconSrc ? <Image src={iconSrc} alt={label} width={22} height={22} /> : icon}
      </span>
      <span className="flex flex-1 flex-col text-left">
        <span className="text-base font-base">{label}</span>
        {description ? (
          <span className="text-xs text-foreground/70">{description}</span>
        ) : null}
      </span>
    </Button>
  )
}

