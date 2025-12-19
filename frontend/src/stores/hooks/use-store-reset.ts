/**
 * Store Reset Hook
 * 
 * Provides a way to reset all stores (useful for logout, testing, etc.)
 */

import { useAuthStore } from '@/features/auth/stores/auth.store';
import { useHostGameStore } from '@/features/game-host/store/host-game-store';
import { usePlayerGameStore } from '@/features/game-player/store/player-game-store';
import { useQuizStore } from '../quiz.store';

export function useStoreReset() {
  const resetAuth = useAuthStore((state) => state.actions.clearSession);
  const resetHostGame = useHostGameStore((state) => state.actions.reset);
  const resetPlayerGame = usePlayerGameStore((state) => state.actions.reset);
  const resetQuiz = useQuizStore((state) => state.actions.reset);
  
  const resetAllStores = () => {
    resetAuth();
    resetHostGame();
    resetPlayerGame();
    resetQuiz();
    // UI store is intentionally not reset (theme, preferences should persist)
  };
  
  const resetUserData = () => {
    resetAuth();
    resetHostGame();
    resetPlayerGame();
    resetQuiz();
  };
  
  return {
    resetAllStores,
    resetUserData,
    resetAuth,
    resetGame: () => {
      resetHostGame();
      resetPlayerGame();
    },
    resetQuiz,
  };
}

