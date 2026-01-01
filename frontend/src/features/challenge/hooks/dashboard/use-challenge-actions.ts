import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';

export function useChallengeActions(quizSetId: string) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push(ROUTES.quiz.view(quizSetId));
  }, [router, quizSetId]);

  return {
    handleBack,
  };
}

