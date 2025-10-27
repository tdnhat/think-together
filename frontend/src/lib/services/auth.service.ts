import { axiosInstance } from '@/lib/api'
import type {
  ApiResponse,
  AuthTokenDto,
  UserDto,
  LoginRequest,
  RegisterRequest,
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
    const response = await axiosInstance.post<ApiResponse<AuthTokenDto>>(
      '/api/auth/login',
      {
        email,
        password,
        rememberMe,
      } as LoginRequest
    )
    return response.data
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
    const response = await axiosInstance.post<ApiResponse<AuthTokenDto>>(
      '/api/auth/register',
      data as RegisterRequest
    )
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/api/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserDto>> {
    const response = await axiosInstance.get<ApiResponse<UserDto>>('/api/auth/me')
    return response.data
  }

  async refreshToken(): Promise<ApiResponse<AuthTokenDto>> {
    const response = await axiosInstance.post<ApiResponse<AuthTokenDto>>(
      '/api/auth/refresh-token'
    )
    return response.data
  }

  /**
   * Confirm email with token from email link
   * @param token Email confirmation token
   * @returns API response
   */
  async confirmEmail(token: string): Promise<ApiResponse<object>> {
    const response = await axiosInstance.post<ApiResponse<object>>(
      '/api/auth/confirm-email',
      { token }
    )
    return response.data
  }

  /**
   * Resend email confirmation to user's email
   * @param email User email address
   * @returns API response
   */
  async resendEmailConfirmation(email: string): Promise<ApiResponse<object>> {
    const response = await axiosInstance.post<ApiResponse<object>>(
      '/api/auth/resend-email-confirmation',
      { email }
    )
    return response.data
  }

  /**
   * Request password reset link to be sent to email
   * @param email User email address
   * @returns API response
   */
  async forgotPassword(email: string): Promise<ApiResponse<object>> {
    const response = await axiosInstance.post<ApiResponse<object>>(
      '/api/auth/forgot-password',
      { email }
    )
    return response.data
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
  ): Promise<ApiResponse<object>> {
    const response = await axiosInstance.post<ApiResponse<object>>(
      '/api/auth/reset-password',
      { token, newPassword, confirmPassword }
    )
    return response.data
  }
}

export const authService = new AuthService()

