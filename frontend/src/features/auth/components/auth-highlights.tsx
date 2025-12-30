import type { ReactNode } from 'react'

import { Badge } from '@/shared/ui/badge'
import { Card } from '@/shared/ui/card'
import { cn } from '@/lib/utils'

export type AuthHighlightItem = Readonly<{
  title: string
  description: string
  icon?: ReactNode
}>

export type AuthHighlightsProps = Readonly<{
  heading?: string
  caption?: string
  items: AuthHighlightItem[]
  className?: string
}>

export function AuthHighlights({ heading = 'Những gì bạn nhận được bên trong', caption, items, className }: AuthHighlightsProps) {
  if (!items.length) {
    return null
  }

  return (
    <Card
      aria-label="Why Think Together shines"
      className={cn('px-6 py-5', className)}
    >
      <header className="mb-4 space-y-2">
        <Badge variant="outline">
          🚀 Được học sinh cung cấp
        </Badge>
        <div>
          <h2 className="text-xl font-heading text-foreground">{heading}</h2>
          {caption ? <p className="mt-1 text-sm text-foreground/70">{caption}</p> : null}
        </div>
      </header>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            {item.icon ? <span aria-hidden className="mt-1 text-lg">{item.icon}</span> : null}
            <div className="space-y-1">
              <span className="text-base font-heading text-foreground">{item.title}</span>
              <p className="text-sm text-foreground/70">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

