/**
 * UI Store
 * 
 * Global UI state management (theme, modals, sidebar, notifications, etc.)
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type Theme = 'light' | 'dark' | 'system';

export interface Modal {
  id: string;
  isOpen: boolean;
  data?: unknown;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface UIState {
  // Theme
  theme: Theme;
  
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  
  // Modals
  modals: Record<string, Modal>;
  
  // Loading
  isGlobalLoading: boolean;
  loadingMessage?: string;
  
  // Toasts
  toasts: Toast[];
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  
  // Search
  isSearchOpen: boolean;
  searchQuery: string;
  
  // Onboarding
  hasCompletedOnboarding: boolean;
  hasSeenTour: boolean;
}

export interface UIActions {
  // Theme actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  
  // Modal actions
  openModal: (id: string, data?: unknown) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
  getModalData: (id: string) => unknown;
  
  // Loading actions
  setGlobalLoading: (isLoading: boolean, message?: string) => void;
  
  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Mobile menu actions
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  
  // Search actions
  toggleSearch: () => void;
  setSearchOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  // Onboarding actions
  completeOnboarding: () => void;
  completeTour: () => void;
  resetOnboarding: () => void;
}

export interface UIStore extends UIState {
  actions: UIActions;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: UIState = {
  theme: 'light',
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  modals: {},
  isGlobalLoading: false,
  loadingMessage: undefined,
  toasts: [],
  isMobileMenuOpen: false,
  isSearchOpen: false,
  searchQuery: '',
  hasCompletedOnboarding: false,
  hasSeenTour: false,
};

// ============================================================================
// STORE
// ============================================================================

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        actions: {
          // Theme actions
          setTheme: (theme) => {
            set({ theme }, false, 'ui/setTheme');
            
            // Apply theme to document
            if (typeof globalThis.window !== 'undefined') {
              const root = document.documentElement;
              if (theme === 'dark') {
                root.classList.add('dark');
              } else if (theme === 'light') {
                root.classList.remove('dark');
              } else {
                // System theme
                const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
              }
            }
          },
          
          toggleTheme: () => {
            const currentTheme = get().theme;
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            get().actions.setTheme(newTheme);
          },
          
          // Sidebar actions
          toggleSidebar: () => {
            set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, 'ui/toggleSidebar');
          },
          
          setSidebarOpen: (isOpen) => {
            set({ isSidebarOpen: isOpen }, false, 'ui/setSidebarOpen');
          },
          
          toggleSidebarCollapse: () => {
            set(
              (state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }),
              false,
              'ui/toggleSidebarCollapse'
            );
          },
          
          setSidebarCollapsed: (isCollapsed) => {
            set({ isSidebarCollapsed: isCollapsed }, false, 'ui/setSidebarCollapsed');
          },
          
          // Modal actions
          openModal: (id, data) => {
            set(
              (state) => ({
                modals: {
                  ...state.modals,
                  [id]: { id, isOpen: true, data },
                },
              }),
              false,
              'ui/openModal'
            );
          },
          
          closeModal: (id) => {
            set(
              (state) => ({
                modals: {
                  ...state.modals,
                  [id]: { ...state.modals[id], isOpen: false },
                },
              }),
              false,
              'ui/closeModal'
            );
          },
          
          closeAllModals: () => {
            set({ modals: {} }, false, 'ui/closeAllModals');
          },
          
          isModalOpen: (id) => {
            return get().modals[id]?.isOpen || false;
          },
          
          getModalData: (id) => {
            return get().modals[id]?.data;
          },
          
          // Loading actions
          setGlobalLoading: (isLoading, message) => {
            set(
              { isGlobalLoading: isLoading, loadingMessage: message },
              false,
              'ui/setGlobalLoading'
            );
          },
          
          // Toast actions
          addToast: (toast) => {
            const id = `toast-${Date.now()}-${Math.random()}`;
            const newToast: Toast = { ...toast, id };
            
            set(
              (state) => ({ toasts: [...state.toasts, newToast] }),
              false,
              'ui/addToast'
            );
            
            // Auto-remove toast after duration
            if (toast.duration !== 0) {
              setTimeout(() => {
                get().actions.removeToast(id);
              }, toast.duration || 5000);
            }
          },
          
          removeToast: (id) => {
            set(
              (state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }),
              false,
              'ui/removeToast'
            );
          },
          
          clearToasts: () => {
            set({ toasts: [] }, false, 'ui/clearToasts');
          },
          
          // Mobile menu actions
          toggleMobileMenu: () => {
            set(
              (state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }),
              false,
              'ui/toggleMobileMenu'
            );
          },
          
          setMobileMenuOpen: (isOpen) => {
            set({ isMobileMenuOpen: isOpen }, false, 'ui/setMobileMenuOpen');
          },
          
          // Search actions
          toggleSearch: () => {
            set((state) => ({ isSearchOpen: !state.isSearchOpen }), false, 'ui/toggleSearch');
          },
          
          setSearchOpen: (isOpen) => {
            set({ isSearchOpen: isOpen }, false, 'ui/setSearchOpen');
          },
          
          setSearchQuery: (query) => {
            set({ searchQuery: query }, false, 'ui/setSearchQuery');
          },
          
          // Onboarding actions
          completeOnboarding: () => {
            set({ hasCompletedOnboarding: true }, false, 'ui/completeOnboarding');
          },
          
          completeTour: () => {
            set({ hasSeenTour: true }, false, 'ui/completeTour');
          },
          
          resetOnboarding: () => {
            set(
              { hasCompletedOnboarding: false, hasSeenTour: false },
              false,
              'ui/resetOnboarding'
            );
          },
        },
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          isSidebarCollapsed: state.isSidebarCollapsed,
          hasCompletedOnboarding: state.hasCompletedOnboarding,
          hasSeenTour: state.hasSeenTour,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

export const selectTheme = (state: UIStore) => state.theme;
export const selectIsSidebarOpen = (state: UIStore) => state.isSidebarOpen;
export const selectIsSidebarCollapsed = (state: UIStore) => state.isSidebarCollapsed;
export const selectModals = (state: UIStore) => state.modals;
export const selectIsGlobalLoading = (state: UIStore) => state.isGlobalLoading;
export const selectLoadingMessage = (state: UIStore) => state.loadingMessage;
export const selectToasts = (state: UIStore) => state.toasts;
export const selectIsMobileMenuOpen = (state: UIStore) => state.isMobileMenuOpen;
export const selectIsSearchOpen = (state: UIStore) => state.isSearchOpen;
export const selectSearchQuery = (state: UIStore) => state.searchQuery;
export const selectHasCompletedOnboarding = (state: UIStore) => state.hasCompletedOnboarding;
export const selectHasSeenTour = (state: UIStore) => state.hasSeenTour;
export const selectUIActions = (state: UIStore) => state.actions;

