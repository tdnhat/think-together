import { useMemo } from 'react';
import { useAttempt } from '../index';
import { useChallengeStore } from '../../store/challenge.store';

export function useChallengeResultsAttempt(attemptId: string | null) {
  // Get attempt from store first (if just submitted), otherwise fetch from API
  const storedAttempt = useChallengeStore((s) =>
    s.currentAttempt?.id === attemptId && s.currentAttempt?.status === 'Completed'
      ? s.currentAttempt
      : null
  );
  const { data: apiAttempt, isLoading: isLoadingAttempt } = useAttempt(attemptId || undefined);

  // Use stored attempt if available, otherwise API attempt
  const attempt = useMemo(() => {
    return storedAttempt || apiAttempt;
  }, [storedAttempt, apiAttempt]);

  const isLoading = isLoadingAttempt && !storedAttempt;

  return {
    attempt,
    isLoading,
  };
}

