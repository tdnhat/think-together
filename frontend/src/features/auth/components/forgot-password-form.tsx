'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui/button'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form'
import { AuthField } from './auth-field'
import { usePasswordRecovery } from '../hooks/use-password-recovery'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { forgotPassword } = usePasswordRecovery()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await forgotPassword(data.email)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AuthField
                  {...field}
                  type="email"
                  label="Email"
                  placeholder="Nhập email của bạn"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
          Gửi link đặt lại mật khẩu
        </Button>
      </form>
    </Form>
  )
}

