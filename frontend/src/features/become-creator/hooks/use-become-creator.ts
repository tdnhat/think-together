import { useState, useCallback } from 'react';
import { authService } from '@/features/auth';
import { handleError } from '@/lib/errors/error-handler';
import { BECOME_CREATOR_STEPS, type BecomeCreatorStep } from '../constants';

interface BecomeCreatorState {
  currentStep: BecomeCreatorStep;
  isActivating: boolean;
  error: string | null;
}

interface BecomeCreatorActions {
  currentStep: BecomeCreatorStep;
  isActivating: boolean;
  error: string | null;
  nextStep: () => void;
  prevStep: () => void;
  becomeCreator: () => Promise<boolean>;
  resetState: () => void;
}

const INITIAL_STATE: BecomeCreatorState = {
  currentStep: 'intro',
  isActivating: false,
  error: null,
};

export function useBecomeCreator(): BecomeCreatorActions {
  const [state, setState] = useState<BecomeCreatorState>(INITIAL_STATE)

  const getCurrentStepIndex = useCallback(() => {
    return BECOME_CREATOR_STEPS.indexOf(state.currentStep);
  }, [state.currentStep]);

  const nextStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < BECOME_CREATOR_STEPS.length - 1) {
      setState((prev) => ({
        ...prev,
        currentStep: BECOME_CREATOR_STEPS[currentIndex + 1],
        error: null,
      }));
    }
  }, [getCurrentStepIndex]);

  const prevStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentStep: BECOME_CREATOR_STEPS[currentIndex - 1],
        error: null,
      }));
    }
  }, [getCurrentStepIndex]);

  const becomeCreator = useCallback(async (): Promise<boolean> => {
    try {
      setState((prev) => ({
        ...prev,
        isActivating: true,
        error: null,
      }))

      // Simulate realistic loading: 2-3 seconds
      const simulatedDelay = 2000 + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, simulatedDelay))

      const response = await authService.becomeCreator()

      if (!response.success) {
        const errorMessage = response.message || 'Không thể kích hoạt vai trò Người sáng tạo'
        setState((prev) => ({
          ...prev,
          isActivating: false,
          error: errorMessage,
        }))
        return false
      }

      return true
    } catch (error: unknown) {
      handleError(error, { 
        showToast: false
      })

      let errorMessage = 'Đã xảy ra lỗi khi kích hoạt vai trò Người sáng tạo'

      if (error && typeof error === 'object' && 'detail' in error) {
        errorMessage = String((error as { detail?: string }).detail)
      }

      setState((prev) => ({
        ...prev,
        isActivating: false,
        error: errorMessage,
      }))

      return false
    }
  }, [])

  const resetState = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return {
    currentStep: state.currentStep,
    isActivating: state.isActivating,
    error: state.error,
    nextStep,
    prevStep,
    becomeCreator,
    resetState,
  }
}
