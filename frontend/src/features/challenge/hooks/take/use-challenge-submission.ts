import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { useSubmitAnswers } from '../index';
import { useChallengeStore } from '../../store/challenge.store';
import type { ChallengeAttemptDto } from '../../types';

interface UseChallengeSubmissionOptions {
  attempt: ChallengeAttemptDto | null | undefined;
  shareLink: string;
  homeworkId: string | null;
}

export function useChallengeSubmission({
  attempt,
  shareLink,
  homeworkId,
}: UseChallengeSubmissionOptions) {
  const router = useRouter();
  const { mutate: submitAnswers, isPending: isSubmittingAnswers } = useSubmitAnswers();
  const setCurrentAttempt = useChallengeStore((s) => s.setCurrentAttempt);
  const answers = useChallengeStore((s) => s.answers);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = useCallback(() => {
    if (!attempt) return;

    setIsSubmitting(true);

    // Prepare all answers to submit
    const answersToSubmit = Object.entries(answers)
      .map(([questionId, answer]) => {
        const question = attempt.questions.find((q) => q.id === questionId);
        if (!question) return null;

        const submissionData: {
          questionId: string;
          selectedOptionIndexes?: number[];
          matchingPairs?: Array<{ leftContent: string; rightContent: string }>;
          orderingItems?: Array<{ content: string; position: number }>;
        } = {
          questionId: question.id,
        };

        if (answer.selectedOptionIndexes && answer.selectedOptionIndexes.length > 0) {
          submissionData.selectedOptionIndexes = answer.selectedOptionIndexes;
        }

        if (answer.matchingPairs && answer.matchingPairs.length > 0) {
          submissionData.matchingPairs = answer.matchingPairs;
        }

        if (answer.orderingItems && answer.orderingItems.length > 0) {
          submissionData.orderingItems = answer.orderingItems;
        }

        return submissionData;
      })
      .filter(
        (item): item is {
          questionId: string;
          selectedOptionIndexes?: number[];
          matchingPairs?: Array<{ leftContent: string; rightContent: string }>;
          orderingItems?: Array<{ content: string; position: number }>;
        } => item !== null
      );

    // Submit all answers (server grades immediately and returns completed attempt)
    submitAnswers(
      {
        attemptId: attempt.id,
        answers: answersToSubmit,
        homeworkId: homeworkId || undefined,
      },
      {
        onSuccess: (completedAttempt) => {
          setIsSubmitting(false);

          // Update store with completed attempt so results page has fresh data
          setCurrentAttempt({
            ...completedAttempt,
            currentQuestionIndex: 0,
            flaggedQuestionIds: [],
            questions: completedAttempt.questions.map((q) => ({
              ...q,
              isFlagged: false,
              isAnswered: true,
              answer: undefined,
            })),
          });

          // Navigate to results page with homeworkId if present
          const queryParams = new URLSearchParams();
          queryParams.set('attemptId', attempt.id);
          if (homeworkId) {
            queryParams.set('homeworkId', homeworkId);
          }
          router.push(`${ROUTES.game.challenge(shareLink)}/results?${queryParams.toString()}`);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
  }, [attempt, answers, submitAnswers, homeworkId, shareLink, router, setCurrentAttempt]);

  return {
    handleComplete,
    isSubmitting: isSubmitting || isSubmittingAnswers,
  };
}

