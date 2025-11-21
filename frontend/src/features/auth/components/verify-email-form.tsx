'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/shared/ui/button'
import { AuthField } from './auth-field'
import { authService } from '../api/auth-service'

const verifyEmailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

export function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  })

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.resendEmailConfirmation(data.email)
      if (response.success) {
        setEmailSent(true)
        toast.success('Email xác nhận đã được gửi!')
      } else {
        toast.error(response.message || 'Gửi email thất bại')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi email')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Mail className="h-12 w-12 text-[var(--brand-primary)]" />
        <h3 className="text-lg font-semibold">Email đã được gửi!</h3>
        <p className="text-center text-[var(--text-secondary)]">
          Vui lòng kiểm tra hộp thư của bạn và nhấp vào liên kết xác nhận.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-center text-[var(--text-secondary)]">
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Gửi email xác nhận
      </Button>
    </form>
  )
}
