import Image from 'next/image'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
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
      variant="outline"
      className={cn(
        buttonVariants({ size: 'lg' }),
        'w-full justify-start gap-4 bg-white text-left text-[var(--text-primary)]',
        className,
      )}
      {...props}
    >
      <span className="flex size-9 items-center justify-center rounded-xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] shadow-[3px_3px_0_var(--color-border-main)]">
        {iconSrc ? <Image src={iconSrc} alt={label} width={20} height={20} /> : icon}
      </span>
      <span className="flex flex-1 flex-col text-left">
        <span className="text-base font-semibold">{label}</span>
        {description ? (
          <span className="text-xs text-[var(--text-secondary)]">{description}</span>
        ) : null}
      </span>
    </Button>
  )
}
