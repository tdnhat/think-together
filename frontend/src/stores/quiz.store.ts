/**
 * Quiz Store
 * 
 * Global quiz state management for quiz creation, editing, and browsing
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Quiz, Question } from '@/lib/api/types';

// ============================================================================
// TYPES
// ============================================================================

export interface QuizDraft {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  questions: Partial<Question>[];
  tags: string[];
  isPublic: boolean;
  coverImage?: string;
}

export interface QuizFilters {
  search: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'all';
  sortBy: 'newest' | 'popular' | 'trending' | 'title';
  tags: string[];
}

export interface QuizState {
  // Current quiz being viewed/edited
  currentQuiz: Quiz | null;
  
  // Quiz list
  quizzes: Quiz[];
  totalQuizzes: number;
  
  // Filters
  filters: QuizFilters;
  
  // Draft state for quiz creation
  draft: QuizDraft | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingQuiz: boolean;
  isSaving: boolean;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  
  // Recently viewed
  recentlyViewed: string[];
  
  // Favorites
  favorites: string[];
}

export interface QuizActions {
  // Quiz CRUD
  setCurrentQuiz: (quiz: Quiz | null) => void;
  setQuizzes: (quizzes: Quiz[], total: number) => void;
  addQuiz: (quiz: Quiz) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  removeQuiz: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<QuizFilters>) => void;
  resetFilters: () => void;
  
  // Draft management
  createDraft: (quiz?: Partial<QuizDraft>) => void;
  updateDraft: (updates: Partial<QuizDraft>) => void;
  clearDraft: () => void;
  saveDraft: () => void;
  loadDraft: () => void;
  
  // Loading states
  setLoading: (isLoading: boolean) => void;
  setLoadingQuiz: (isLoading: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Recently viewed
  addToRecentlyViewed: (quizId: string) => void;
  clearRecentlyViewed: () => void;
  
  // Favorites
  toggleFavorite: (quizId: string) => void;
  isFavorite: (quizId: string) => boolean;
  
  // Reset
  reset: () => void;
}

export interface QuizStore extends QuizState {
  actions: QuizActions;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialFilters: QuizFilters = {
  search: '',
  category: 'all',
  difficulty: 'all',
  sortBy: 'newest',
  tags: [],
};

const initialDraft: QuizDraft = {
  title: '',
  description: '',
  category: '',
  difficulty: 'medium',
  timeLimit: 30,
  questions: [],
  tags: [],
  isPublic: true,
};

const initialState: QuizState = {
  currentQuiz: null,
  quizzes: [],
  totalQuizzes: 0,
  filters: initialFilters,
  draft: null,
  isLoading: false,
  isLoadingQuiz: false,
  isSaving: false,
  currentPage: 1,
  pageSize: 12,
  recentlyViewed: [],
  favorites: [],
};

// ============================================================================
// STORE
// ============================================================================

export const useQuizStore = create<QuizStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        actions: {
          // Quiz CRUD
          setCurrentQuiz: (quiz) => {
            set({ currentQuiz: quiz }, false, 'quiz/setCurrentQuiz');
            
            if (quiz) {
              get().actions.addToRecentlyViewed(quiz.id);
            }
          },
          
          setQuizzes: (quizzes, total) => {
            set({ quizzes, totalQuizzes: total }, false, 'quiz/setQuizzes');
          },
          
          addQuiz: (quiz) => {
            set(
              (state) => ({
                quizzes: [quiz, ...state.quizzes],
                totalQuizzes: state.totalQuizzes + 1,
              }),
              false,
              'quiz/addQuiz'
            );
          },
          
          updateQuiz: (id, updates) => {
            set(
              (state) => ({
                quizzes: state.quizzes.map((q) => (q.id === id ? { ...q, ...updates } : q)),
                currentQuiz:
                  state.currentQuiz?.id === id
                    ? { ...state.currentQuiz, ...updates }
                    : state.currentQuiz,
              }),
              false,
              'quiz/updateQuiz'
            );
          },
          
          removeQuiz: (id) => {
            set(
              (state) => ({
                quizzes: state.quizzes.filter((q) => q.id !== id),
                totalQuizzes: state.totalQuizzes - 1,
                currentQuiz: state.currentQuiz?.id === id ? null : state.currentQuiz,
              }),
              false,
              'quiz/removeQuiz'
            );
          },
          
          // Filters
          setFilters: (filters) => {
            set(
              (state) => ({ filters: { ...state.filters, ...filters } }),
              false,
              'quiz/setFilters'
            );
          },
          
          resetFilters: () => {
            set({ filters: initialFilters, currentPage: 1 }, false, 'quiz/resetFilters');
          },
          
          // Draft management
          createDraft: (quiz) => {
            set(
              { draft: { ...initialDraft, ...quiz } },
              false,
              'quiz/createDraft'
            );
          },
          
          updateDraft: (updates) => {
            set(
              (state) => ({
                draft: state.draft ? { ...state.draft, ...updates } : null,
              }),
              false,
              'quiz/updateDraft'
            );
          },
          
          clearDraft: () => {
            set({ draft: null }, false, 'quiz/clearDraft');
            
            if (typeof globalThis.window !== 'undefined') {
              localStorage.removeItem('quiz-draft');
            }
          },
          
          saveDraft: () => {
            const draft = get().draft;
            if (draft && typeof globalThis.window !== 'undefined') {
              localStorage.setItem('quiz-draft', JSON.stringify(draft));
            }
          },
          
          loadDraft: () => {
            if (typeof globalThis.window !== 'undefined') {
              const saved = localStorage.getItem('quiz-draft');
              if (saved) {
                try {
                  const draft = JSON.parse(saved);
                  set({ draft }, false, 'quiz/loadDraft');
                } catch (error) {
                  // Silent fail for localStorage errors - no need to show toast
                  if (error instanceof Error && error.name !== 'QuotaExceededError') {
                    // Only log non-quota errors
                  }
                }
              }
            }
          },
          
          // Loading states
          setLoading: (isLoading) => {
            set({ isLoading }, false, 'quiz/setLoading');
          },
          
          setLoadingQuiz: (isLoading) => {
            set({ isLoadingQuiz: isLoading }, false, 'quiz/setLoadingQuiz');
          },
          
          setSaving: (isSaving) => {
            set({ isSaving }, false, 'quiz/setSaving');
          },
          
          // Pagination
          setPage: (page) => {
            set({ currentPage: page }, false, 'quiz/setPage');
          },
          
          setPageSize: (size) => {
            set({ pageSize: size, currentPage: 1 }, false, 'quiz/setPageSize');
          },
          
          nextPage: () => {
            const { currentPage, totalQuizzes, pageSize } = get();
            const maxPage = Math.ceil(totalQuizzes / pageSize);
            
            if (currentPage < maxPage) {
              set({ currentPage: currentPage + 1 }, false, 'quiz/nextPage');
            }
          },
          
          prevPage: () => {
            const { currentPage } = get();
            
            if (currentPage > 1) {
              set({ currentPage: currentPage - 1 }, false, 'quiz/prevPage');
            }
          },
          
          // Recently viewed
          addToRecentlyViewed: (quizId) => {
            set(
              (state) => {
                const filtered = state.recentlyViewed.filter((id) => id !== quizId);
                return {
                  recentlyViewed: [quizId, ...filtered].slice(0, 10),
                };
              },
              false,
              'quiz/addToRecentlyViewed'
            );
          },
          
          clearRecentlyViewed: () => {
            set({ recentlyViewed: [] }, false, 'quiz/clearRecentlyViewed');
          },
          
          // Favorites
          toggleFavorite: (quizId) => {
            set(
              (state) => {
                const isFav = state.favorites.includes(quizId);
                return {
                  favorites: isFav
                    ? state.favorites.filter((id) => id !== quizId)
                    : [...state.favorites, quizId],
                };
              },
              false,
              'quiz/toggleFavorite'
            );
          },
          
          isFavorite: (quizId) => {
            return get().favorites.includes(quizId);
          },
          
          // Reset
          reset: () => {
            set(initialState, false, 'quiz/reset');
          },
        },
      }),
      {
        name: 'quiz-storage',
        partialize: (state) => ({
          recentlyViewed: state.recentlyViewed,
          favorites: state.favorites,
          filters: state.filters,
          pageSize: state.pageSize,
        }),
      }
    ),
    { name: 'QuizStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectCurrentQuiz = (state: QuizStore) => state.currentQuiz;
export const selectQuizzes = (state: QuizStore) => state.quizzes;
export const selectTotalQuizzes = (state: QuizStore) => state.totalQuizzes;
export const selectFilters = (state: QuizStore) => state.filters;
export const selectDraft = (state: QuizStore) => state.draft;
export const selectIsLoading = (state: QuizStore) => state.isLoading;
export const selectIsLoadingQuiz = (state: QuizStore) => state.isLoadingQuiz;
export const selectIsSaving = (state: QuizStore) => state.isSaving;
export const selectCurrentPage = (state: QuizStore) => state.currentPage;
export const selectPageSize = (state: QuizStore) => state.pageSize;
export const selectRecentlyViewed = (state: QuizStore) => state.recentlyViewed;
export const selectFavorites = (state: QuizStore) => state.favorites;
export const selectQuizActions = (state: QuizStore) => state.actions;

// Computed selectors
export const selectTotalPages = (state: QuizStore) =>
  Math.ceil(state.totalQuizzes / state.pageSize);

export const selectHasNextPage = (state: QuizStore) =>
  state.currentPage < Math.ceil(state.totalQuizzes / state.pageSize);

export const selectHasPrevPage = (state: QuizStore) => state.currentPage > 1;

