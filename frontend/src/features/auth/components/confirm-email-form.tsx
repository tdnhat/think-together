'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/shared/ui/button'
import { authService } from '../api/auth-service'
import { ROUTES } from '@/config/routes'

export function ConfirmEmailForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Thiếu mã xác nhận email')
        return
      }

      try {
        const response = await authService.confirmEmail(token)
        if (response.success) {
          setStatus('success')
          setMessage('Email của bạn đã được xác nhận thành công!')
        } else {
          setStatus('error')
          setMessage(response.message || 'Xác nhận email thất bại')
        }
      } catch {
        setStatus('error')
        setMessage('Có lỗi xảy ra khi xác nhận email')
      }
    }

    confirmEmail()
  }, [token])

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      {status === 'loading' && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-[var(--brand-primary)]" />
          <p className="text-center text-foreground/70">Đang xác nhận email...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle2 className="h-12 w-12 text-[var(--color-success)]" />
          <p className="text-center text-lg font-medium">{message}</p>
          <Button asChild variant="default" className="mt-4">
            <Link href={ROUTES.auth.login}>Đăng nhập ngay</Link>
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <XCircle className="h-12 w-12 text-[var(--color-error)]" />
          <p className="text-center text-lg font-medium text-[var(--color-error)]">{message}</p>
          <Button asChild variant="neutral" className="mt-4">
            <Link href={ROUTES.auth.verifyEmail}>Gửi lại email xác nhận</Link>
          </Button>
        </>
      )}
    </div>
  )
}
