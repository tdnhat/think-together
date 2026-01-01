import { axiosInstance } from '@/api/client'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { handleError } from '@/lib/errors/error-handler'
import { AUTH } from '@/config/constants'
import type {

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
  async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthTokenDto> {
    try {
      const response = await axiosInstance.post<AuthTokenDto>(
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

  async register(data: {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
  }): Promise<AuthTokenDto> {
    try {
      const response = await axiosInstance.post<AuthTokenDto>(
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

  async getCurrentUser(): Promise<UserDto> {
    try {
      const response = await axiosInstance.get<UserDto>(API_ENDPOINTS.AUTH.ME)
      return response.data
    } catch (error) {
      throw handleError(error)
    }
  }

  async refreshToken(): Promise<AuthTokenDto> {
    try {
      const response = await axiosInstance.post<AuthTokenDto>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN
      )
      return response.data
    } catch (error) {
      throw handleError(error, {
        customMessage: AUTH.MESSAGES.TOKEN_EXPIRED,
      })
    }
  }

  async confirmEmail(token: string): Promise<void> {
    try {
      await axiosInstance.post<void>(
        API_ENDPOINTS.AUTH.CONFIRM_EMAIL,
        { token } as ConfirmEmailRequest
      )
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Xác nhận email thất bại',
      })
    }
  }

  async resendEmailConfirmation(email: string): Promise<void> {
    try {
      await axiosInstance.post<void>(
        API_ENDPOINTS.AUTH.RESEND_CONFIRMATION,
        { email } as ResendEmailConfirmationRequest
      )
    } catch (error) {
      throw handleError(error, {
        customMessage: AUTH.MESSAGES.EMAIL_SENT,
      })
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await axiosInstance.post<void>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email } as ForgotPasswordRequest
      )
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Gửi email đặt lại mật khẩu thất bại',
      })
    }
  }

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    try {
      await axiosInstance.post<void>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { token, newPassword, confirmPassword } as ResetPasswordRequest
      )
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Đặt lại mật khẩu thất bại',
      })
    }
  }

  async becomeCreator(): Promise<void> {
    try {
      await axiosInstance.post<void>(
        API_ENDPOINTS.AUTH.BECOME_CREATOR
      )
    } catch (error) {
      throw handleError(error, {
        customMessage: 'Kích hoạt tài khoản người sáng tạo thất bại',
      })
    }
  }
}

export const authService = new AuthService()

