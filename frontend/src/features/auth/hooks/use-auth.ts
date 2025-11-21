'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, selectAuthActions, selectUser, selectToken, selectIsAuthenticated, selectIsLoading } from '../stores/auth.store'
import { authService } from '../api/auth-service'
import apiClient from '@/api/client'
import { handleError, toast } from '@/lib/errors/error-handler'
import { AUTH, ROUTES } from '@/config/constants'
import { LoginFormData, RegisterFormData } from '@/lib/validators'
import type { User } from '../types'

/**
 * Custom hook for authentication operations
 * Provides login, register, logout, and token refresh functionality
 * @returns Authentication methods and state
 */
export function useAuth() {
  const router = useRouter()
  const user = useAuthStore(selectUser)
  const token = useAuthStore(selectToken)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isLoading = useAuthStore(selectIsLoading)
  const { login: loginAction, logout: logoutAction, setLoading } = useAuthStore(selectAuthActions)

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
            isEmailVerified: userDto.isEmailVerified,
            avatarUrl: userDto.avatarUrl,
            bio: userDto.bio,
            createdAt: userDto.createdAt,
          }
          
          loginAction(user, accessToken)
          toast.success(AUTH.MESSAGES.LOGIN_SUCCESS)
          router.push(ROUTES.DASHBOARD.HOME)
          
          return { success: true as const }
        }
      }
      
      return { 
        success: false as const, 
        error: response.message || AUTH.MESSAGES.LOGIN_FAILED
      }
    } catch (error) {
      const handledError = handleError(error, {
        showToast: true,
      })
      
      return {
        success: false as const,
        error: handledError.message,
      }
    } finally {
      setLoading(false)
    }
  }, [loginAction, setLoading, router])

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
      
      if (response.success) {
        toast.success(AUTH.MESSAGES.REGISTER_SUCCESS)
        router.push(ROUTES.AUTH.VERIFY_EMAIL)
        
        return { success: true as const }
      }
      
      return { 
        success: false as const, 
        error: response.message || AUTH.MESSAGES.REGISTER_FAILED
      }
    } catch (error) {
      const handledError = handleError(error, {
        showToast: true,
      })
      
      return {
        success: false as const,
        error: handledError.message,
      }
    } finally {
      setLoading(false)
    }
  }, [setLoading, router])

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout()
      apiClient.clearToken()
      logoutAction()
      toast.success(AUTH.MESSAGES.LOGOUT_SUCCESS)
      router.push(ROUTES.AUTH.LOGIN)
    } catch (error) {
      handleError(error, {
        showToast: false,
      })
      // Still clear session even if API call fails
      apiClient.clearToken()
      logoutAction()
      router.push(ROUTES.AUTH.LOGIN)
    }
  }, [logoutAction, router])

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
      handleError(error, {
        showToast: true,
      })
      logoutAction()
      return false
    }
  }, [token, logoutAction])

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

