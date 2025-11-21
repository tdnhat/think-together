# Auth Feature Module

This module handles all authentication-related functionality for the ThinkTogether application, following **feature-based architecture** best practices inspired by bulletproof-react and feature-sliced design.

## Structure

```
auth/
├── api/                    # 🔌 API service layer
│   └── auth-service.ts     # Auth API calls
├── components/             # 🎨 Auth UI Components (FLAT structure)
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   ├── forgot-password-form.tsx
│   ├── verify-email-content.tsx
│   ├── confirm-email-content.tsx
│   ├── reset-password-content.tsx
│   ├── auth-layout.tsx
│   ├── auth-highlights.tsx
│   ├── auth-illustration.tsx
│   ├── auth-divider.tsx
│   ├── auth-field.tsx
│   ├── auth-social-button.tsx
│   ├── password-toggle.tsx
│   └── index.ts            # Component exports
├── hooks/                  # 🪝 Custom hooks
│   ├── use-auth.ts
│   └── use-password-recovery.ts
├── lib/                    # 🛠️ Utilities and services
│   ├── password-service.ts
│   └── social-providers.ts
├── stores/                 # 📦 State management
│   └── auth-store.ts       # Zustand store with selectors
├── types/                  # 📝 TypeScript types
│   └── index.ts
├── constants.ts            # 🔧 Auth constants
├── index.ts                # 📤 Public API exports
└── README.md               # 📖 This file
```

## Key Improvements (Following Best Practices)

### ✅ Flat Component Structure
- **Before**: `components/core/forms/LoginForm.tsx`, `components/shared/shared/AuthField.tsx`
- **After**: `components/login-form.tsx`, `components/auth-field.tsx`
- **Why**: Reduces complexity, easier navigation, follows bulletproof-react pattern

### ✅ Separation of Concerns
- **Components**: Pure UI components (no business logic)
- **Hooks**: Business logic and state access
- **Lib**: Utility functions and services
- **Stores**: Zustand state management
- **API**: HTTP requests

### ✅ Consistent Naming
- Use kebab-case for file names: `auth-store.ts`, `login-form.tsx`
- Use PascalCase for component names: `LoginForm`, `AuthLayout`

### ✅ Public API Pattern
- All exports go through `index.ts`
- External modules import from `@/features/auth`
- Internal structure can change without breaking imports

## Public API

```typescript
// ============= Components =============
import { 
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  VerifyEmailContent,
  ConfirmEmailContent,
  ResetPasswordContent,
  AuthLayout,
  AuthHighlights,
  AuthIllustration,
  AuthDivider,
  AuthField,
  AuthSocialButton,
  PasswordToggle 
} from '@/features/auth'

// ============= Hooks =============
import { 
  useAuth,
  usePasswordRecovery 
} from '@/features/auth'

// ============= Store & Selectors =============
import {
  useAuthStore,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthActions
} from '@/features/auth'

// ============= Services =============
import { 
  authService,
  passwordService 
} from '@/features/auth'

// ============= Constants =============
import { 
  DEFAULT_SOCIAL_PROVIDERS 
} from '@/features/auth'

// ============= Types =============
import type { 
  User,
  AuthState,
  AuthTokenDto,
  LoginRequest,
  RegisterRequest 
} from '@/features/auth'
```

## Usage Examples

### Using Components

```typescript
// ✅ Good: Import from feature public API
import { LoginForm, AuthLayout } from '@/features/auth'

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back!">
      <LoginForm />
    </AuthLayout>
  )
}

// ❌ Bad: Import from deep paths
import { LoginForm } from '@/features/auth/components/login-form'
```

### Using Hooks

```typescript
import { useAuth } from '@/features/auth'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    })
    
    if (result.success) {
      // Handle success
    }
  }

  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}!</p>}
    </div>
  )
}
```

### Using Store Selectors

```typescript
import { useAuthStore, selectUser, selectIsAuthenticated } from '@/features/auth'

function UserProfile() {
  // Only re-renders when user changes
  const user = useAuthStore(selectUser)
  
  return <div>{user?.email}</div>
}
```

## Feature Organization Philosophy

### Why Flat Structure?

1. **Easier Navigation**: No need to drill through multiple folders
2. **Clearer Intent**: File names are descriptive: `login-form.tsx` vs `forms/LoginForm.tsx`
3. **Scalability**: Adding new components doesn't create new folder hierarchies
4. **Industry Standard**: Follows patterns from bulletproof-react and feature-sliced design

### Why Separate Lib Folder?

- **Services** (`password-service.ts`): Business logic separate from components
- **Utilities** (`social-providers.ts`): Reusable constants and helpers
- **Testability**: Easier to test services independently

### Why Stores (plural)?

- Consistent with common patterns (`hooks/`, `components/`)
- Room for multiple stores if needed
- Clearer that it's a container for state management

## Architecture Benefits

- ✅ **Modular**: Each feature is self-contained
- ✅ **Scalable**: Easy to add new components/hooks
- ✅ **Maintainable**: Clear separation of concerns
- ✅ **Testable**: Pure functions and isolated logic
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Discoverable**: Flat structure is easy to explore

## Related

- **API Client**: `@/api/client.ts`
- **Validators**: `@/lib/validators.ts`
- **Global Types**: `@/types/api.ts`
- **Route Pages**: `app/(auth)/`

---

**Inspired by**: [bulletproof-react](https://github.com/alan2207/bulletproof-react) | [feature-sliced design](https://feature-sliced.design/)
