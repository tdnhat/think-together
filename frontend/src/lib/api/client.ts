/**
 * API Client
 * 
 * Centralized Axios client with interceptors, error handling, and token management.
 * Uses configuration from @/config instead of magic strings.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/config/env';
import { API, AUTH } from '@/config/constants';
import { ROUTES } from '@/config/constants';
import { parseAxiosError } from '@/lib/errors/error-handler';
import type { ApiResponse, ApiError } from '@/types/api';

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

class TokenManager {
  private static instance: TokenManager;
  
  private constructor() {}
  
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }
  
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH.TOKEN_KEY);
  }
  
  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH.TOKEN_KEY, token);
  }
  
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH.REFRESH_TOKEN_KEY);
  }
  
  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH.REFRESH_TOKEN_KEY, token);
  }
  
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH.TOKEN_KEY);
    localStorage.removeItem(AUTH.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH.USER_KEY);
  }
  
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiryTime - AUTH.TOKEN_EXPIRY_BUFFER;
    } catch {
      return true;
    }
  }
}

// ============================================================================
// REFRESH TOKEN QUEUE
// ============================================================================

class RefreshTokenQueue {
  private isRefreshing = false;
  private subscribers: ((token: string) => void)[] = [];
  
  subscribe(callback: (token: string) => void): void {
    this.subscribers.push(callback);
  }
  
  notify(token: string): void {
    this.subscribers.forEach((callback) => callback(token));
    this.subscribers = [];
  }
  
  setRefreshing(value: boolean): void {
    this.isRefreshing = value;
  }
  
  getRefreshing(): boolean {
    return this.isRefreshing;
  }
  
  clear(): void {
    this.subscribers = [];
    this.isRefreshing = false;
  }
}

// ============================================================================
// API CLIENT CLASS
// ============================================================================

class ApiClient {
  private client: AxiosInstance;
  private tokenManager: TokenManager;
  private refreshQueue: RefreshTokenQueue;
  
  constructor() {
    this.tokenManager = TokenManager.getInstance();
    this.refreshQueue = new RefreshTokenQueue();
    
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: API.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    
    this.setupInterceptors();
  }
  
  // ==========================================================================
  // INTERCEPTORS
  // ==========================================================================
  
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => this.handleRequest(config),
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => this.handleResponse(response),
      (error) => this.handleResponseError(error)
    );
  }
  
  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    const token = this.tokenManager.getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (env.isDevelopment) {
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  }
  
  private handleResponse(response: AxiosResponse): AxiosResponse {
    // Log response in development
    if (env.isDevelopment) {
      console.log('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  }
  
  private async handleResponseError(error: AxiosError<ApiError>): Promise<never> {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    
    // Check if this is the refresh token endpoint itself
    const isRefreshEndpoint = originalRequest.url?.includes('/api/auth/refresh-token');
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If this is the refresh endpoint itself returning 401, don't retry - just logout
      if (isRefreshEndpoint) {
        this.handleAuthenticationFailure();
        const appError = parseAxiosError(error);
        throw appError;
      }
      
      // If already refreshing, queue this request
      if (this.refreshQueue.getRefreshing()) {
        return new Promise((resolve) => {
          this.refreshQueue.subscribe((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(this.client(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      this.refreshQueue.setRefreshing(true);
      
      try {
        const newToken = await this.refreshAccessToken();
        this.refreshQueue.notify(newToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return this.client(originalRequest);
      } catch (refreshError) {
        this.refreshQueue.clear();
        this.handleAuthenticationFailure();
        throw refreshError;
      } finally {
        this.refreshQueue.setRefreshing(false);
      }
    }
    
    // Parse and throw the error
    const appError = parseAxiosError(error);
    throw appError;
  }
  
  // ==========================================================================
  // TOKEN REFRESH
  // ==========================================================================
  
  private async refreshAccessToken(): Promise<string> {
    try {
      // Prevent infinite loop - if refresh endpoint returns 401, don't retry
      const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
        `${env.apiUrl}/api/auth/refresh-token`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;
        this.tokenManager.setAccessToken(accessToken);
        this.tokenManager.setRefreshToken(refreshToken);
        return accessToken;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      this.tokenManager.clearTokens();
      throw error;
    }
  }
  
  private handleAuthenticationFailure(): void {
    // Clear tokens first
    this.tokenManager.clearTokens();
    
    if (typeof globalThis.window !== 'undefined') {
      // Clear all auth-related localStorage items
      try {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem(AUTH.TOKEN_KEY);
        localStorage.removeItem(AUTH.REFRESH_TOKEN_KEY);
        localStorage.removeItem(AUTH.USER_KEY);
      } catch {
        // Ignore errors if localStorage is not available
      }
      
      const currentPath = globalThis.window.location.pathname;
      const loginPath = ROUTES.AUTH.LOGIN;
      
      // Prevent infinite redirect loop
      if (currentPath === loginPath || currentPath.startsWith(loginPath)) {
        return;
      }
      
      // Use window.location.replace to prevent back button issues
      // This ensures user can't go back to the protected page
      const loginUrl = `${loginPath}?returnUrl=${encodeURIComponent(currentPath)}`;
      globalThis.window.location.replace(loginUrl);
    }
  }
  
  // ==========================================================================
  // PUBLIC METHODS
  // ==========================================================================
  
  /**
   * Get the Axios instance for custom requests
   */
  getInstance(): AxiosInstance {
    return this.client;
  }
  
  /**
   * Set authentication token
   */
  setToken(accessToken: string, refreshToken?: string): void {
    this.tokenManager.setAccessToken(accessToken);
    if (refreshToken) {
      this.tokenManager.setRefreshToken(refreshToken);
    }
  }
  
  /**
   * Clear authentication tokens
   */
  clearToken(): void {
    this.tokenManager.clearTokens();
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.tokenManager.getAccessToken();
    return token !== null && !this.tokenManager.isTokenExpired(token);
  }
  
  /**
   * GET request
   */
  async get<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
  
  /**
   * POST request
   */
  async post<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
  
  /**
   * PUT request
   */
  async put<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }
  
  /**
   * PATCH request
   */
  async patch<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
  
  /**
   * DELETE request
   */
  async delete<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
  
  /**
   * Upload file with progress tracking
   */
  async upload<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    
    return response.data;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const apiClient = new ApiClient();

// Export convenience methods
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  patch: apiClient.patch.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  upload: apiClient.upload.bind(apiClient),
  setToken: apiClient.setToken.bind(apiClient),
  clearToken: apiClient.clearToken.bind(apiClient),
  isAuthenticated: apiClient.isAuthenticated.bind(apiClient),
};

export default apiClient;

