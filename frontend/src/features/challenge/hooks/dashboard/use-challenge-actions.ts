import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useChallengeActions(quizSetId: string) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push(`/quiz/${quizSetId}`);
  }, [router, quizSetId]);

  return {
    handleBack,
  };
}

