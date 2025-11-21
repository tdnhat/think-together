'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { Button } from '@/shared/ui/button'
import { Checkbox } from '@/shared/ui/checkbox'
import { Label } from '@/shared/ui/label'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { handleError } from '@/lib/errors/error-handler'
import { useAuth } from '../hooks/use-auth'
import { AuthField } from './auth-field'
import { PasswordToggle } from './password-toggle'

type LoginFormValues = LoginFormData

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      })

      if (result?.success) {
        toast.success('Chào mừng quay trở lại!')
        router.push('/home')
        return
      }

      toast.error(result?.error ?? 'Email hoặc mật khẩu không chính xác')
    } catch (error) {
      handleError(error, { 
        showToast: true, 
        customMessage: 'Không thể kết nối với máy chủ'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        <AuthField
          {...register('email')}
          type="email"
          autoComplete="email"
          label="Email"
          placeholder="abc@example.com"
          error={errors.email?.message}
          inputMode="email"
        />

        <AuthField
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu của bạn"
          error={errors.password?.message}
          trailingSlot={
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox id="rememberMe" checked={field.value ?? false} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="rememberMe" className="cursor-pointer font-medium normal-case">
              Ghi nhớ tôi
            </Label>
          </div>

          <Button
            type="button"
            variant="link"
            className="text-sm font-semibold text-[var(--brand-primary)]"
            asChild
          >
            <Link href="/forgot-password">Quên mật khẩu?</Link>
          </Button>
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>
      </div>
    </form>
  )
}

