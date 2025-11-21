import { axiosInstance } from '@/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { handleError } from '@/lib/errors/error-handler'
import type { ApiResponse } from '@/types/api'

class PasswordService {
  /**
   * Request password reset link to be sent to email
   * @param email User email address
   * @returns API response
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Gửi email đặt lại mật khẩu thất bại',
      })
    }
  }

  /**
   * Reset password using token from email link
   * @param token Password reset token
   * @param newPassword New password
   * @param confirmPassword Password confirmation
   * @returns API response
   */
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, newPassword, confirmPassword }
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Đặt lại mật khẩu thất bại',
      })
    }
  }
}

export const passwordService = new PasswordService()

