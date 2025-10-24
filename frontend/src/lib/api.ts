import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, ApiError, AuthTokenDto } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const AUTH_TOKEN_KEY = 'auth_token'

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb)
}

function onTokenRefreshed(token: string) {
  for (const cb of refreshSubscribers) {
    cb(token)
  }
  refreshSubscribers = []
}

class ApiClient {
  private readonly client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        throw error
      }
    )

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve) => {
              subscribeTokenRefresh((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                resolve(this.client(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          isRefreshing = true

          try {
            const response = await this.client.post<ApiResponse<AuthTokenDto>>(
              '/api/auth/refresh-token'
            )

            if (response.data.success && response.data.data) {
              const { accessToken } = response.data.data
              this.setAuthToken(accessToken)
              isRefreshing = false
              onTokenRefreshed(accessToken)

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`
              }

              return this.client(originalRequest)
            } else {
              throw new Error('Token refresh failed')
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            isRefreshing = false
            refreshSubscribers = []
            this.clearAuthToken()

            if (globalThis.window !== undefined) {
              globalThis.window.location.href = '/login'
            }

            throw new Error('Token refresh failed')
          }
        }

        throw this.handleError(error)
      }
    )
  }

  private handleError(error: AxiosError<ApiError>) {
    if (error.response?.data) {
      return error.response.data
    }

    return {
      type: 'about:blank',
      title: 'Lỗi kết nối',
      status: 0,
      detail: error.message || 'Không thể kết nối với máy chủ',
      instance: '',
    } as ApiError
  }

  private getAuthToken(): string | null {
    if (globalThis.window !== undefined) {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }
    return null
  }

  private setAuthToken(token: string): void {
    if (globalThis.window !== undefined) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    }
  }

  private clearAuthToken(): void {
    if (globalThis.window !== undefined) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  public getAxiosInstance(): AxiosInstance {
    return this.client
  }

  public setToken(token: string): void {
    this.setAuthToken(token)
  }

  public clearToken(): void {
    this.clearAuthToken()
  }
}

export const apiClient = new ApiClient()
export const axiosInstance = apiClient.getAxiosInstance()
export default apiClient
