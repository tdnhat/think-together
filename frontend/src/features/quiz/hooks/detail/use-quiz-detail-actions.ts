import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateChallenge } from '@/features/challenge';
import { toast } from '@/lib/utils/toast';
import { ROUTES } from '@/config/routes';
import type { QuizSetDto } from '@/types/api';

export function useQuizDetailActions(quizSetId: string, quizSet: QuizSetDto | null | undefined) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createChallenge, isPending: isCreatingChallenge } = useCreateChallenge();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleStart = useCallback(() => {
    // Navigate to play/lobby page (to be implemented)
    console.log('Start quiz', quizSetId);
    // router.push(ROUTES.quiz.play(quizSetId))
  }, [quizSetId]);

  const handleCreateChallenge = useCallback(() => {
    if (!quizSet) return;

    createChallenge(
      {
        quizSetId: quizSet.id,
        title: quizSet.title,
        description: quizSet.description,
      },
      {
        onSuccess: () => {
          toast.success('Thử thách đã được tạo thành công!');
          queryClient.invalidateQueries({ queryKey: ['challenge-by-quiz', quizSetId] });
          router.push(ROUTES.quiz.challenge(quizSetId));
        },
      }
    );
  }, [quizSet, createChallenge, quizSetId, queryClient, router]);

  const handleViewChallenge = useCallback(() => {
    router.push(ROUTES.quiz.challenge(quizSetId));
  }, [router, quizSetId]);

  const handleViewAllQuestions = useCallback(() => {
    // Navigate to edit page or questions page (to be implemented)
    console.log('View all questions', quizSetId);
  }, [quizSetId]);

  return {
    handleBack,
    handleStart,
    handleCreateChallenge,
    handleViewChallenge,
    handleViewAllQuestions,
    isCreatingChallenge,
  };
}

