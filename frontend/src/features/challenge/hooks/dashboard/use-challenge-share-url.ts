import { useMemo } from 'react';
import type { ChallengeDto } from '@/features/challenge/types';

export function useChallengeShareUrl(challenge: ChallengeDto | null | undefined) {
  const shareUrl = useMemo(() => {
    if (!challenge) return '';
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/challenge/${challenge.shareLink}`;
  }, [challenge]);

  return shareUrl;
}

