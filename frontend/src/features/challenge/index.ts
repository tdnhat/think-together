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
  useSubmitAnswer,
  useSubmitAnswers,
  useCompleteAttempt,
  useAbandonAttempt,
  useFlagQuestion,
  useLeaderboard,
  useChallengeTimer,
} from './hooks'

// Components
export {
  TimerDisplay,
  ChallengeProgress,
  FlagButton,
  QuestionDisplay,
  QuestionNavigation,
  LeaderboardTable,
  ResultsSummary,
  StartChallengeForm,
} from './components'

// Types
export type {
  ChallengeDto,
  ChallengeAttemptDto,
  ChallengeQuestionDto,
  ChallengeAnswerDto,
  ChallengeLeaderboardEntryDto,
  ChallengeLeaderboardDto,
  ChallengeResultsSummary,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  StartChallengeAttemptRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest,
  FlagQuestionRequest,
} from './types'

export { ChallengeStatus, AttemptStatus } from './types'

// Constants
export { CHALLENGE_CONSTANTS, CHALLENGE_STATUS_LABELS, ATTEMPT_STATUS_LABELS, LEADERBOARD_HEADERS } from './constants'

