'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/shared/ui/button'
import { registerSchema, type RegisterFormData } from '@/lib/validators'
import { useAuth } from '../hooks/use-auth'
import { AuthField } from './auth-field'
import { PasswordToggle } from './password-toggle'

type SignupFormValues = RegisterFormData

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true)
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        <AuthField
          {...register('name')}
          type="text"
          autoComplete="name"
          label="Họ và tên đầy đủ"
          placeholder="Nguyễn Văn A"
          helperText="Sử dụng tên thật để bạn bè dễ nhận biết hơn."
          error={errors.name?.message}
        />

        <AuthField
          {...register('email')}
          type="email"
          autoComplete="email"
          label="Email"
          placeholder="hocsinh@example.com"
          error={errors.email?.message}
          inputMode="email"
        />

        <AuthField
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          label="Mật khẩu"
          placeholder="Tạo mật khẩu mạnh"
          helperText="Ít nhất 8 ký tự được khuyến nghị để bảo mật các bài kiểm tra."
          error={errors.password?.message}
          trailingSlot={
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
          }
        />

        <AuthField
          {...register('confirmPassword')}
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu của bạn"
          helperText="Đảm bảo rằng mật khẩu của bạn khớp."
          error={errors.confirmPassword?.message}
          trailingSlot={
            <PasswordToggle
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />
          }
        />
      </div>

      <Button type="submit" variant="default" size="lg" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Đang tạo không gian của bạn…' : 'Tạo tài khoản'}
      </Button>
    </form>
  )
}

