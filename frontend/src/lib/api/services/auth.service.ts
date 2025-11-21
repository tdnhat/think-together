/**
 * Auth API Service
 * 
 * Handles all authentication-related API calls.
 * Uses the centralized API client and endpoints.
 */

import { api } from '../client';
import { AUTH_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  User,
} from '../types';

// ============================================================================
// AUTH SERVICE
// ============================================================================

export class AuthService {
  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );
    
    if (response.success && response.data) {
      // Store tokens
      api.setToken(response.data.accessToken, response.data.refreshToken);
      return response.data;
    }
    
    throw new Error(response.message || 'Đăng nhập thất bại');
  }
  
  /**
   * Sign up new user
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await api.post<ApiResponse<SignupResponse>>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Đăng ký thất bại');
  }
  
  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      // Always clear tokens, even if API call fails
      api.clearToken();
    }
  }
  
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(
      AUTH_ENDPOINTS.GET_PROFILE
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải thông tin người dùng');
  }
  
  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      AUTH_ENDPOINTS.UPDATE_PROFILE,
      data
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Cập nhật thông tin thất bại');
  }
  
  /**
   * Send forgot password email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const response = await api.post<ApiResponse>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Gửi email thất bại');
    }
  }
  
  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await api.post<ApiResponse>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Đặt lại mật khẩu thất bại');
    }
  }
  
  /**
   * Change password (authenticated)
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    const response = await api.post<ApiResponse>(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Đổi mật khẩu thất bại');
    }
  }
  
  /**
   * Verify email with token
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<void> {
    const response = await api.post<ApiResponse>(
      AUTH_ENDPOINTS.CONFIRM_EMAIL,
      data
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Xác thực email thất bại');
    }
  }
  
  /**
   * Confirm email
   */
  async confirmEmail(token: string): Promise<void> {
    const response = await api.post<ApiResponse>(
      AUTH_ENDPOINTS.CONFIRM_EMAIL,
      { token }
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Xác nhận email thất bại');
    }
  }
  
  /**
   * Resend verification email
   */
  async resendVerification(): Promise<void> {
    const response = await api.post<ApiResponse>(
      AUTH_ENDPOINTS.RESEND_CONFIRMATION
    );
    
    if (!response.success) {
      throw new Error(response.message || 'Gửi lại email xác thực thất bại');
    }
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return api.isAuthenticated();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const authService = new AuthService();
export default authService;

