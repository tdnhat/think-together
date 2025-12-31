import { useMemo } from 'react';
import type { ChallengeResultsSummary, ChallengeLeaderboardDto } from '../../types';

interface UseChallengeResultsSummaryOptions {
  attemptId: string | null;
  attempt: {
    id: string;
    scoreAchieved: number;
    correctAnswers: number;
    totalQuestions: number;
    completionTimeMs?: number;
  } | null | undefined;
  leaderboard: ChallengeLeaderboardDto | null | undefined;
}

export function useChallengeResultsSummary({
  attemptId,
  attempt,
  leaderboard,
}: UseChallengeResultsSummaryOptions) {
  const resultsSummary = useMemo<ChallengeResultsSummary | null>(() => {
    if (!attempt || !attemptId) return null;

    // Find user rank in leaderboard
    const userRank = leaderboard?.entries.find(
      (entry) => entry.attemptId === attemptId
    )?.rank;

    return {
      attemptId: attempt.id,
      challengeTitle: 'Thử thách', // We'd need to fetch the challenge separately
      score: attempt.scoreAchieved,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      accuracy: (attempt.correctAnswers / attempt.totalQuestions) * 100,
      completionTimeMs: attempt.completionTimeMs,
      rank: userRank,
    };
  }, [attempt, attemptId, leaderboard]);

  return {
    resultsSummary,
  };
}

