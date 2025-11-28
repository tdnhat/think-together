'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toastSuccess, toastError } from '@/lib/utils/toast'
import Link from 'next/link'

import { Button } from '@/shared/ui/button'
import { AuthField } from './auth-field'
import { PasswordToggle } from './password-toggle'
import { authService } from '../api/auth-service'
import { ROUTES } from '@/config/routes'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toastError('Thiếu mã đặt lại mật khẩu')
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.resetPassword(token, data.password, data.confirmPassword)
      if (response.success) {
        toastSuccess('Đặt lại mật khẩu thành công!')
        router.push(ROUTES.auth.login)
      } else {
        toastError(response.message || 'Đặt lại mật khẩu thất bại')
      }
    } catch {
      toastError('Có lỗi xảy ra khi đặt lại mật khẩu')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-[var(--color-error)] font-base">Liên kết không hợp lệ hoặc đã hết hạn</p>
        <Button asChild variant="neutral" className="mt-4">
          <Link href={ROUTES.auth.forgotPassword}>Yêu cầu link mới</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AuthField
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        label="Mật khẩu mới"
        placeholder="Nhập mật khẩu mới"
        error={errors.password?.message}
        disabled={isLoading}
        trailingSlot={
          <PasswordToggle show={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
        }
      />

      <AuthField
        {...register('confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu mới"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        trailingSlot={
          <PasswordToggle
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
          />
        }
      />

      <Button variant="default" type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Đặt lại mật khẩu
      </Button>
    </form>
  )
}
