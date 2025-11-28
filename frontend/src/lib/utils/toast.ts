/**
 * Toast utility with duplicate prevention
 * Prevents the same toast message from showing multiple times within a short window
 */

import toast, { Toast } from 'react-hot-toast'

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
export function toastSuccess(message: string, options?: Partial<Pick<Toast, 'id' | 'duration'>>): string {
  const id = options?.id || getToastId(message, 'success')
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  return toast.success(message, { id, ...options })
}

/**
 * Show error toast with duplicate prevention
 */
export function toastError(message: string, options?: Partial<Pick<Toast, 'id' | 'duration'>>): string {
  const id = options?.id || getToastId(message, 'error')
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  return toast.error(message, { id, ...options })
}

/**
 * Show info toast with duplicate prevention
 */
export function toastInfo(message: string, options?: Partial<Pick<Toast, 'id' | 'duration'>>): string {
  const id = options?.id || getToastId(message, 'info')
  
  if (!shouldShowToast(id)) {
    return id
  }
  
  return toast(message, { id, ...options })
}

// Re-export toast for other uses
export { toast }

