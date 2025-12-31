'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { toastSuccess, toastError } from '@/lib/utils/toast'

import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Input } from '@/shared/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'
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

type ResetPasswordFormProps = React.ComponentProps<"div">

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  // Hook form submit handler
  const { handleSubmit, control } = form;

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
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Liên kết không hợp lệ</CardTitle>
            <CardDescription className="text-destructive">
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild variant="default">
              <Link href={ROUTES.auth.forgotPassword}>Yêu cầu link mới</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Tạo mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-6">
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Nhập mật khẩu mới"
                            disabled={isLoading}
                            className="pr-12"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <PasswordToggle show={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Nhập lại mật khẩu mới"
                            disabled={isLoading}
                            className="pr-12"
                            {...field}
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <PasswordToggle
                              show={showConfirmPassword}
                              onToggle={() => setShowConfirmPassword((prev) => !prev)}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant="default" type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                  Đặt lại mật khẩu
                </Button>

                <div className="text-center text-sm">
                  Đã nhớ mật khẩu?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  )
}
