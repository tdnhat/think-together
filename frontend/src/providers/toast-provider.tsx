'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--bg-surface)',
          color: 'var(--text-primary)',
          border: '3px solid var(--color-border-main)',
          borderRadius: '12px',
          boxShadow: '2px 2px 0 var(--color-border-main)',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: 'var(--color-success)',
            secondary: 'var(--bg-surface)',
          },
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--color-success)',
            borderRadius: '12px',
            boxShadow: '2px 2px 0 var(--color-success)',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: 'var(--color-error)',
            secondary: 'var(--bg-surface)',
          },
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--color-error)',
            borderRadius: '12px',
            boxShadow: '2px 2px 0 var(--color-error)',
          },
        },
      }}
    />
  )
}
