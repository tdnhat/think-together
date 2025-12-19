/**
 * Challenge Feature
 * Barrel export for all challenge feature exports
 */

// API
export { challengeService } from './api/challenge.service'

// Store & Selectors
export {
  useChallengeStore,
  selectCurrentChallenge,
  selectCurrentAttempt,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectTotalQuestions,
  selectRemainingTime,
  selectTotalTime,
  selectAnswers,
  selectFlaggedQuestions,
  selectLeaderboard,
  selectIsLoading,
  selectError,
} from './store/challenge.store'

// Hooks
export {
  useChallenge,
  useChallengeLinkResolver,
  useChallengeByQuizSetId,
  useChallenges,
  useCreateChallenge,
  useUpdateChallenge,
  useDeleteChallenge,
  useStartAttempt,
  useAttempt,
  useSubmitAnswers,
  usePollAttemptCompletion,
  useLeaderboard,
  useChallengeTimer,
} from './hooks'

// Components
export {
  TimerDisplay,
  ChallengeProgress,
  QuestionDisplay,
  QuestionNavigation,
  QuestionGrid,
  LeaderboardTable,
  ResultsSummary,
  StartChallengeForm,
} from './components'

// Types
export type {
  ChallengeDto,
  ChallengeAttemptDto,
  ChallengeAttemptApiDto,
  ChallengeQuestionDto,
  ChallengeQuestionApiDto,
  ChallengeAnswerDto,
  ChallengeLeaderboardEntryDto,
  ChallengeLeaderboardDto,
  ChallengeResultsSummary,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  StartChallengeAttemptRequest,
  CompleteAttemptRequest,
} from './types'

export { ChallengeStatus, AttemptStatus } from './types'

// Constants
export { CHALLENGE_CONSTANTS, CHALLENGE_STATUS_LABELS, ATTEMPT_STATUS_LABELS, LEADERBOARD_HEADERS } from './constants'
