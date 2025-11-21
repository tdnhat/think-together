'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { handleError, toast } from '@/lib/errors/error-handler'
import { AUTH, ROUTES } from '@/config/constants'
import { passwordService } from '../lib/password-service'

/**
 * Custom hook for password recovery operations
 * Provides forgot password and reset password functionality
 * @returns Password recovery methods
 */
export function usePasswordRecovery() {
  const router = useRouter()

  const handleForgotPassword = useCallback(async (email: string) => {
    try {
      const response = await passwordService.forgotPassword(email)

      if (response.success) {
        toast.success(AUTH.MESSAGES.EMAIL_SENT)
        router.push(ROUTES.AUTH.LOGIN)
        return { success: true }
      }

      return {
        success: false,
        error: response.message || 'Gửi email thất bại'
      }
    } catch (error) {
      const handledError = handleError(error, {
        showToast: true,
      })

      return {
        success: false,
        error: handledError.message,
      }
    }
  }, [router])

  const handleResetPassword = useCallback(async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      const response = await passwordService.resetPassword(
        token,
        newPassword,
        confirmPassword
      )

      if (response.success) {
        toast.success('Đặt lại mật khẩu thành công')
        router.push(ROUTES.AUTH.LOGIN)
        return { success: true }
      }

      return {
        success: false,
        error: response.message || 'Đặt lại mật khẩu thất bại'
      }
    } catch (error) {
      const handledError = handleError(error, {
        showToast: true,
      })

      return {
        success: false,
        error: handledError.message,
      }
    }
  }, [router])

  return {
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
  }
}

