/**
 * Toast utility with duplicate prevention
 * Uses Sonner for consistent toast notifications
 */

import { toast as sonnerToast } from 'sonner'

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
  
  sonnerToast.success(message, { id, duration: options?.duration })
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
  
  sonnerToast.error(message, { id, duration: options?.duration })
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
  
  sonnerToast(message, { id, duration: options?.duration })
  return id
}

// Re-export sonner toast for other uses
export { toast } from 'sonner'
