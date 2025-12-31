import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import type { QuizSetDto } from '@/types/api';

export function useQuizActions() {
  const router = useRouter();

  const handleEdit = useCallback(
    (quizSet: QuizSetDto) => {
      router.push(ROUTES.quiz.edit(quizSet.id));
    },
    [router]
  );

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
    handleEdit,
    handleView,
    handleHost,
  };
}

