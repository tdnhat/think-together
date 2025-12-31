import { useCallback } from 'react';
import { useChallengeStore, selectCurrentQuestion } from '../../store/challenge.store';

export function useChallengeAnswerHandler(startTime: number) {
  const currentQuestion = useChallengeStore(selectCurrentQuestion);

  const handleAnswerChange = useCallback(
    (
      answer:
        | number[]
        | Array<[number, number]>
        | Array<[string, number]>
        | Array<{ leftContent: string; rightContent: string }>
        | Array<{ content: string; position: number }>
    ) => {
      if (!currentQuestion) return;

      if (Array.isArray(answer) && answer.length > 0) {
        // Handle single/multiple choice (number arrays)
        if (typeof answer[0] === 'number') {
          const answerArray = answer as number[];

          useChallengeStore.setState((state) => ({
            answers: {
              ...state.answers,
              [currentQuestion.id]: {
                id: currentQuestion.id,
                questionId: currentQuestion.id,
                submissionTimeMs: Date.now() - startTime,
                isCorrect: false,
                pointsEarned: 0,
                selectedOptionIndexes: answerArray,
                matchingPairs: [],
                orderingItems: [],
              },
            },
          }));
        }
        // Handle matching questions
        else if (
          answer.length > 0 &&
          typeof answer[0] === 'object' &&
          'leftContent' in answer[0] &&
          'rightContent' in answer[0]
        ) {
          const matchingPairs = answer as Array<{ leftContent: string; rightContent: string }>;

          useChallengeStore.setState((state) => ({
            answers: {
              ...state.answers,
              [currentQuestion.id]: {
                id: currentQuestion.id,
                questionId: currentQuestion.id,
                submissionTimeMs: Date.now() - startTime,
                isCorrect: false,
                pointsEarned: 0,
                selectedOptionIndexes: [],
                matchingPairs: matchingPairs,
                orderingItems: [],
              },
            },
          }));
        }
        // Handle ordering questions
        else if (
          answer.length > 0 &&
          typeof answer[0] === 'object' &&
          'content' in answer[0] &&
          'position' in answer[0]
        ) {
          const orderingItems = answer as Array<{ content: string; position: number }>;

          useChallengeStore.setState((state) => ({
            answers: {
              ...state.answers,
              [currentQuestion.id]: {
                id: currentQuestion.id,
                questionId: currentQuestion.id,
                submissionTimeMs: Date.now() - startTime,
                isCorrect: false,
                pointsEarned: 0,
                selectedOptionIndexes: [],
                matchingPairs: [],
                orderingItems: orderingItems,
              },
            },
          }));
        }
      }
    },
    [currentQuestion, startTime]
  );

  return {
    handleAnswerChange,
  };
}

