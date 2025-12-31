// Auth Feature Public API
// Export only what external modules need

// ============= Components =============
export {
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  AuthLayout,
  AuthHighlights,
  AuthIllustration,
  AuthDivider,
  AuthField,
  AuthSocialButton,
  PasswordToggle,
  ConfirmEmailForm,
  VerifyEmailForm,
  ResetPasswordForm,
  FloatingStationery,
} from './components'

// ============= Hooks =============
export { useAuth } from './hooks/use-auth'
export { usePasswordRecovery } from './hooks/use-password-recovery'

// ============= Store & Selectors =============
export {
  useAuthStore,
  selectUser,
  selectToken,
  selectRefreshToken,
  selectTokenExpiry,
  selectLastActivity,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthActions
} from './stores/auth.store'

// ============= API Service =============
export { authService } from './api/auth-service'
export { passwordService } from './lib/password-service'

// ============= Constants =============
export { DEFAULT_SOCIAL_PROVIDERS } from './lib/social-providers'

// ============= Types =============
export type {
  User,
  AuthState,
  AuthTokenDto,
  UserDto,
  LoginRequest,
  RegisterRequest
} from './types'
