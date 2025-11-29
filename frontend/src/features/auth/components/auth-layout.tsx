'use client'

import Link from 'next/link'
import type { PropsWithChildren, ReactNode } from 'react'
import { motion } from 'framer-motion'

import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { cn } from '@/lib/utils'
import { AUTH_LEGAL_TEXT, FLOATING_STATIONERY_ITEMS } from '../constants'

export type AuthLayoutProps = Readonly<
  PropsWithChildren<{
    title: string
    subtitle?: string
    switchLabel: string
    switchText: string
    switchHref: string
    badge?: ReactNode
    legalText?: string
    sideContent?: ReactNode
    className?: string
  }>
>

export function AuthLayout({
  children,
  title,
  switchLabel,
  switchText,
  switchHref,
  badge,
  legalText = AUTH_LEGAL_TEXT,
  sideContent,
  className,
}: AuthLayoutProps) {
  const hasSideContent = Boolean(sideContent)
  const normalizedBadge =
    typeof badge === 'string' ? (
      <Badge variant="neutral">
        {badge}
      </Badge>
    ) : (
      badge
    )

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground/70">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_10%,var(--brand-primary-light),transparent)] opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_75%,var(--brand-secondary-light),transparent)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_80%,var(--brand-primary-light),transparent)] opacity-40" />
      </div>

      <FloatingStationery />

      <div className={cn('relative z-10 mx-auto flex w-full flex-col items-center gap-6', hasSideContent ? 'max-w-6xl' : 'max-w-md')}>
        <Card
          className={cn(
            'relative w-full overflow-hidden bg-background/95 px-7 py-8 backdrop-blur-sm sm:px-10 sm:py-10',
            className,
          )}
        >
          <div className="pointer-events-none absolute -top-24 right-10 hidden h-44 w-44 rounded-full bg-[var(--brand-primary)]/20 blur-3xl sm:block" />
          <div className="pointer-events-none absolute -bottom-28 left-12 hidden h-48 w-48 rounded-full bg-[var(--brand-secondary)]/20 blur-3xl sm:block" />

          <header className="relative mb-6 text-center">
            {normalizedBadge ? <div className="mb-4 flex justify-center">{normalizedBadge}</div> : null}

            <h1 className="text-3xl font-heading text-foreground sm:text-3xl">{title}</h1>
          </header>

          {children}

          <p className="mt-6 text-center text-sm text-foreground/70">
            {switchLabel}{' '}
            <Link
              href={switchHref}
              className="font-base text-foreground hover:text-main transition-colors underline-offset-4 hover:underline"
            >
              {switchText}
            </Link>
          </p>

          {legalText ? (
            <p className="mt-4 text-center text-xs text-foreground/60">{legalText}</p>
          ) : null}
        </Card>

        {hasSideContent ? <aside className="hidden">{sideContent}</aside> : null}
      </div>
    </main>
  )
}

function FloatingStationery() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex h-screen w-screen items-center justify-center opacity-90">
      <div className="relative h-screen w-full">
        {FLOATING_STATIONERY_ITEMS.map(({ id, icon: Icon, className, colors, size, float, delay, duration }) => (
          <motion.div
            key={id}
            className={cn(
              'pointer-events-none absolute flex items-center justify-center rounded-3xl border border-white/40 shadow-md shadow-black/5 backdrop-blur-sm',
              className,
              colors,
              size,
            )}
            animate={{
              x: float.x,
              y: float.y,
              rotate: float.rotate,
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          >
            <Icon className="h-7 w-7" strokeWidth={1.6} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

