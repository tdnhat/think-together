/**
 * Store Index
 * 
 * Central export point for all Zustand stores
 */

// UI Store
export {
  useUIStore,
  selectTheme,
  selectIsSidebarOpen,
  selectIsSidebarCollapsed,
  selectModals,
  selectIsGlobalLoading,
  selectLoadingMessage,
  selectToasts,
  selectIsMobileMenuOpen,
  selectIsSearchOpen,
  selectSearchQuery,
  selectHasCompletedOnboarding,
  selectHasSeenTour,
  selectUIActions,
} from './ui.store';

export type { UIStore, UIState, UIActions, Theme, Modal, Toast } from './ui.store';

// Quiz Store
export {
  useQuizStore,
  selectCurrentQuiz,
  selectQuizzes,
  selectTotalQuizzes,
  selectFilters,
  selectDraft,
  selectIsLoading,
  selectIsLoadingQuiz,
  selectIsSaving,
  selectCurrentPage,
  selectPageSize,
  selectRecentlyViewed,
  selectFavorites,
  selectQuizActions,
  selectTotalPages,
  selectHasNextPage,
  selectHasPrevPage,
} from './quiz.store';

export type {
  QuizStore,
  QuizState,
  QuizActions,
  QuizDraft,
  QuizFilters,
} from './quiz.store';

// Auth Store (re-export from features)
export {
  useAuthStore,
  selectUser,
  selectToken,
  selectRefreshToken,
  selectTokenExpiry,
  selectLastActivity,
  selectIsAuthenticated,
  selectIsLoading as selectAuthIsLoading,
  selectAuthActions,
} from '@/features/auth/stores/auth.store';

// Game Store (re-export from features)
export {
  useGameStore,
  selectSession,
  selectIsHost,
  selectCurrentQuestion,
  selectLeaderboard,
  selectTimeRemaining,
  selectIsConnected,
  selectGameActions,
} from '@/features/game/store/game.store';

