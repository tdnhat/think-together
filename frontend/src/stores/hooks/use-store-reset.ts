/**
 * Store Reset Hook
 * 
 * Provides a way to reset all stores (useful for logout, testing, etc.)
 */

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useGameStore } from '@/features/game/store/game.store';
import { useQuizStore } from '../quiz.store';

export function useStoreReset() {
  const resetAuth = useAuthStore((state) => state.actions.clearSession);
  const resetGame = useGameStore((state) => state.actions.resetGame);
  const resetQuiz = useQuizStore((state) => state.actions.reset);
  
  const resetAllStores = () => {
    resetAuth();
    resetGame();
    resetQuiz();
    // UI store is intentionally not reset (theme, preferences should persist)
  };
  
  const resetUserData = () => {
    resetAuth();
    resetGame();
    resetQuiz();
  };
  
  return {
    resetAllStores,
    resetUserData,
    resetAuth,
    resetGame,
    resetQuiz,
  };
}

