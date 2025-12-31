import { useEffect } from 'react';
import { useChallengeStore, selectCurrentQuestion } from '../../store/challenge.store';

export function useChallengeAnswers() {
  const currentQuestion = useChallengeStore(selectCurrentQuestion);
  const getAnswer = useChallengeStore((s) => s.getAnswer);
  const answers = useChallengeStore((s) => s.answers);

  // Load existing answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      getAnswer(currentQuestion.id);
    }
  }, [currentQuestion, getAnswer]);

  return {
    answers,
  };
}

