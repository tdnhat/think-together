import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { User, AuthState } from '@/types'
import { STORAGE_KEYS } from '@/config/constants'

interface AuthStore extends AuthState {
  // Additional state
  refreshToken: string | null
  tokenExpiry: number | null
  lastActivity: number | null
  
  actions: {
    login: (user: User, token: string, refreshToken?: string, expiresIn?: number) => void
    logout: () => void
    updateUser: (user: Partial<User>) => void
    setLoading: (loading: boolean) => void
    refreshAccessToken: () => Promise<boolean>
    checkTokenExpiry: () => boolean
    updateLastActivity: () => void
    clearSession: () => void
  }
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        user: null,
        token: null,
        refreshToken: null,
        tokenExpiry: null,
        lastActivity: Date.now(),
        isAuthenticated: false,
        isLoading: false,

        // Actions
        actions: {
          login: (user: User, token: string, refreshToken?: string, expiresIn?: number) => {
            const expiry = expiresIn ? Date.now() + expiresIn * 1000 : null
            
            set(
              {
                user,
                token,
                refreshToken: refreshToken || null,
                tokenExpiry: expiry,
                isAuthenticated: true,
                isLoading: false,
                lastActivity: Date.now(),
              },
              false,
              'auth/login'
            )

            if (typeof globalThis.window !== 'undefined') {
              localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
              if (refreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
              }
            }
          },

          logout: () => {
            get().actions.clearSession()
          },
          
          clearSession: () => {
            set(
              {
                user: null,
                token: null,
                refreshToken: null,
                tokenExpiry: null,
                isAuthenticated: false,
                isLoading: false,
              },
              false,
              'auth/clearSession'
            )

            if (typeof globalThis.window !== 'undefined') {
              localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
              localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
            }
          },

          updateUser: (userData: Partial<User>) => {
            const currentUser = get().user
            if (currentUser) {
              set(
                {
                  user: { ...currentUser, ...userData },
                },
                false,
                'auth/updateUser'
              )
            }
          },

          setLoading: (loading: boolean) => {
            set({ isLoading: loading }, false, 'auth/setLoading')
          },
          
          refreshAccessToken: async () => {
            const { refreshToken } = get()
            
            if (!refreshToken) {
              return false
            }
            
            try {
              // Call refresh endpoint (handled by API client automatically)
              // This is a placeholder - actual refresh is handled by the API client
              // Store just tracks the token state
              return true
            } catch {
              // Refresh failed, clear session
              get().actions.clearSession()
              return false
            }
          },
          
          checkTokenExpiry: () => {
            const { tokenExpiry } = get()
            
            if (!tokenExpiry) {
              return true
            }
            
            // Check if token expires in next 5 minutes
            const fiveMinutes = 5 * 60 * 1000
            return Date.now() + fiveMinutes < tokenExpiry
          },
          
          updateLastActivity: () => {
            set({ lastActivity: Date.now() }, false, 'auth/updateLastActivity')
          },
        },
      }),
      {
        name: STORAGE_KEYS.AUTH_STORAGE,
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          tokenExpiry: state.tokenExpiry,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
)

// Selectors for optimized re-renders
export const selectUser = (state: AuthStore): User | null => state.user
export const selectToken = (state: AuthStore): string | null => state.token
export const selectRefreshToken = (state: AuthStore): string | null => state.refreshToken
export const selectTokenExpiry = (state: AuthStore): number | null => state.tokenExpiry
export const selectLastActivity = (state: AuthStore): number | null => state.lastActivity
export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated
export const selectIsLoading = (state: AuthStore): boolean => state.isLoading
export const selectAuthActions = (state: AuthStore): AuthStore['actions'] => state.actions

