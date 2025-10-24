'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { AuthField } from './AuthField'
import { PasswordToggle } from './PasswordToggle'
import { registerSchema as baseRegisterSchema } from '@/lib/validators'
import { useAuth } from '@/hooks/use-auth'
import { mapApiErrorsToForm } from '@/lib/form-errors'

const formSchema = baseRegisterSchema

type SignupFormValues = z.infer<typeof formSchema>

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { register: registerUser } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })

      if (result?.success) {
        toast.success('Tài khoản được tạo thành công!')
        router.push('/home')
      } else if (result?.errors) {
        const mappedErrors: Record<string, string[]> = {}

        for (const [key, value] of Object.entries(result.errors)) {
          if (key === 'FirstName' || key === 'LastName') {
            mappedErrors['Name'] = value
          } else {
            mappedErrors[key] = value
          }
        }

        mapApiErrorsToForm(mappedErrors, setError)
        toast.error('Vui lòng kiểm tra lại thông tin đăng ký')
      } else {
        toast.error(result?.error ?? 'Không thể tạo tài khoản. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Signup failed', error)
      toast.error('Không thể kết nối với máy chủ')
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

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Đang tạo không gian của bạn…' : 'Tạo tài khoản'}
      </Button>
    </form>
  )
}
