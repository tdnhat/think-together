'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-text)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'var(--toast-success-icon)',
            secondary: 'var(--toast-text)',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: 'var(--toast-error-icon)',
            secondary: 'var(--toast-text)',
          },
        },
      }}
    />
  )
}
