import { useEffect } from 'react';
import { useChallengeStore, selectRemainingTime } from '../../store/challenge.store';
import type { ChallengeAttemptDto } from '../../types';

export function useChallengeTimeHandler(
  attempt: ChallengeAttemptDto | null | undefined,
  onTimeUp: () => void
) {
  const remainingTimeMs = useChallengeStore(selectRemainingTime);

  // Handle time up
  useEffect(() => {
    if (remainingTimeMs <= 0 && attempt) {
      onTimeUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTimeMs]);
}

