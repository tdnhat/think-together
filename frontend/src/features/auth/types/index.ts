// Auth-specific types

// User Role enum
export type UserRole = 'User' | 'Creator' | 'Admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  role: UserRole
  isEmailVerified: boolean
  avatarUrl?: string | null
  bio?: string | null
  createdAt?: string | null
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Backend DTOs for auth
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

