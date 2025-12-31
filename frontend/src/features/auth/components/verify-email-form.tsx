'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail } from 'lucide-react'
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { authService } from '../api/auth-service'

const verifyEmailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

type VerifyEmailFormProps = React.ComponentProps<"div">

export function VerifyEmailForm({ className, ...props }: VerifyEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  })

  const { handleSubmit, control, register } = form

  useEffect(() => {
    // Check if user just registered
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('pendingVerificationEmail')
      if (storedEmail) {
        setPendingEmail(storedEmail)
        // Clear from sessionStorage after reading
        sessionStorage.removeItem('pendingVerificationEmail')
      }
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
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center items-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Kiểm tra email của bạn</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi email xác nhận đến <span className="font-medium text-foreground">{pendingEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setPendingEmail(null)}
            >
              Gửi lại email xác nhận
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="underline underline-offset-4">
                Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User navigated directly or requested resend - show form
  if (emailSent) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center items-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Email đã được gửi!</CardTitle>
            <CardDescription>
              Vui lòng kiểm tra hộp thư của bạn và nhấp vào liên kết xác nhận.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm">
              <Link href="/login" className="underline underline-offset-4">
                Quay lại đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Xác nhận email</CardTitle>
          <CardDescription>
            Nhập email của bạn để nhận liên kết xác nhận mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-6">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="default" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
                  Gửi email xác nhận
                </Button>

                <div className="text-center text-sm">
                  Đã xác nhận email?{" "}
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
