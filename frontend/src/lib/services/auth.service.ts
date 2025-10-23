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
}

export const authService = new AuthService()

