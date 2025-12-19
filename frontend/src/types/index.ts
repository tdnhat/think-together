// User Role enum
export type UserRole = 'User' | 'Creator' | 'Administrator'

// User types
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

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T = unknown> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// UI types
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

export interface Modal {
  id: string
  component: string
  props?: Record<string, unknown>
  isOpen: boolean
}

// Error types
export interface ApiError {
  message: string
  statusCode: number
  field?: string
}

export interface ValidationError {
  field: string
  message: string
}