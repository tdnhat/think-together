'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { authService } from '@/lib/services/auth.service'
import type { ApiError } from '@/types/api'

export function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  )
  const [message, setMessage] = useState<string>(
    token ? '' : 'Token xác nhận email không hợp lệ hoặc đã hết hạn.'
  )
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!token) {
      return
    }

    let isActive = true

    const confirmEmail = async () => {
      try {
        const response = await authService.confirmEmail(token)

        if (!isActive) {
          return
        }

        if (response.success) {
          setStatus('success')
          setMessage(response.message ?? 'Email đã được xác nhận thành công!')
          toast.success('Xác nhận email thành công')
        } else {
          setStatus('error')
          setMessage(response.message ?? 'Không thể xác nhận email. Vui lòng thử lại.')
          toast.error(response.message ?? 'Không thể xác nhận email.')
        }
      } catch (error) {
        if (!isActive) {
          return
        }

        const apiError = error as ApiError
        setStatus('error')
        setMessage(apiError.detail ?? 'Không thể xác nhận email. Vui lòng thử lại.')
        toast.error(apiError.detail ?? 'Không thể xác nhận email.')
      }
    }

    confirmEmail()

    return () => {
      isActive = false
    }
  }, [token])

  useEffect(() => {
    if (status !== 'success') {
      return
    }

    if (countdown <= 0) {
      router.replace('/login')
      return
    }

    const timeoutId = globalThis.setTimeout(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => {
      globalThis.clearTimeout(timeoutId)
    }
  }, [status, countdown, router])

  if (status === 'loading') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-[4px_4px_0_var(--color-border-main)]">
          <Loader2 className="size-8 animate-spin" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Đang xác nhận email…
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Vui lòng đợi trong giây lát.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[#dcfce7] text-[#15803d] shadow-[4px_4px_0_var(--color-border-main)]">
          <CheckCircle2 className="size-8" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Xác nhận thành công! 🎉
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
          <p className="rounded-xl border border-dashed border-[var(--color-border-main)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)]/80">
            Bạn sẽ được chuyển hướng tới trang đăng nhập sau {countdown} giây.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Đăng nhập ngay</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[#fee2e2] text-[#b91c1c] shadow-[4px_4px_0_var(--color-border-main)]">
        <XCircle className="size-8" strokeWidth={2.5} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          Không thể xác nhận email
        </h2>
        <p className="text-sm text-[var(--color-error)]">
          {message || 'Liên kết có thể đã hết hạn hoặc không hợp lệ.'}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button asChild className="w-full">
          <Link href="/verify-email">Gửi lại email xác nhận</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Quay lại đăng nhập</Link>
        </Button>
      </div>
    </div>
  )
}
