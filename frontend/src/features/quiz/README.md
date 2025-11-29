# Quiz Feature

This feature provides comprehensive quiz set management functionality for the ThinkTogether application. It follows the established architectural patterns and design system.

## Overview

The quiz feature allows users to:
- Create, edit, and delete quiz sets
- View quiz sets in a card-based grid layout
- Publish quiz sets for public use
- Search and filter quiz sets
- Manage quiz set metadata (title, description, cover image)

## Architecture

### Feature Structure
```
features/quiz/
├── api/                    # API services
│   └── quiz-set.service.ts # Quiz set CRUD operations
├── components/             # Reusable UI components
│   ├── quiz-set-card.tsx   # Individual quiz set card
│   ├── quiz-set-list.tsx   # Quiz set grid with filters
│   ├── quiz-set-form.tsx   # Create/edit form
│   ├── quiz-set-modal.tsx  # Modal wrapper for forms
│   └── index.ts           # Component exports
├── hooks/                  # Custom hooks
│   ├── use-quiz-sets.ts    # CRUD operations hook
│   └── index.ts           # Hook exports
├── constants/              # Feature constants
│   └── index.ts           # Messages, limits, defaults
├── types/                  # Feature-specific types (future)
├── index.ts               # Feature barrel export
└── README.md              # This file
```

### Key Components

#### QuizSetCard
- Displays individual quiz set information
- Cover image with fallback
- Status badges (Published/Draft)
- Action menu (Edit, Delete, Publish, etc.)
- Responsive design with hover effects

#### QuizSetList
- Grid layout for quiz sets
- Search and filtering functionality
- Sort options (newest, oldest, title, questions)
- Loading states and empty states
- Statistics badges (total, published, draft)

#### QuizSetForm
- Form for creating/editing quiz sets
- Validation using Zod schemas
- Image URL input with preview
- Responsive layout

#### QuizSetModal
- Modal wrapper for create/edit forms
- Portal-based rendering
- Keyboard navigation (Escape to close)
- Loading states

### API Integration

#### Service Layer (`quiz-set.service.ts`)
- RESTful API calls using Axios
- Error handling with custom messages
- Type-safe request/response handling

#### Endpoints
```typescript
QUIZ_SET_ENDPOINTS = {
  LIST_QUIZ_SETS: '/api/quiz-sets',
  GET_QUIZ_SET: (id) => `/api/quiz-sets/${id}`,
  CREATE_QUIZ_SET: '/api/quiz-sets',
  UPDATE_QUIZ_SET: (id) => `/api/quiz-sets/${id}`,
  DELETE_QUIZ_SET: (id) => `/api/quiz-sets/${id}`,
  PUBLISH_QUIZ_SET: (id) => `/api/quiz-sets/${id}/publish',
}
```

### Data Management

#### useQuizSets Hook
- React Query integration for caching
- Optimistic updates for better UX
- Error handling and loading states
- CRUD operations with proper cache invalidation

#### Data Flow
1. Components use `useQuizSets` hook
2. Hook calls service methods
3. Service makes API calls via Axios
4. Responses are cached by React Query
5. UI updates automatically on success/error

### Validation

#### Form Validation
- Zod schemas for type-safe validation
- Vietnamese error messages
- Real-time validation feedback
- Field-level error display

#### Business Rules
- Title: required, max 255 characters
- Description: optional, max 2000 characters
- Cover image URL: optional, must be valid URL

### Design System Compliance

#### Neo-Brutalism Style
- 3px borders throughout
- Đổ bóng sử dụng các utility mặc định của Tailwind kết hợp màu trong design system
- Vibrant color palette
- Bold typography

#### Responsive Design
- Mobile-first approach
- Grid layouts that collapse on mobile
- Touch-friendly button sizes

#### Accessibility
- Semantic HTML
- Keyboard navigation support
- Screen reader labels
- Focus management

### Usage Examples

#### Basic Quiz Set List
```tsx
import { QuizSetList, useQuizSets } from '@/features/quiz'

function MyQuizzesPage() {
  const {
    quizSets,
    isLoadingQuizSets,
    createQuizSet,
    updateQuizSet,
    deleteQuizSet,
    publishQuizSet,
  } = useQuizSets()

  return (
    <QuizSetList
      quizSets={quizSets}
      isLoading={isLoadingQuizSets}
      onCreateNew={() => {/* Open create modal */}}
      onEdit={(quizSet) => {/* Open edit modal */}}
      onDelete={(quizSet) => {/* Show confirmation */}}
      onPublish={(quizSet) => publishQuizSet(quizSet.id)}
    />
  )
}
```

#### Create/Edit Modal
```tsx
import { QuizSetModal } from '@/features/quiz'

function QuizSetModalWrapper({ open, onOpenChange, quizSet, onSuccess }) {
  const { createQuizSet, updateQuizSet, isCreating, isUpdating } = useQuizSets()

  const handleSubmit = async (data) => {
    if (quizSet) {
      await updateQuizSet(data)
    } else {
      await createQuizSet(data)
    }
    onSuccess()
  }

  return (
    <QuizSetModal
      open={open}
      onOpenChange={onOpenChange}
      quizSet={quizSet}
      onSubmit={handleSubmit}
      isSubmitting={isCreating || isUpdating}
    />
  )
}
```

### Constants

#### Messages
- Success/error messages in Vietnamese
- Confirmation prompts
- Empty state messages

#### Limits
- Character limits for fields
- Default values
- Placeholder text

### Testing Strategy

#### Component Testing
- Visual regression tests
- Interaction tests
- Form validation tests

#### Integration Testing
- API integration tests
- Error handling tests
- Loading state tests

#### E2E Testing
- Full CRUD workflows
- Search and filter functionality
- Modal interactions

### Future Enhancements

#### Planned Features
- [ ] Quiz set duplication
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Quiz set templates
- [ ] Analytics dashboard
- [ ] Collaborative editing

#### Performance Optimizations
- [ ] Virtual scrolling for large lists
- [ ] Image lazy loading
- [ ] Pagination for API calls
- [ ] Offline support

## Dependencies

### External
- `react-hook-form` - Form management
- `@hookform/resolvers/zod` - Zod validation
- `@tanstack/react-query` - Data fetching
- `sonner` - Toast notifications

### Internal
- `@/shared/ui/*` - UI components
- `@/shared/components/*` - Shared components
- `@/lib/api/*` - API utilities
- `@/lib/validators` - Validation schemas
- `@/types/api` - API types
