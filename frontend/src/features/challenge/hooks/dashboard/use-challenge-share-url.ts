import { useMemo } from 'react';
import { ROUTES } from '@/config/routes';
import type { ChallengeDto } from '@/features/challenge/types';

export function useChallengeShareUrl(challenge: ChallengeDto | null | undefined) {
  const shareUrl = useMemo(() => {
    if (!challenge) return '';
    return `${typeof window !== 'undefined' ? window.location.origin : ''}${ROUTES.game.challenge(challenge.shareLink)}`;
  }, [challenge]);

  return shareUrl;
}

