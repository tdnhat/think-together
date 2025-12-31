"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { useChallengeStore, selectCurrentQuestionIndex, selectTotalQuestions } from "../../store/challenge.store";

interface ChallengeNavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ChallengeNavigationButtons({
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}: ChallengeNavigationButtonsProps) {
  const currentQuestionIndex = useChallengeStore(selectCurrentQuestionIndex);
  const totalQuestions = useChallengeStore(selectTotalQuestions);
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <Card className="py-4 gap-0">
      <CardContent className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Trước
        </Button>

        {isLastQuestion ? (
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang nộp bài..." : "Hoàn thành"}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            Tiếp theo →
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

