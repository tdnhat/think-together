'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { authService } from '@/lib/services/auth.service'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators'
import { mapApiErrorsToForm } from '@/lib/form-errors'
import type { ApiError } from '@/types/api'
import { AuthField } from '../shared/AuthField'

export function ForgotPasswordContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true)
    try {
      const response = await authService.forgotPassword(data.email)

      if (response.success) {
        setEmailSent(true)
        setSubmittedEmail(data.email)
        toast.success(response.message ?? 'Đã gửi email hướng dẫn đặt lại mật khẩu')
      } else {
        toast.error(response.message ?? 'Không thể gửi email đặt lại mật khẩu')
      }
    } catch (error) {
      const apiError = error as ApiError
      mapApiErrorsToForm(apiError.errors, setError)
      toast.error(apiError.detail ?? 'Không thể gửi email đặt lại mật khẩu')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[#dcfce7] text-[#15803d] shadow-[4px_4px_0_var(--color-border-main)]">
          <CheckCircle2 className="size-8" strokeWidth={2.5} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            Kiểm tra hộp thư của bạn 📬
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới <span className="font-semibold text-[var(--text-primary)]">{submittedEmail}</span>
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-[var(--color-border-main)] bg-[var(--bg-surface)] p-4 text-left text-sm text-[var(--text-secondary)]">
          <p className="mb-2 font-semibold text-[var(--text-primary)]">Tiếp theo bạn cần:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 text-[#22c55e]" strokeWidth={2.5} />
              <span>Nhấp vào liên kết trong email để đặt lại mật khẩu trong vòng 2 giờ.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 text-[#22c55e]" strokeWidth={2.5} />
              <span>Kiểm tra cả mục thư rác nếu bạn không thấy email.</span>
            </li>
          </ul>
        </div>
        <Button asChild className="w-full">
          <Link href="/login">Quay lại đăng nhập</Link>
        </Button>
      </div>
    )
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-[var(--color-border-main)] bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-[4px_4px_0_var(--color-border-main)]">
            <Mail className="size-8" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu.
          </p>
        </div>
        <AuthField
          {...register('email')}
          type="email"
          autoComplete="email"
          label="Địa chỉ email"
          placeholder="ten-ban@example.com"
          error={errors.email?.message}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi hướng dẫn…' : 'Gửi hướng dẫn đặt lại mật khẩu'}
      </Button>
    </form>
  )
}
