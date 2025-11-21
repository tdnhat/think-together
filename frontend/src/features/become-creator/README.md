# Become Creator Feature

The become-creator feature enables users to upgrade their role from student to creator (teacher), unlocking the ability to create quizzes, host live games, and manage educational content.

## Structure

```
become-creator/
├── components/
│   ├── button.tsx              # Trigger button in navbar
│   ├── modal.tsx               # Main orchestrator component
│   ├── steps.tsx               # Step UI (Intro, Features, Confirm)
│   ├── feature-card.tsx        # Reusable feature card
│   ├── progress-indicator.tsx  # Multi-step progress visualization
│   └── index.ts                # Component exports
├── hooks/
│   ├── use-become-creator.ts   # Business logic & state management
│   └── index.ts                # Hook exports
├── index.ts                    # Feature exports
└── README.md                   # This file
```

## Usage

### Using the Button Component

```typescript
import { BecomeCreatorButton } from '@/features/become-creator'

export function Dashboard() {
  return (
    <div>
      <BecomeCreatorButton onSuccess={() => console.log('Now a creator!')} />
    </div>
  )
}
```

### Using the Hook

```typescript
import { useBecomeCreator } from '@/features/become-creator'

export function CustomCreatorFlow() {
  const {
    currentStep,
    isActivating,
    error,
    nextStep,
    prevStep,
    activateTeacher,
    resetState,
  } = useBecomeCreator()

  return (
    // Your custom UI
  )
}
```

## Architecture

### Business Logic Hook (`use-become-creator.ts`)

- **State**: Manages current step, loading state, and errors
- **Actions**: Step navigation and teacher role activation
- **Independence**: Can be tested and used separately from UI

### Components

- **Button**: Entry point that opens the modal
- **Modal**: Orchestrates the multi-step flow
- **Steps**: Individual step components (Intro, Features, Confirm)
- **FeatureCard**: Reusable card for feature display
- **ProgressIndicator**: Visual step progress indicator

## Features

✅ Multi-step guided flow
✅ Vietnamese localization
✅ Error handling with user-friendly messages
✅ Loading states
✅ Keyboard support (Escape to close)
✅ Accessibility optimizations
✅ Professional UI design

## Integration

The feature integrates with:
- **Auth Service**: Handles API calls for role activation
- **Dashboard Navbar**: Shows button based on user eligibility
- **Toast Notifications**: User feedback on success/error

### Integration in DashboardNavbar

```typescript
import { BecomeCreatorButton } from '@/features/become-creator'

export function DashboardNavbar() {
  const { user } = useAuth()

  // Show button only for verified users with NGUOIDUNG role
  const shouldShowBecomeCreator = useMemo(() => {
    return user?.isEmailVerified === true && user?.role === 'NGUOIDUNG'
  }, [user])

  return (
    // ...
    {shouldShowBecomeCreator && <BecomeCreatorButton />}
    // ...
  )
}
```

## Future Enhancements

- 🎨 Smooth transitions between steps
- 📊 Analytics tracking for conversion rates
- 🌐 Support for additional role types
- 📱 Mobile-optimized flow
- ♿ Enhanced accessibility features

## Testing

Each part can be tested independently:

```typescript
// Hook testing
import { renderHook, act } from '@testing-library/react'
import { useBecomeCreator } from '@/features/become-creator'

describe('useBecomeCreator', () => {
  it('should navigate steps', () => {
    const { result } = renderHook(() => useBecomeCreator())
    
    act(() => result.current.nextStep())
    expect(result.current.currentStep).toBe('features')
  })
})
```

## Troubleshooting

### Button not showing?
- Ensure user is verified (`isEmailVerified === true`)
- Ensure user role is `'NGUOIDUNG'`

### Modal not closing?
- Check if `activateTeacher()` is still pending
- Ensure API endpoint `/api/auth/activate-teacher` is available

### Import errors?
- Use feature imports: `import { BecomeCreatorButton } from '@/features/become-creator'`
- Not from individual files
