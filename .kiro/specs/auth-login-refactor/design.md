# Auth/Login Refactor Design Document

## Overview

This design document outlines the comprehensive refactoring of the authentication and login feature to fully align with the ThinkTogether frontend architecture. The refactor focuses on eliminating magic strings, implementing proper error handling, optimizing state management, and ensuring design system compliance while maintaining backward compatibility with existing functionality.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ LoginContent │  │ SignupContent│  │ Other Auth   │      │
│  │              │  │              │  │ Components   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                     Business Logic Layer                     │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │   useAuth()    │                        │
│                    │     Hook       │                        │
│                    └───────┬────────┘                        │
│                            │                                 │
│         ┌──────────────────┼──────────────────┐              │
│         │                  │                  │              │
│  ┌──────▼───────┐  ┌──────▼───────┐  ┌──────▼───────┐      │
│  │  Auth Store  │  │ Auth Service │  │Error Handler │      │
│  │   (Zustand)  │  │              │  │              │      │
│  └──────────────┘  └──────┬───────┘  └──────────────┘      │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                      Infrastructure Layer                    │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │   API Client   │                        │
│                    │   (Axios)      │                        │
│                    └───────┬────────┘                        │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │  Backend API   │                        │
│                    └────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction** → Component triggers action
2. **Component** → Calls useAuth hook method
3. **useAuth Hook** → Orchestrates business logic
4. **Auth Service** → Makes API call via API Client
5. **API Client** → Sends HTTP request with interceptors
6. **Backend Response** → Returns through API Client
7. **Error Handler** → Processes any errors
8. **Auth Store** → Updates state
9. **Component** → Re-renders with new state

## Components and Interfaces

### 1. Configuration Layer Updates

#### File: `src/config/constants.ts`

Add authentication-specific constants:

```typescript
export const AUTH = {
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    CONFIRM_EMAIL: '/api/auth/confirm-email',
    RESEND_CONFIRMATION: '/api/auth/resend-email-confirmation',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    ACTIVATE_TEACHER: '/api/auth/activate-teacher',
  },
  MESSAGES: {
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGIN_FAILED: 'Đăng nhập thất bại',
    REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.',
    REGISTER_FAILED: 'Đăng ký thất bại',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    EMAIL_SENT: 'Email đã được gửi!',
    PASSWORD_RESET_SUCCESS: 'Mật khẩu đã được đặt lại thành công!',
    TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  },
  TOKEN: {
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
    MAX_RETRY_ATTEMPTS: 3,
  },
} as const;
```

### 2. API Layer Refactoring

#### File: `src/lib/api/endpoints.ts`

Centralize all API endpoints:

```typescript
import { AUTH } from '@/config/constants';

export const API_ENDPOINTS = {
  AUTH: AUTH.ENDPOINTS,
  // ... other feature endpoints
} as const;
```

#### File: `src/features/auth/api/auth.service.ts`

Refactored service with proper error handling:

```typescript
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleError } from '@/lib/errors/error-handler';
import { AUTH } from '@/config/constants';
import type {
  ApiResponse,
  AuthTokenDto,
  UserDto,
  LoginRequest,
  RegisterRequest,
} from '@/types/api';

class AuthService {
  async login(
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<ApiResponse<AuthTokenDto>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthTokenDto>>(
        API_ENDPOINTS.AUTH.LOGIN,
        { email, password, rememberMe } as LoginRequest
      );
      return response.data;
    } catch (error) {
      throw handleError(error, {
        context: 'Auth Login',
        customMessage: AUTH.MESSAGES.LOGIN_FAILED,
      });
    }
  }

  async register(data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<AuthTokenDto>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthTokenDto>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data as RegisterRequest
      );
      return response.data;
    } catch (error) {
      throw handleError(error, {
        context: 'Auth Register',
        customMessage: AUTH.MESSAGES.REGISTER_FAILED,
      });
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      handleError(error, {
        context: 'Auth Logout',
        showToast: false, // Don't show error on logout
      });
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserDto>> {
    try {
      const response = await apiClient.get<ApiResponse<UserDto>>(
        API_ENDPOINTS.AUTH.ME
      );
      return response.data;
    } catch (error) {
      throw handleError(error, {
        context: 'Get Current User',
      });
    }
  }

  async refreshToken(): Promise<ApiResponse<AuthTokenDto>> {
    try {
      const response = await apiClient.post<ApiResponse<AuthTokenDto>>(
        API_ENDPOINTS.AUTH.REFRESH_TOKEN
      );
      return response.data;
    } catch (error) {
      throw handleError(error, {
        context: 'Token Refresh',
        customMessage: AUTH.MESSAGES.TOKEN_EXPIRED,
      });
    }
  }

  // ... other methods with similar error handling
}

export const authService = new AuthService();
```

### 3. State Management Optimization

#### File: `src/features/auth/store/auth.store.ts`

Optimized store following best practices:

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/config/constants';
import type { User, AuthState } from '@/types';

interface AuthStore extends AuthState {
  refreshToken: string | null;
  tokenExpiry: number | null;
  lastActivity: number | null;
  
  actions: {
    login: (user: User, token: string, refreshToken?: string, expiresIn?: number) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
    setLoading: (loading: boolean) => void;
    updateLastActivity: () => void;
    clearSession: () => void;
  };
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
          login: (user, token, refreshToken, expiresIn) => {
            const expiry = expiresIn ? Date.now() + expiresIn * 1000 : null;
            
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
            );

            // Sync with localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
              if (refreshToken) {
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
              }
            }
          },

          logout: () => {
            get().actions.clearSession();
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
            );

            if (typeof window !== 'undefined') {
              localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
              localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            }
          },

          updateUser: (userData) => {
            const currentUser = get().user;
            if (currentUser) {
              set(
                { user: { ...currentUser, ...userData } },
                false,
                'auth/updateUser'
              );
            }
          },

          setLoading: (loading) => {
            set({ isLoading: loading }, false, 'auth/setLoading');
          },
          
          updateLastActivity: () => {
            set({ lastActivity: Date.now() }, false, 'auth/updateLastActivity');
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
);

// Optimized selectors
export const selectUser = (state: AuthStore) => state.user;
export const selectToken = (state: AuthStore) => state.token;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectAuthActions = (state: AuthStore) => state.actions;
```

### 4. Business Logic Layer

#### File: `src/features/auth/hooks/use-auth.ts`

Enhanced hook with proper error handling:

```typescript
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore, selectAuthActions, selectUser, selectIsAuthenticated, selectIsLoading } from '../store/auth.store';
import { authService } from '../api/auth.service';
import { apiClient } from '@/lib/api/client';
import { handleError } from '@/lib/errors/error-handler';
import { AUTH, ROUTES } from '@/config/constants';
import type { LoginFormData, RegisterFormData } from '@/lib/validators';
import type { User } from '../types';

export function useAuth() {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectIsLoading);
  const { login: loginAction, logout: logoutAction, setLoading } = useAuthStore(selectAuthActions);

  const handleLogin = useCallback(async (data: LoginFormData & { rememberMe?: boolean }) => {
    try {
      setLoading(true);
      
      const response = await authService.login(
        data.email,
        data.password,
        data.rememberMe || false
      );
      
      if (response.success && response.data) {
        const { accessToken } = response.data;
        apiClient.setToken(accessToken);

        const userResponse = await authService.getCurrentUser();
        
        if (userResponse.success && userResponse.data) {
          const userDto = userResponse.data;
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
          };
          
          loginAction(user, accessToken);
          toast.success(AUTH.MESSAGES.LOGIN_SUCCESS);
          router.push(ROUTES.DASHBOARD.HOME);
          
          return { success: true };
        }
      }
      
      return { 
        success: false, 
        error: response.message || AUTH.MESSAGES.LOGIN_FAILED
      };
    } catch (error) {
      const handledError = handleError(error, {
        context: 'Login',
        showToast: true,
      });
      
      return {
        success: false,
        error: handledError.message,
      };
    } finally {
      setLoading(false);
    }
  }, [loginAction, setLoading, router]);

  const handleRegister = useCallback(async (data: RegisterFormData) => {
    try {
      setLoading(true);
      
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const response = await authService.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName,
        lastName,
      });
      
      if (response.success) {
        toast.success(AUTH.MESSAGES.REGISTER_SUCCESS);
        router.push(ROUTES.AUTH.VERIFY_EMAIL);
        
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.message || AUTH.MESSAGES.REGISTER_FAILED
      };
    } catch (error) {
      const handledError = handleError(error, {
        context: 'Register',
        showToast: true,
      });
      
      return {
        success: false,
        error: handledError.message,
      };
    } finally {
      setLoading(false);
    }
  }, [setLoading, router]);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
      apiClient.clearToken();
      logoutAction();
      toast.success(AUTH.MESSAGES.LOGOUT_SUCCESS);
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      handleError(error, {
        context: 'Logout',
        showToast: false,
      });
      // Still clear session even if API call fails
      logoutAction();
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [logoutAction, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
```

### 5. Presentation Layer Updates

#### Component Structure

All auth components will be updated to:
- Use CSS variables instead of hardcoded colors
- Use proper Button variants with brutal shadows
- Use proper Input components with design system styling
- Display all text in Vietnamese
- Use optimized selectors for state access

#### Example: LoginForm Component

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { useAuth } from '../../hooks/use-auth';
import { loginSchema, type LoginFormData } from '@/lib/validators';

export function LoginForm() {
  const { login, isLoading } = useAuth();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          {...form.register('email')}
          className="border-3 border-[var(--color-border-main)]"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-[var(--color-error)]">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...form.register('password')}
          className="border-3 border-[var(--color-border-main)]"
        />
        {form.formState.errors.password && (
          <p className="text-sm text-[var(--color-error)]">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            {...form.register('rememberMe')}
          />
          <Label htmlFor="rememberMe" className="text-sm">
            Ghi nhớ đăng nhập
          </Label>
        </div>
        
        <Button variant="link" size="sm" type="button">
          Quên mật khẩu?
        </Button>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full shadow-brutal"
        disabled={isLoading}
      >
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>
    </form>
  );
}
```

## Data Models

### User Model

```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: 'Student' | 'Teacher' | 'Admin';
  isEmailVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}
```

### Auth State Model

```typescript
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### API Request/Response Models

```typescript
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokenDto {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}
```

## Error Handling

### Error Flow

1. **API Error Occurs** → Axios interceptor catches error
2. **Error Handler** → Processes error and creates appropriate error object
3. **Custom Error Class** → Typed error with context
4. **Toast Notification** → User-friendly Vietnamese message
5. **Error Logging** → Console/Sentry logging for debugging

### Error Types

```typescript
// Validation errors
throw new ValidationError('Email không hợp lệ');

// Authentication errors
throw new AuthenticationError('Phiên đăng nhập đã hết hạn');

// Network errors
throw new NetworkError('Không thể kết nối đến máy chủ');

// Generic API errors
throw new ApiError('Đã xảy ra lỗi', { statusCode: 500 });
```

### Error Messages

All error messages will be centralized in `AUTH.MESSAGES` and displayed in Vietnamese.

## Testing Strategy

### Unit Tests

1. **Auth Service Tests**
   - Test each API method with mock responses
   - Test error handling scenarios
   - Test request payload formatting

2. **Auth Store Tests**
   - Test state updates
   - Test action dispatching
   - Test persistence logic
   - Test selector optimization

3. **useAuth Hook Tests**
   - Test login flow
   - Test register flow
   - Test logout flow
   - Test error handling

### Integration Tests

1. **Login Flow**
   - Test successful login
   - Test invalid credentials
   - Test network errors
   - Test token storage

2. **Registration Flow**
   - Test successful registration
   - Test validation errors
   - Test duplicate email handling

3. **Token Refresh**
   - Test automatic token refresh
   - Test refresh failure handling
   - Test request queuing during refresh

### Component Tests

1. **LoginForm**
   - Test form validation
   - Test form submission
   - Test error display
   - Test loading states

2. **SignupForm**
   - Test form validation
   - Test password matching
   - Test form submission

## Migration Strategy

### Phase 1: Configuration Layer (Day 1)
- Add AUTH constants to `config/constants.ts`
- Update STORAGE_KEYS
- Add AUTH.MESSAGES

### Phase 2: API Layer (Day 1-2)
- Create `lib/api/endpoints.ts`
- Refactor `auth.service.ts` to use constants
- Add error handling to all methods
- Update type imports

### Phase 3: State Management (Day 2)
- Update auth store with proper naming
- Add DevTools action names
- Optimize selectors
- Update persistence configuration

### Phase 4: Business Logic (Day 2-3)
- Refactor useAuth hook
- Add proper error handling
- Add toast notifications
- Add navigation logic

### Phase 5: UI Components (Day 3-4)
- Update all auth components to use CSS variables
- Update Button usage with proper variants
- Update Input styling
- Ensure Vietnamese text throughout

### Phase 6: Testing (Day 4-5)
- Write unit tests for service
- Write unit tests for store
- Write unit tests for hook
- Write component tests

### Phase 7: Documentation (Day 5)
- Update README
- Add JSDoc comments
- Update usage examples

## Performance Considerations

1. **Selector Optimization**: Use fine-grained selectors to prevent unnecessary re-renders
2. **Lazy Loading**: Lazy load auth components that aren't immediately needed
3. **Request Deduplication**: Prevent duplicate API calls during token refresh
4. **Memoization**: Memoize expensive computations in hooks
5. **Bundle Size**: Ensure auth feature doesn't bloat the main bundle

## Security Considerations

1. **Token Storage**: Store tokens in localStorage with proper key names
2. **Token Expiry**: Implement automatic token refresh before expiry
3. **Secure Communication**: All API calls use HTTPS in production
4. **Input Validation**: Validate all user inputs with Zod schemas
5. **XSS Protection**: Use React's built-in escaping for user data

## Design Decisions

### Why Zustand over Context API?
- Better performance with selective subscriptions
- Built-in DevTools support
- Simpler API for complex state
- Better TypeScript support

### Why Centralized Error Handling?
- Consistent error messages across the app
- Easier to add logging/monitoring
- Reduces code duplication
- Better user experience

### Why Configuration Layer?
- Eliminates magic strings
- Makes the app more configurable
- Easier to maintain and update
- Better for testing

### Why Separate Service Layer?
- Clear separation of concerns
- Easier to test
- Reusable across features
- Better type safety

---

**Requirements Addressed**: All requirements (1-10) are addressed in this design.

**Next Steps**: Create implementation tasks based on this design.
