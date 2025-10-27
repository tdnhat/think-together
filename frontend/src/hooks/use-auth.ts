import { useCallback } from 'react'
import { useUserStore } from '@/stores/user-store'
import { authService } from '@/lib/services/auth.service'
import apiClient from '@/lib/api'
import { LoginFormData, RegisterFormData } from '@/lib/validators'
import type { ApiError } from '@/types/api'
import type { User } from '@/types'

/**
 * Custom hook for authentication operations
 * Provides login, register, logout, and token refresh functionality
 * @returns Authentication methods and state
 */
export function useAuth() {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    setLoading 
  } = useUserStore()

  const handleLogin = useCallback(async (data: LoginFormData & { rememberMe?: boolean }) => {
    try {
      setLoading(true)
      const response = await authService.login(data.email, data.password, data.rememberMe || false)
      
      if (response.success && response.data) {
        const { accessToken } = response.data
        apiClient.setToken(accessToken)

        const userResponse = await authService.getCurrentUser()
        
        if (userResponse.success && userResponse.data) {
          const userDto = userResponse.data
          const user: User = {
            id: userDto.id,
            email: userDto.email,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            name: `${userDto.firstName} ${userDto.lastName}`,
            role: userDto.role,
            avatarUrl: userDto.avatarUrl,
            bio: userDto.bio,
            createdAt: userDto.createdAt,
          }
          
          login(user, accessToken)
          return { success: true }
        }
      }
      
      return { 
        success: false, 
        error: response.message || 'Đăng nhập thất bại' 
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.detail || 'Đăng nhập thất bại',
        errors: apiError.errors
      }
    } finally {
      setLoading(false)
    }
  }, [login, setLoading])

  const handleRegister = useCallback(async (data: RegisterFormData) => {
    try {
      setLoading(true)
      
      const nameParts = data.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      const response = await authService.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName,
        lastName,
      })
      
      // Registration doesn't return a token - user must verify email first
      if (response.success) {
        return { 
          success: true,
          message: response.message || 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.'
        }
      }
      
      return { 
        success: false, 
        error: response.message || 'Đăng ký thất bại' 
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.detail || 'Đăng ký thất bại',
        errors: apiError.errors
      }
    } finally {
      setLoading(false)
    }
  }, [setLoading])

  const handleLogout = useCallback(async () => {
    await authService.logout()
    apiClient.clearToken()
    logout()
  }, [logout])

  const refreshAuth = useCallback(async () => {
    if (!token) return false
    
    try {
      const response = await authService.refreshToken()
      
      if (response.success && response.data) {
        const { accessToken } = response.data
        apiClient.setToken(accessToken)
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      return false
    }
  }, [token, logout])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshAuth,
  }
}
