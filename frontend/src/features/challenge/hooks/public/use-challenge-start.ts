import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStartAttempt } from '@/features/challenge';
import { useAuthStore, selectUser } from '@/features/auth/stores/auth.store';
import { ROUTES } from '@/config/routes';
import type { ChallengeDto } from '@/features/challenge/types';

interface UseChallengeStartOptions {
  challenge: ChallengeDto | null | undefined;
  shareLink: string;
  homeworkId: string | null;
}

export function useChallengeStart({
  challenge,
  shareLink,
  homeworkId,
}: UseChallengeStartOptions) {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const { mutate: startAttempt, isPending: isStarting } = useStartAttempt();

  // Auto-start if user is logged in and homeworkId is provided
  useEffect(() => {
    if (challenge && user?.id && homeworkId && !isStarting) {
      startAttempt(
        {
          challengeId: challenge.id,
          nickname: user.name || user.email || 'Học sinh',
          userId: user.id,
          homeworkId: homeworkId,
        },
        {
          onSuccess: (attempt) => {
            const queryParams = new URLSearchParams();
            queryParams.set('attemptId', attempt.id);
            if (homeworkId) {
              queryParams.set('homeworkId', homeworkId);
            }
            router.push(`${ROUTES.game.challenge(shareLink)}/take?${queryParams.toString()}`);
          },
        }
      );
    }
  }, [
    challenge,
    user,
    homeworkId,
    isStarting,
    startAttempt,
    shareLink,
    router,
  ]);

  const handleStart = useCallback(
    (nickname: string) => {
      if (!challenge) return;

      startAttempt(
        {
          challengeId: challenge.id,
          nickname,
          userId: user?.id,
          homeworkId: homeworkId || undefined,
        },
        {
          onSuccess: (attempt) => {
            const queryParams = new URLSearchParams();
            queryParams.set('attemptId', attempt.id);
            if (homeworkId) {
              queryParams.set('homeworkId', homeworkId);
            }
            router.push(`${ROUTES.game.challenge(shareLink)}/take?${queryParams.toString()}`);
          },
        }
      );
    },
    [challenge, startAttempt, user, homeworkId, shareLink, router]
  );

  return {
    handleStart,
    isStarting,
  };
}

