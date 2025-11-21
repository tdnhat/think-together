// API Response Types

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
}

// ProblemDetails format from backend (RFC 7807)
export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  errors?: Record<string, string[]>
}

// Validation error response structure
export interface ValidationErrorResponse {
  errors: Record<string, string[]>
}

// User Role enum
export type UserRole = 'Student' | 'Teacher' | 'Admin'

// Backend DTOs
export interface AuthTokenDto {
  accessToken: string
  refreshToken?: string
  expiresAt: number
}

export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isEmailVerified: boolean
  avatarUrl?: string | null
  bio?: string | null
  createdAt?: string | null
}

// Request DTOs
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
}

export interface ConfirmEmailRequest {
  token: string
}

export interface ResendEmailConfirmationRequest {
  email: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

