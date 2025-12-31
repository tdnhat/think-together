import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import type { QuizSetDto } from '@/types/api';

export function useQuizHandlers() {
  const router = useRouter();

  const handleView = useCallback(
    (quizSet: QuizSetDto) => {
      router.push(ROUTES.quiz.view(quizSet.id));
    },
    [router]
  );

  const handleHost = useCallback(
    (quizSet: QuizSetDto) => {
      router.push(ROUTES.game.hostWithQuiz(quizSet.id));
    },
    [router]
  );

  return {
    handleView,
    handleHost,
  };
}

