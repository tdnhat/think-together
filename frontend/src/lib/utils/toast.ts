/**
 * Toast utility with duplicate prevention
 * Uses UI Store with AnimatedList for toast notifications
 */

import { useUIStore } from '@/stores/ui.store'

// Track recent toast messages to prevent duplicates
const recentToasts = new Map<string, number>()
const TOAST_DEDUP_WINDOW = 2000 // 2 seconds

function getToastId(message: string, type?: string): string {
  return `${type || 'default'}-${message}`
}

function shouldShowToast(id: string): boolean {
  const now = Date.now()
  const lastShown = recentToasts.get(id)
  
  if (lastShown && now - lastShown < TOAST_DEDUP_WINDOW) {
    return false // Skip duplicate toast
  }
  
  // Update the timestamp
  recentToasts.set(id, now)
  
  // Clean up old entries periodically
  if (recentToasts.size > 100) {
    const cutoff = now - TOAST_DEDUP_WINDOW * 10
    for (const [key, timestamp] of recentToasts.entries()) {
      if (timestamp < cutoff) {
        recentToasts.delete(key)
      }
    }
  }
  
  return true
}

/**
 * Show success toast with duplicate prevention
 */
export function toastSuccess(message: string, options?: { id?: string; duration?: number }): string {
  const id = options?.id || getToastId(message, 'success')
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  const store = useUIStore.getState()
  store.actions.addToast({
    type: 'success',
    message,
    duration: options?.duration,
  })
  return id
}

/**
 * Show error toast with duplicate prevention
 */
export function toastError(message: string, options?: { id?: string; duration?: number }): string {
  const id = options?.id || getToastId(message, 'error')
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  const store = useUIStore.getState()
  store.actions.addToast({
    type: 'error',
    message,
    duration: options?.duration,
  })
  return id
}

/**
 * Show warning toast with duplicate prevention
 */
export function toastWarning(message: string, options?: { id?: string; duration?: number }): string {
  const id = options?.id || getToastId(message, 'warning')
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  const store = useUIStore.getState()
  store.actions.addToast({
    type: 'warning',
    message,
    duration: options?.duration,
  })
  return id
}

/**
 * Show info toast with duplicate prevention
 */
export function toastInfo(message: string, options?: { id?: string; duration?: number }): string {
  const id = options?.id || getToastId(message, 'info')
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  const store = useUIStore.getState()
  store.actions.addToast({
    type: 'info',
    message,
    duration: options?.duration,
  })
  return id
}

/**
 * Show loading toast
 */
export function toastLoading(message: string, options?: { id?: string; duration?: number }): string {
  const id = options?.id || getToastId(message, 'loading')
  
  const store = useUIStore.getState()
  store.actions.addToast({
    type: 'info',
    message,
    duration: options?.duration || 0, // Loading toasts don't auto-dismiss
  })
  return id
}

/**
 * Dismiss a toast by id
 */
export function toastDismiss(id: string): void {
  const store = useUIStore.getState()
  store.actions.removeToast(id)
}

/**
 * Generic toast function (for compatibility with sonner API)
 */
function createToast(type: 'success' | 'error' | 'warning' | 'info', message: string, options?: { duration?: number; id?: string }): string {
  const id = options?.id || getToastId(message, type)
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  const store = useUIStore.getState()
  store.actions.addToast({
    type,
    message,
    duration: options?.duration,
  })
  return id
}

/**
 * Toast function with methods matching sonner API
 */
function toastFn(message: string, options?: { type?: 'success' | 'error' | 'warning' | 'info'; duration?: number; id?: string }): string {
  const type = options?.type || 'info'
  return createToast(type, message, options)
}

// Add methods to the function object
toastFn.success = (message: string, options?: { duration?: number; id?: string }) => createToast('success', message, options)
toastFn.error = (message: string, options?: { duration?: number; id?: string }) => createToast('error', message, options)
toastFn.warning = (message: string, options?: { duration?: number; id?: string }) => createToast('warning', message, options)
toastFn.info = (message: string, options?: { duration?: number; id?: string }) => createToast('info', message, options)
toastFn.loading = (message: string, options?: { duration?: number; id?: string }) => createToast('info', message, { ...options, duration: options?.duration || 0 })
toastFn.dismiss = toastDismiss

export const toast = toastFn as typeof toastFn & {
  success: (message: string, options?: { duration?: number; id?: string }) => string
  error: (message: string, options?: { duration?: number; id?: string }) => string
  warning: (message: string, options?: { duration?: number; id?: string }) => string
  info: (message: string, options?: { duration?: number; id?: string }) => string
  loading: (message: string, options?: { duration?: number; id?: string }) => string
  dismiss: (id: string) => void
}
