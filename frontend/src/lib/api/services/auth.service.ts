/**
 * Auth API Service
 * 
 * Handles all authentication-related API calls.
 * Uses the centralized API client and endpoints.
 */

import { api } from '../client';
import { AUTH_ENDPOINTS } from '../endpoints';
import type {

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
    const response = await api.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      data
    );

    // Store tokens
    api.setToken(response.accessToken, response.refreshToken);
    return response;
  }

  /**
   * Sign up new user
   */
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await api.post<SignupResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );

    return response;

    // Response handled by error interceptor
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
    const response = await api.get<User>(
      AUTH_ENDPOINTS.GET_PROFILE
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>(
      AUTH_ENDPOINTS.UPDATE_PROFILE,
      data
    );

    return response;

    // Response handled by error interceptor
  }

  /**
   * Send forgot password email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await api.post<void>(
      AUTH_ENDPOINTS.FORGOT_PASSWORD,
      data
    );
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await api.post<void>(
      AUTH_ENDPOINTS.RESET_PASSWORD,
      data
    );
  }

  /**
   * Change password (authenticated)
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await api.post<void>(
      AUTH_ENDPOINTS.CHANGE_PASSWORD,
      data
    );
  }

  /**
   * Verify email with token
   */
  async verifyEmail(data: VerifyEmailRequest): Promise<void> {
    await api.post<void>(
      AUTH_ENDPOINTS.CONFIRM_EMAIL,
      data
    );
  }

  /**
   * Confirm email
   */
  async confirmEmail(token: string): Promise<void> {
    await api.post<void>(
      AUTH_ENDPOINTS.CONFIRM_EMAIL,
      { token }
    );
  }

  /**
   * Resend verification email
   */
  async resendVerification(): Promise<void> {
    await api.post<void>(
      AUTH_ENDPOINTS.RESEND_CONFIRMATION
    );
  }

  /**
   * Activate creator role
   */
  async becomeCreator(): Promise<void> {
    await api.post<void>(
      AUTH_ENDPOINTS.BECOME_CREATOR
    );
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

