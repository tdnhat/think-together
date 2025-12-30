'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail } from 'lucide-react'
import { toastSuccess, toastError } from '@/lib/utils/toast'

import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { AuthField } from './auth-field'
import { authService } from '../api/auth-service'

const verifyEmailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

export function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  })

  useEffect(() => {
    // Check if user just registered
    const storedEmail = sessionStorage.getItem('pendingVerificationEmail')
    if (storedEmail) {
      setPendingEmail(storedEmail)
      // Clear from sessionStorage after reading
      sessionStorage.removeItem('pendingVerificationEmail')
    }
  }, [])

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.resendEmailConfirmation(data.email)
      if (response.success) {
        setEmailSent(true)
        toastSuccess('Email xác nhận đã được gửi!')
      } else {
        toastError(response.message || 'Gửi email thất bại')
      }
    } catch {
      toastError('Có lỗi xảy ra khi gửi email')
    } finally {
      setIsLoading(false)
    }
  }

  // User just registered - show notification
  if (pendingEmail) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4 text-center py-8">
          <Mail className="h-12 w-12 text-[var(--brand-primary)]" />
          <div className="space-y-2">
            <h3 className="text-lg font-heading">Kiểm tra email của bạn</h3>
            <p className="text-foreground/70">
              Chúng tôi đã gửi email xác nhận đến <span className="font-medium">{pendingEmail}</span>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => setPendingEmail(null)}
        >
          Gửi lại email xác nhận
        </Button>
      </div>
    )
  }

  // User navigated directly or requested resend - show form
  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4 py-8">
          <Mail className="h-12 w-12 text-[var(--brand-primary)]" />
          <h3 className="text-lg font-heading">Email đã được gửi!</h3>
          <p className="text-center text-foreground/70">
            Vui lòng kiểm tra hộp thư của bạn và nhấp vào liên kết xác nhận.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-center text-foreground/70">
        Nhập email của bạn để nhận liên kết xác nhận
      </p>

      <AuthField
        {...register('email')}
        type="email"
        label="Email"
        placeholder="Nhập email của bạn"
        error={errors.email?.message}
        disabled={isLoading}
      />

      <Button type="submit" variant="default" size="lg" className="w-full" disabled={isLoading}>
        {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
        Gửi email xác nhận
      </Button>
    </form>
  )
}
