import { useEffect, useState } from 'react';
import { useAttempt } from '../index';
import { useChallengeStore } from '../../store/challenge.store';

export function useChallengeAttempt(attemptId: string | null) {
  const { data: attempt, isLoading } = useAttempt(attemptId || undefined);
  const setCurrentAttempt = useChallengeStore((s) => s.setCurrentAttempt);
  const currentAttempt = useChallengeStore((s) => s.currentAttempt);
  const clearAnswers = useChallengeStore((s) => s.clearAnswers);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null);

  // Clear answers when attemptId changes (new attempt) or when stored attempt doesn't match
  useEffect(() => {
    if (attemptId) {
      // If attemptId changed, or if stored attempt doesn't match current attemptId, clear answers
      if (attemptId !== lastAttemptId || (currentAttempt && currentAttempt.id !== attemptId)) {
        clearAnswers();
      }
      setLastAttemptId(attemptId);
    }
  }, [attemptId, lastAttemptId, currentAttempt, clearAnswers]);

  // Update store when attempt loads
  useEffect(() => {
    if (attempt) {
      setCurrentAttempt(attempt);
      setStartTime(Date.now());
    }
  }, [attempt, setCurrentAttempt]);

  return {
    attempt,
    isLoading,
    startTime,
  };
}

