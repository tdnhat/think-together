# Use Case Diagrams - ThinkTogether

**Document Version:** 1.0  
**Date:** 03/10/2025  
**Reference:** actors-and-usecases.md

---

## Module 1: Authentication & User Management

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#e3f2fd','primaryTextColor':'#1976d2','primaryBorderColor':'#1976d2','lineColor':'#424242','secondaryColor':'#fff3e0','tertiaryColor':'#f5f5f5'}}}%%

graph TB
    %% Actors
    Creator([👤 Creator])
    System([⚙️ System])
    
    %% Use Cases - Authentication Module
    subgraph AuthModule["🔐 Authentication & User Management Module"]
        UC_AUTH_01[("UC-AUTH-01<br/>Register Creator Account")]
        UC_AUTH_02[("UC-AUTH-02<br/>Login to Account")]
        
        %% Sub use cases - included/extended
        ValidateEmail[("Validate Email<br/><<include>>")]
        ValidatePassword[("Validate Password<br/><<include>>")]
        CreateSession[("Create Session<br/><<include>>")]
        SendWelcomeEmail[("Send Welcome Email<br/><<extend>>")]
    end
    
    %% Relationships
    Creator -->|registers| UC_AUTH_01
    Creator -->|logs in| UC_AUTH_02
    
    UC_AUTH_01 -.->|includes| ValidateEmail
    UC_AUTH_01 -.->|includes| ValidatePassword
    UC_AUTH_01 -.->|extends| SendWelcomeEmail
    
    UC_AUTH_02 -.->|includes| CreateSession
    
    System -->|validates| ValidateEmail
    System -->|validates| ValidatePassword
    System -->|manages| CreateSession
    System -->|sends| SendWelcomeEmail
    
    %% Styling
    classDef actorStyle fill:#bbdefb,stroke:#1976d2,stroke-width:3px,color:#000
    classDef usecaseStyle fill:#fff9c4,stroke:#f57f17,stroke-width:2px,color:#000
    classDef includeStyle fill:#c8e6c9,stroke:#388e3c,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    classDef extendStyle fill:#ffccbc,stroke:#e64a19,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    
    class Creator,System actorStyle
    class UC_AUTH_01,UC_AUTH_02 usecaseStyle
    class ValidateEmail,ValidatePassword,CreateSession includeStyle
    class SendWelcomeEmail extendStyle
```

### Chi tiết Use Cases

#### **UC-AUTH-01: Register Creator Account**

```mermaid
sequenceDiagram
    actor Creator
    participant UI as Registration Form
    participant System
    participant DB as Database
    participant Email as Email Service
    
    Creator->>UI: Open Sign Up page
    Creator->>UI: Enter email & password
    UI->>System: Submit registration data
    
    System->>System: <<include>> Validate Email
    alt Email invalid or exists
        System-->>UI: Show error message
        UI-->>Creator: Display validation error
    end
    
    System->>System: <<include>> Validate Password
    alt Password too weak
        System-->>UI: Show strength requirements
        UI-->>Creator: Display password criteria
    end
    
    System->>DB: Create new Creator account
    DB-->>System: Account created successfully
    
    System->>System: <<include>> Create Session
    System->>System: Generate auth token
    
    opt Send Welcome Email
        System->>Email: <<extend>> Send Welcome Email
        Email-->>Creator: Welcome email sent
    end
    
    System-->>UI: Registration successful
    UI->>UI: Redirect to onboarding flow
    UI-->>Creator: Show onboarding tour
```

**Business Rules:**
- BR-23: Email must be unique in system
- BR-24: Password minimum 8 characters
- Email format validation: RFC 5322 compliant
- Password strength: Mix of uppercase, lowercase, numbers recommended

**Acceptance Criteria:**
- ✅ Email uniqueness validation with real-time feedback
- ✅ Password strength indicator displayed
- ✅ Clear error messages for validation failures
- ✅ Auto-login after successful registration
- ✅ Redirect to onboarding flow

---

#### **UC-AUTH-02: Login to Account**

```mermaid
sequenceDiagram
    actor Creator
    participant UI as Login Form
    participant System
    participant DB as Database
    participant Cache as Session Cache
    
    Creator->>UI: Open Login page
    Creator->>UI: Enter email & password
    
    opt Remember Me
        Creator->>UI: Check "Remember Me"
    end
    
    UI->>System: Submit credentials
    
    System->>DB: Query user by email
    
    alt User not found
        DB-->>System: No user found
        System-->>UI: Invalid credentials
        UI-->>Creator: Show error with retry guidance
    else User found
        DB-->>System: Return user data
        System->>System: Verify password hash
        
        alt Password incorrect
            System-->>UI: Invalid credentials
            UI-->>Creator: Show error message
        else Password correct
            System->>System: <<include>> Create Session
            System->>System: Generate JWT token
            
            alt Remember Me enabled
                System->>Cache: Store long-lived token
            else Standard login
                System->>Cache: Store session token
            end
            
            System-->>UI: Login successful + token
            UI->>UI: Store token securely
            UI->>UI: Redirect to Dashboard
            UI-->>Creator: Show welcome message
        end
    end
```

**Business Rules:**
- Session timeout: 24 hours (standard), 30 days (Remember Me)
- Maximum login attempts: 5 per 15 minutes
- Account lockout: 30 minutes after 5 failed attempts

**Acceptance Criteria:**
- ✅ Clear error messages for incorrect credentials
- ✅ Loading state during authentication
- ✅ Remember me functionality with secure token storage
- ✅ Redirect to dashboard with welcome message
- ✅ Account lockout protection against brute force

---

### Authentication Flow Overview

```mermaid
stateDiagram-v2
    [*] --> Anonymous
    
    Anonymous --> RegistrationForm: Click Sign Up
    Anonymous --> LoginForm: Click Login
    
    RegistrationForm --> ValidatingRegistration: Submit
    ValidatingRegistration --> RegistrationError: Validation Failed
    ValidatingRegistration --> CreatingAccount: Validation Passed
    
    RegistrationError --> RegistrationForm: Retry
    
    CreatingAccount --> Authenticated: Account Created
    
    LoginForm --> ValidatingLogin: Submit
    ValidatingLogin --> LoginError: Invalid Credentials
    ValidatingLogin --> Authenticated: Valid Credentials
    
    LoginError --> LoginForm: Retry
    LoginError --> AccountLocked: Max Attempts Exceeded
    
    AccountLocked --> LoginForm: After Timeout
    
    Authenticated --> Onboarding: First Time User
    Authenticated --> Dashboard: Returning User
    
    Onboarding --> Dashboard: Complete Tour / Skip
    
    Dashboard --> [*]: Logout
```

---

### Error Handling Matrix - Authentication Module

| Scenario | Error Code | User Message | System Action |
|----------|------------|--------------|---------------|
| Email already exists | AUTH_001 | "This email is already registered. Try logging in instead." | Suggest login link |
| Invalid email format | AUTH_002 | "Please enter a valid email address." | Highlight field |
| Weak password | AUTH_003 | "Password must be at least 8 characters with mix of letters and numbers." | Show strength meter |
| Invalid credentials | AUTH_004 | "Incorrect email or password. Please try again." | Increment attempt counter |
| Account locked | AUTH_005 | "Too many failed attempts. Please try again in 30 minutes." | Lock account temporarily |
| Session expired | AUTH_006 | "Your session has expired. Please log in again." | Redirect to login |
| Network error | AUTH_007 | "Connection error. Please check your internet and try again." | Enable retry button |

---

### Security Considerations

```mermaid
mindmap
  root((Authentication<br/>Security))
    Password Security
      Bcrypt hashing
      Salt per user
      Min 8 chars
      Strength validation
    Session Management
      JWT tokens
      HttpOnly cookies
      Secure flag
      CSRF protection
    Account Protection
      Rate limiting
      Account lockout
      Email verification
      2FA ready
    Data Protection
      HTTPS only
      Encrypted storage
      No password logging
      Secure password reset
```

---

### Validation Rules Detail

#### Email Validation
```javascript
// Pseudo-code for email validation
function validateEmail(email) {
  // Format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  
  // Real-time uniqueness check
  const exists = await checkEmailExists(email);
  if (exists) {
    return { valid: false, error: "Email already registered" };
  }
  
  return { valid: true };
}
```

#### Password Validation
```javascript
// Pseudo-code for password validation
function validatePassword(password) {
  const rules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
  
  const strength = Object.values(rules).filter(Boolean).length;
  
  return {
    valid: rules.minLength,
    strength: strength === 4 ? 'Strong' : 
             strength === 3 ? 'Medium' : 'Weak',
    rules: rules
  };
}
```

---

### UI/UX Guidelines - Authentication

#### Registration Form Requirements
- **Progressive disclosure:** Show password requirements on focus
- **Real-time validation:** Validate email on blur
- **Visual feedback:** 
  - ✅ Green check for valid inputs
  - ❌ Red X for invalid inputs
  - 🔄 Loading spinner during async validation
- **Accessibility:**
  - ARIA labels for all fields
  - Error messages announced by screen readers
  - Keyboard navigation support

#### Login Form Requirements
- **Remember me:** Checkbox with tooltip explaining duration
- **Forgot password:** Link prominently displayed
- **Social login:** Ready for future OAuth integration
- **Loading states:** Disable button and show spinner during authentication

---

### Integration Points

```mermaid
graph LR
    subgraph "Authentication Module"
        Auth[Authentication Service]
    end
    
    subgraph "External Dependencies"
        DB[(Database)]
        Cache[(Redis Cache)]
        Email[Email Service]
        Logger[Logging Service]
    end
    
    subgraph "Downstream Modules"
        Dashboard[Dashboard Module]
        Quiz[Quiz Management]
        Profile[User Profile]
    end
    
    Auth -->|Store user| DB
    Auth -->|Store session| Cache
    Auth -->|Send emails| Email
    Auth -->|Log events| Logger
    
    Auth -.->|Provide auth context| Dashboard
    Auth -.->|Provide auth context| Quiz
    Auth -.->|Provide auth context| Profile
```

---

### Testing Scenarios

#### Unit Tests
- ✅ Email validation logic
- ✅ Password strength calculation
- ✅ Password hashing
- ✅ Token generation
- ✅ Session management

#### Integration Tests
- ✅ Complete registration flow
- ✅ Complete login flow
- ✅ Remember me functionality
- ✅ Account lockout mechanism
- ✅ Session expiration

#### E2E Tests
- ✅ New user registration journey
- ✅ Returning user login journey
- ✅ Failed login attempts
- ✅ Password recovery flow
- ✅ Session persistence across browser refresh

---

**Next Modules:**
- Module 2: Quiz Management
- Module 3: Question Management
- Module 4: Live Game Mode
- Module 5: Challenge Mode
- Module 6: Reporting & Analytics

