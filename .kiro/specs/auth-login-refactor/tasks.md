# Implementation Plan

- [x] 1. Set up configuration layer for authentication





  - Add AUTH constants object to `src/config/constants.ts` with ENDPOINTS, MESSAGES, and TOKEN configuration
  - Update STORAGE_KEYS to include AUTH_STORAGE constant
  - Verify all constants are properly typed and exported
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create centralized API endpoints configuration





  - Create `src/lib/api/endpoints.ts` file if it doesn't exist
  - Import AUTH.ENDPOINTS from constants and add to API_ENDPOINTS object
  - Export API_ENDPOINTS with proper typing
  - _Requirements: 1.1, 3.2_

- [x] 3. Refactor auth service with error handling





- [x] 3.1 Update auth service imports


  - Replace hardcoded endpoint strings with API_ENDPOINTS references
  - Import handleError from error handler
  - Import AUTH constants for messages
  - _Requirements: 1.1, 2.1, 3.1, 3.3_

- [x] 3.2 Add error handling to login method


  - Wrap login API call in try-catch with handleError
  - Use AUTH.MESSAGES.LOGIN_FAILED for custom error message
  - Add context parameter for error tracking
  - _Requirements: 2.1, 2.2, 2.5_


- [x] 3.3 Add error handling to register method

  - Wrap register API call in try-catch with handleError
  - Use AUTH.MESSAGES.REGISTER_FAILED for custom error message
  - Add context parameter for error tracking
  - _Requirements: 2.1, 2.2, 2.5_

- [x] 3.4 Add error handling to remaining auth service methods


  - Update logout, getCurrentUser, refreshToken, confirmEmail, resendEmailConfirmation, forgotPassword, resetPassword, and activateTeacher methods
  - Add appropriate error handling and context to each method
  - Use constants for all error messages
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Optimize auth store implementation





- [x] 4.1 Update store action naming for DevTools


  - Add action names as third parameter to all set() calls
  - Use format 'auth/actionName' for consistency
  - Verify DevTools tracking works correctly
  - _Requirements: 4.4, 4.5_

- [x] 4.2 Update storage key to use constant


  - Replace hardcoded 'auth-storage' with STORAGE_KEYS.AUTH_STORAGE
  - Verify persistence still works correctly
  - _Requirements: 1.2, 4.3_


- [x] 4.3 Verify selector exports are optimized

  - Ensure all selectors return only the specific state slice needed
  - Test that components using selectors don't re-render unnecessarily
  - _Requirements: 4.2, 10.1_

- [ ]* 4.4 Write unit tests for auth store
  - Test login action updates state correctly
  - Test logout clears all state
  - Test updateUser merges user data
  - Test persistence partialize function
  - _Requirements: 8.2_

- [x] 5. Enhance useAuth hook with proper error handling





- [x] 5.1 Add toast notifications to login flow


  - Import toast from sonner
  - Add success toast with AUTH.MESSAGES.LOGIN_SUCCESS
  - Remove manual error handling (let handleError manage it)
  - _Requirements: 2.2, 2.5_



- [x] 5.2 Add toast notifications to register flow

  - Add success toast with AUTH.MESSAGES.REGISTER_SUCCESS
  - Remove manual error handling (let handleError manage it)
  - _Requirements: 2.2, 2.5_


- [x] 5.3 Add navigation after successful operations

  - Import useRouter from next/navigation
  - Navigate to ROUTES.DASHBOARD.HOME after login
  - Navigate to ROUTES.AUTH.VERIFY_EMAIL after register
  - Navigate to ROUTES.AUTH.LOGIN after logout
  - _Requirements: 1.4_

- [x] 5.4 Update error handling in hook methods


  - Use handleError for all catch blocks
  - Pass appropriate context for each operation
  - Set showToast: true for user-facing errors
  - Return consistent error response format
  - _Requirements: 2.1, 2.2, 2.5_

- [ ]* 5.5 Write unit tests for useAuth hook
  - Test successful login flow
  - Test failed login with error handling
  - Test successful register flow
  - Test logout flow
  - _Requirements: 8.2_

- [x] 6. Update LoginForm component for design system compliance





- [x] 6.1 Replace hardcoded colors with CSS variables


  - Update all color references to use var(--color-name) syntax
  - Use --color-border-main for borders
  - Use --color-error for error messages
  - Use --text-primary and --text-secondary for text
  - _Requirements: 5.1, 5.5_

- [x] 6.2 Update Button component usage


  - Use variant="primary" for submit button
  - Add size="lg" for proper sizing
  - Add shadow-brutal class for neo-brutalist shadow
  - Ensure Vietnamese text is used
  - _Requirements: 5.2, 5.5_

- [x] 6.3 Update Input component styling


  - Add border-3 class for proper border width
  - Add border-[var(--color-border-main)] for border color
  - Ensure proper rounded corners (rounded-xl)
  - _Requirements: 5.3, 5.5_

- [x] 6.4 Verify form validation and error display


  - Ensure error messages use CSS variables for color
  - Verify Vietnamese error messages from Zod schema
  - Test form submission with validation errors
  - _Requirements: 5.5, 7.4_

- [x] 7. Update SignupForm component for design system compliance





- [x] 7.1 Replace hardcoded colors with CSS variables


  - Update all color references to use var(--color-name) syntax
  - Use design system colors throughout
  - _Requirements: 5.1, 5.5_

- [x] 7.2 Update Button and Input components


  - Apply same design system patterns as LoginForm
  - Use proper variants and sizes
  - Add brutal shadows
  - _Requirements: 5.2, 5.3_

- [x] 7.3 Ensure Vietnamese localization


  - Verify all labels are in Vietnamese
  - Verify all placeholders are in Vietnamese
  - Verify all button text is in Vietnamese
  - _Requirements: 5.5_

- [x] 8. Update remaining auth components





- [x] 8.1 Update ForgotPasswordContent component


  - Apply CSS variables for colors
  - Update Button and Input usage
  - Ensure Vietnamese text
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 8.2 Update ResetPasswordContent component


  - Apply CSS variables for colors
  - Update Button and Input usage
  - Ensure Vietnamese text
  - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [x] 8.3 Update ConfirmEmailContent component


  - Apply CSS variables for colors
  - Update Button usage
  - Ensure Vietnamese text
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 8.4 Update VerifyEmailContent component


  - Apply CSS variables for colors
  - Update Button usage
  - Ensure Vietnamese text
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 9. Update auth layout components





- [x] 9.1 Review and update AuthDivider component


  - Ensure CSS variables are used
  - Verify design system compliance
  - _Requirements: 5.1_

- [x] 9.2 Review and update AuthSocialButton component


  - Apply CSS variables for colors
  - Update Button component usage with proper variant
  - Add brutal shadow styling
  - _Requirements: 5.1, 5.2_


- [x] 9.3 Review auth page layouts

  - Verify Card components use proper variants
  - Ensure proper spacing and shadows
  - Check responsive design
  - _Requirements: 5.4_

- [x] 10. Type safety improvements





- [x] 10.1 Review and update auth types


  - Ensure all API request types are properly defined
  - Ensure all API response types are properly defined
  - Remove any 'any' types
  - _Requirements: 7.1, 7.2, 7.5_

- [x] 10.2 Add proper typing to form data


  - Verify Zod schemas are properly typed
  - Ensure form data uses inferred types from Zod
  - _Requirements: 7.4_

- [x] 10.3 Verify store typing


  - Ensure all store state is properly typed
  - Ensure all actions have proper parameter types
  - Ensure selectors have proper return types
  - _Requirements: 7.3_

- [ ]* 11. Write integration tests
- [ ]* 11.1 Write login flow integration test
  - Test successful login with valid credentials
  - Test failed login with invalid credentials
  - Test token storage after login
  - _Requirements: 8.3_

- [ ]* 11.2 Write registration flow integration test
  - Test successful registration
  - Test validation errors
  - Test duplicate email handling
  - _Requirements: 8.3_

- [ ]* 11.3 Write token refresh integration test
  - Test automatic token refresh
  - Test refresh failure handling
  - Test request queuing during refresh
  - _Requirements: 8.3_

- [ ] 12. Update documentation
- [ ] 12.1 Update auth feature README
  - Document the refactored architecture
  - Update usage examples with new patterns
  - Document error handling approach
  - Add migration notes if needed
  - _Requirements: 9.2, 9.3, 9.5_

- [ ] 12.2 Add JSDoc comments to public APIs
  - Add JSDoc to auth service methods
  - Add JSDoc to useAuth hook
  - Add JSDoc to store actions
  - _Requirements: 9.2_

- [ ] 12.3 Update inline code comments
  - Review complex logic and add WHY comments
  - Remove unnecessary WHAT comments
  - Ensure comments are up to date
  - _Requirements: 9.1_

- [ ] 13. Performance optimization verification
- [ ] 13.1 Test selector performance
  - Verify components only re-render when their selected state changes
  - Use React DevTools Profiler to measure re-renders
  - Optimize any components with unnecessary re-renders
  - _Requirements: 10.1_

- [ ] 13.2 Verify lazy loading opportunities
  - Identify heavy auth components that can be lazy loaded
  - Implement dynamic imports where appropriate
  - Test loading states
  - _Requirements: 10.2_

- [ ] 13.3 Review API call optimization
  - Verify timeout configurations are set
  - Verify retry logic is working
  - Test request queuing during token refresh
  - _Requirements: 10.3, 10.5_

- [ ] 14. Final integration and testing
- [ ] 14.1 Test complete login flow end-to-end
  - Test login with valid credentials
  - Test navigation after login
  - Test token persistence
  - Test logout flow
  - _Requirements: All_

- [ ] 14.2 Test complete registration flow end-to-end
  - Test registration with valid data
  - Test email verification flow
  - Test navigation after registration
  - _Requirements: All_

- [ ] 14.3 Test error scenarios
  - Test network errors
  - Test validation errors
  - Test authentication errors
  - Verify error messages are in Vietnamese
  - Verify toast notifications appear
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.5_

- [ ] 14.4 Test design system compliance
  - Verify all components use CSS variables
  - Verify all buttons use proper variants
  - Verify all inputs have proper styling
  - Verify brutal shadows are applied correctly
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [ ] 14.5 Run diagnostics and fix any issues
  - Run TypeScript type checking
  - Run ESLint
  - Fix any errors or warnings
  - _Requirements: 7.5, 9.4_
