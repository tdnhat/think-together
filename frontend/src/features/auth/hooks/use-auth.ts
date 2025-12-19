'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, selectAuthActions, selectUser, selectToken, selectIsAuthenticated, selectIsLoading } from '../stores/auth.store'
import { authService } from '../api/auth-service'
import apiClient from '@/api/client'
import { handleError } from '@/lib/errors/error-handler'
import { toastSuccess } from '@/lib/utils/toast'
import { AUTH } from '@/config/constants'
import { ROUTES } from '@/config/routes'
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
          // Map API role to auth role
          const mapRole = (apiRole: string): 'User' | 'Creator' | 'Admin' => {
            switch (apiRole) {
              case 'Student':
                return 'User'
              case 'Creator':
                return 'Creator'
              case 'Admin':
                return 'Admin'
              default:
                return 'User'
            }
          }

          const user: User = {
            id: userDto.id,
            email: userDto.email,
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            name: `${userDto.firstName} ${userDto.lastName}`,
            role: mapRole(userDto.role),
            isEmailVerified: userDto.isEmailVerified,
            avatarUrl: userDto.avatarUrl,
            bio: userDto.bio,
            createdAt: userDto.createdAt,
          }
          
          loginAction(user, accessToken)
          toastSuccess(AUTH.MESSAGES.LOGIN_SUCCESS)
          
          if (user.role === 'Admin') {
            router.push(ROUTES.admin.dashboard)
          } else if (user.role === 'Creator') {
            router.push(ROUTES.quiz.list)
          } else {
            router.push(ROUTES.dashboard.home)
          }
          
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
        toastSuccess(AUTH.MESSAGES.REGISTER_SUCCESS)
        // Store email temporarily for verify-email page
        sessionStorage.setItem('pendingVerificationEmail', data.email)
        router.push(ROUTES.auth.verifyEmail)
        
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
      toastSuccess(AUTH.MESSAGES.LOGOUT_SUCCESS)
      router.push(ROUTES.auth.login)
    } catch (error) {
      handleError(error, {
        showToast: false,
      })
      // Still clear session even if API call fails
      apiClient.clearToken()
      logoutAction()
      router.push(ROUTES.auth.login)
    }
  }, [logoutAction, router])

  const refreshAuth = useCallback(async () => {
    if (!token) {
      router.push(ROUTES.auth.login)
      return false
    }

    try {
      const response = await authService.refreshToken()

      if (response.success && response.data) {
        const { accessToken } = response.data
        apiClient.setToken(accessToken)
        return true
      }

      // Refresh failed, redirect to login
      router.push(ROUTES.auth.login)
      return false
    } catch (error) {
      handleError(error, {
        showToast: true,
      })
      // Clear session and redirect to login
      logoutAction()
      router.push(ROUTES.auth.login)
      return false
    }
  }, [token, logoutAction, router])

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

