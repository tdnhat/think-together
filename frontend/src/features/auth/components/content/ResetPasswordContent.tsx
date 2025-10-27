'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, KeyRound, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { authService } from '@/lib/services/auth.service'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators'
import { mapApiErrorsToForm } from '@/lib/form-errors'
import type { ApiError } from '@/types/api'
import { AuthField } from '../shared/AuthField'
import { PasswordToggle } from '../shared/PasswordToggle'

export function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
    },
  })

  useEffect(() => {
    setValue('token', token)
  }, [token, setValue])

  useEffect(() => {
    if (!resetSuccess) {
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
  }, [resetSuccess, countdown, router])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authService.resetPassword(
        data.token,
        data.newPassword,
        data.confirmPassword
      )

      if (response.success) {
        setResetSuccess(true)
        toast.success(response.message ?? 'Đặt lại mật khẩu thành công!')
      } else {
        toast.error(response.message ?? 'Không thể đặt lại mật khẩu. Vui lòng thử lại.')
      }
    } catch (error) {
      const apiError = error as ApiError
      mapApiErrorsToForm(apiError.errors, setError)
      toast.error(apiError.detail ?? 'Không thể đặt lại mật khẩu. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token && !resetSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[#fee2e2] text-[#b91c1c] shadow-[4px_4px_0_var(--color-border-main)]">
          <ShieldAlert className="size-8" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Liên kết không hợp lệ
          </h2>
          <p className="text-sm text-[var(--color-error)]">
            Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết mới.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/forgot-password">Yêu cầu liên kết mới</Link>
        </Button>
      </div>
    )
  }

  if (resetSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[#dcfce7] text-[#15803d] shadow-[4px_4px_0_var(--color-border-main)]">
          <CheckCircle2 className="size-8" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Mật khẩu đã được cập nhật! 🎉
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
          </p>
          <p className="rounded-2xl border border-dashed border-[var(--color-border-main)] bg-[var(--bg-surface)] px-4 py-2 text-sm text-[var(--text-secondary)]/80">
            Tự động chuyển hướng tới trang đăng nhập sau {countdown} giây.
          </p>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Đăng nhập ngay</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register('token')} />

      <div className="space-y-5">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-[4px_4px_0_var(--color-border-main)]">
            <KeyRound className="size-8" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </p>
        </div>

        <AuthField
          {...register('newPassword')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          helperText="Ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
          error={errors.newPassword?.message}
          trailingSlot={
            <PasswordToggle
              show={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        <AuthField
          {...register('confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu mới"
          error={errors.confirmPassword?.message}
          trailingSlot={
            <PasswordToggle
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Đang cập nhật mật khẩu…' : 'Đặt lại mật khẩu'}
      </Button>
    </form>
  )
}
