import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type AuthHighlightItem = {
  title: string
  description: string
  icon?: ReactNode
}

type AuthHighlightsProps = {
  heading?: string
  caption?: string
  items: AuthHighlightItem[]
  className?: string
}

export function AuthHighlights({
  heading = "Những gì bạn nhận được bên trong",
  caption,
  items,
  className,
}: AuthHighlightsProps) {
  if (!items.length) return null

  return (
    <section
      aria-label="Why Think Together shines"
      className={cn(
        "rounded-3xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] px-6 py-5 shadow-[8px_8px_0_var(--color-border-main)]",
        className,
      )}
    >
      <header className="mb-4 space-y-2">
        <Badge variant="secondary" size="sm">
          🚀 Được học sinh cung cấp
        </Badge>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{heading}</h2>
          {caption ? (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{caption}</p>
          ) : null}
        </div>
      </header>

      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-3">
            {item.icon ? (
              <span aria-hidden className="mt-1 text-lg">
                {item.icon}
              </span>
            ) : null}
            <div className="space-y-1">
              <span className="text-base font-semibold text-[var(--text-primary)]">
                {item.title}
              </span>
              <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

