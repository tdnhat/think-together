"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react"
import { AnimatedListItem } from "@/shared/ui/animated-list"
import { AnimatePresence } from "motion/react"
import { useUIStore } from "@/stores/ui.store"
import { cn } from "@/lib/utils"

const toastIcons = {
  success: CircleCheckIcon,
  error: OctagonXIcon,
  warning: TriangleAlertIcon,
  info: InfoIcon,
  loading: Loader2Icon,
}

const toastVariants = {
  success: "bg-card border-primary/30 text-card-foreground shadow-lg [&>svg]:text-primary",
  error: "bg-card border-destructive/50 text-destructive shadow-lg [&>svg]:text-destructive",
  warning: "bg-card border-border text-card-foreground shadow-lg [&>svg]:text-foreground",
  info: "bg-popover border-border text-popover-foreground shadow-lg [&>svg]:text-popover-foreground",
  loading: "bg-muted border-border text-muted-foreground shadow-lg [&>svg]:text-muted-foreground",
}

function ToastItem({ toast }: { toast: { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string } }) {
  const { actions } = useUIStore()
  const Icon = toastIcons[toast.type] || InfoIcon
  const variant = toastVariants[toast.type] || toastVariants.info
  const isLoading = toast.type === 'info' && toast.message.includes('Loading')

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-4 py-3 backdrop-blur-sm min-w-[300px] max-w-[500px]",
        variant
      )}
    >
      {isLoading ? (
        <Loader2Icon className="size-5 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <Icon className="size-5 shrink-0" />
      )}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => actions.removeToast(toast.id)}
        className="rounded-md p-1 hover:bg-accent/50 transition-colors shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Close toast"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useUIStore((state) => state.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center gap-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <AnimatedListItem key={toast.id}>
              <ToastItem toast={toast} />
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

