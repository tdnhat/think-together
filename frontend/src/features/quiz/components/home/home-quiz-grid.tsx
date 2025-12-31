"use client";

import { QuizSetCard } from "@/features/quiz";
import type { QuizSetDto } from "@/types/api";

interface HomeQuizGridProps {
  quizSets: QuizSetDto[];
  isLoading: boolean;
  onView: (quizSet: QuizSetDto) => void;
  onHost?: (quizSet: QuizSetDto) => void;
}

export function HomeQuizGrid({
  quizSets,
  isLoading,
  onView,
  onHost,
}: HomeQuizGridProps) {
  if (isLoading) {
    return null;
  }

  if (!quizSets || quizSets.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizSets.map((quizSet) => (
          <QuizSetCard
            key={quizSet.id}
            quizSet={quizSet}
            onView={onView}
            onHost={onHost}
          />
        ))}
      </div>
    </section>
  );
}

