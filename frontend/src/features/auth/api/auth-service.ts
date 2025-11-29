import { axiosInstance } from '@/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { handleError } from '@/lib/errors/error-handler'
import { AUTH } from '@/config/constants'
import type {
  ApiResponse,
  AuthTokenDto,
  UserDto,
  LoginRequest,
  RegisterRequest,
  ConfirmEmailRequest,
  ResendEmailConfirmationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '@/types/api'

class AuthService {
  /**
   * Authenticate user with email and password
   * @param email User email address
   * @param password User password
   * @param rememberMe Whether to extend token expiration
   * @returns API response with auth tokens
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<ApiResponse<AuthTokenDto>> {
    try {
      const response = await axiosInstance.post<ApiResponse<AuthTokenDto>>(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          email,
          password,
          rememberMe,
        } as LoginRequest
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: AUTH.MESSAGES.LOGIN_FAILED,
      })
    }
  }

  /**
   * Register a new user account
   * @param data User registration data including name, email, and passwords
   * @returns API response with auth tokens for the new user
   */
  async register(data: {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
  }): Promise<ApiResponse<AuthTokenDto>> {
    try {
      const response = await axiosInstance.post<ApiResponse<AuthTokenDto>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data as RegisterRequest
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: AUTH.MESSAGES.REGISTER_FAILED,
      })
    }
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      handleError(error, {
        showToast: false, // Don't show error on logout
      })
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserDto>> {
    try {
      const response = await axiosInstance.get<ApiResponse<UserDto>>(API_ENDPOINTS.AUTH.ME)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthTokenDto>> {
    try {
      const response = await axiosInstance.post<ApiResponse<AuthTokenDto>>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: AUTH.MESSAGES.TOKEN_EXPIRED,
      })
    }
  }

  /**
   * Confirm email with token from email link
   * @param token Email confirmation token
   * @returns API response
   */
  async confirmEmail(token: string): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.CONFIRM_EMAIL,
        { token } as ConfirmEmailRequest
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Xác nhận email thất bại',
      })
    }
  }

  /**
   * Resend email confirmation to user's email
   * @param email User email address
   * @returns API response
   */
  async resendEmailConfirmation(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.RESEND_CONFIRMATION,
        { email } as ResendEmailConfirmationRequest
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: AUTH.MESSAGES.EMAIL_SENT,
      })
    }
  }

  /**
   * Request password reset link to be sent to email
   * @param email User email address
   * @returns API response
   */
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email } as ForgotPasswordRequest
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
        { token, newPassword, confirmPassword } as ResetPasswordRequest
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Đặt lại mật khẩu thất bại',
      })
    }
  }

  /**
   * Activate creator role for current user
   * Requires verified email
   * @returns API response
   */
  async becomeCreator(): Promise<ApiResponse<void>> {
    try {
      const response = await axiosInstance.post<ApiResponse<void>>(
        API_ENDPOINTS.AUTH.BECOME_CREATOR
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Kích hoạt tài khoản người sáng tạo thất bại',
      })
    }
  }
}

export const authService = new AuthService()

