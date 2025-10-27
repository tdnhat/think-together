'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { authService } from '@/lib/services/auth.service'
import {
  resendEmailConfirmationSchema,
  type ResendEmailConfirmationFormData,
} from '@/lib/validators'
import { mapApiErrorsToForm } from '@/lib/form-errors'
import type { ApiError } from '@/types/api'
import { AuthField } from '../shared/AuthField'

export function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') ?? ''

  const [isResending, setIsResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ResendEmailConfirmationFormData>({
    resolver: zodResolver(resendEmailConfirmationSchema),
    defaultValues: {
      email: initialEmail,
    },
  })

  useEffect(() => {
    if (!initialEmail) {
      return
    }
    setValue('email', initialEmail)
  }, [initialEmail, setValue])

  useEffect(() => {
    if (resendCountdown <= 0) {
      return
    }

    const timeoutId = globalThis.setTimeout(() => {
      setResendCountdown((prev) => prev - 1)
    }, 1000)

    return () => {
      globalThis.clearTimeout(timeoutId)
    }
  }, [resendCountdown])

  const onResend = async (data: ResendEmailConfirmationFormData) => {
    if (resendCountdown > 0) {
      toast.error(`Vui lòng đợi ${resendCountdown}s trước khi gửi lại.`)
      return
    }

    setIsResending(true)
    try {
      const response = await authService.resendEmailConfirmation(data.email)

      if (response.success) {
        toast.success(response.message ?? 'Đã gửi lại email xác nhận!')
        setResendCountdown(60)
      } else {
        toast.error(response.message ?? 'Không thể gửi lại email xác nhận')
      }
    } catch (error) {
      const apiError = error as ApiError
      mapApiErrorsToForm(apiError.errors, setError)
      toast.error(apiError.detail ?? 'Không thể gửi lại email xác nhận')
    } finally {
      setIsResending(false)
    }
  }

  const renderButtonContent = (): ReactNode => {
    if (isResending) {
      return (
        <>
          <RefreshCw className="size-4 animate-spin" />
          Đang gửi…
        </>
      )
    }

    if (resendCountdown > 0) {
      return `Gửi lại sau ${resendCountdown}s`
    }

    return (
      <>
        <RefreshCw className="size-4" />
        Gửi lại email xác nhận
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-[4px_4px_0_var(--color-border-main)]">
          <Mail className="size-8" strokeWidth={2.5} />
        </div>
        <div className="mt-4 space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Xác nhận email của bạn
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Chúng tôi đã gửi email xác nhận tới{' '}
            {initialEmail ? (
              <span className="font-semibold text-[var(--text-primary)]">{initialEmail}</span>
            ) : (
              'hộp thư của bạn.'
            )}
            {initialEmail ? '.' : null}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[var(--color-border-main)] bg-[var(--bg-surface)] p-4">
        <p className="mb-3 text-sm font-semibold text-[var(--text-primary)]">Hãy kiểm tra:</p>
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 text-[#22c55e]" strokeWidth={2.5} />
            <span>Hộp thư đến hoặc thư mục spam của bạn.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 text-[#22c55e]" strokeWidth={2.5} />
            <span>Đảm bảo đường link được mở trên thiết bị bạn dùng để đăng ký.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-4 text-[#22c55e]" strokeWidth={2.5} />
            <span>Liên kết chỉ có hiệu lực trong 24 giờ.</span>
          </li>
        </ul>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onResend)}>
        <AuthField
          {...register('email')}
          type="email"
          autoComplete="email"
          label="Email đăng ký"
          placeholder="ten-ban@example.com"
          error={errors.email?.message}
        />

        <Button type="submit" className="w-full" disabled={isResending || resendCountdown > 0}>
          {renderButtonContent()}
        </Button>
      </form>
    </div>
  )
}
