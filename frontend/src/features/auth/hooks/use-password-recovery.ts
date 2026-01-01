'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { handleError } from '@/lib/errors/error-handler'
import { toastSuccess } from '@/lib/utils/toast'
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
      await passwordService.forgotPassword(email)

      toastSuccess(AUTH.MESSAGES.EMAIL_SENT)
      router.push(ROUTES.AUTH.LOGIN)
      return { success: true }
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
      await passwordService.resetPassword(
        token,
        newPassword,
        confirmPassword
      )

      toastSuccess('Đặt lại mật khẩu thành công')
      router.push(ROUTES.AUTH.LOGIN)
      return { success: true }
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

