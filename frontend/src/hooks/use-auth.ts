import { useCallback } from 'react'
import { useUserStore } from '@/stores/user-store'
import { apiClient } from '@/lib/api'
import { LoginFormData, RegisterFormData } from '@/lib/validators'

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

  const handleLogin = useCallback(async (data: LoginFormData) => {
    try {
      setLoading(true)
      const response = await apiClient.login(data.email, data.password)
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.message || 'Login failed' 
        }
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      }
    } finally {
      setLoading(false)
    }
  }, [login, setLoading])

  const handleRegister = useCallback(async (data: RegisterFormData) => {
    try {
      setLoading(true)
      const response = await apiClient.register(data.email, data.password, data.name)
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token)
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.message || 'Registration failed' 
        }
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      }
    } finally {
      setLoading(false)
    }
  }, [login, setLoading])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const refreshAuth = useCallback(async () => {
    if (!token) return false
    
    try {
      // In a real app, you might call a refresh endpoint here
      // For now, we'll just check if the token exists
      return true
    } catch (error) {
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
