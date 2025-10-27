'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { mapApiErrorsToForm } from '@/lib/form-errors'
import { loginSchema as baseLoginSchema } from '@/lib/validators'
import { useAuth } from '@/hooks/use-auth'

import { AuthField } from '../shared/AuthField'
import { PasswordToggle } from '../shared/PasswordToggle'

const formSchema = baseLoginSchema.extend({
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof formSchema>

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
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

      if (result?.errors) {
        mapApiErrorsToForm(result.errors, setError)
        toast.error('Vui lòng kiểm tra lại thông tin đăng nhập')
        return
      }

      toast.error(result?.error ?? 'Email hoặc mật khẩu không chính xác')
    } catch (error) {
      console.error('Login request failed', error)
      toast.error('Không thể kết nối với máy chủ')
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
        </Button>
      </div>
    </form>
  )
}
