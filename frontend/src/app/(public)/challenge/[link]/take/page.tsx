'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import {
  TimerDisplay,
  ChallengeProgress,
  QuestionDisplay,
  QuestionNavigation,
  FlagButton,
  useChallengeStore,
  useAttempt,
  useSubmitAnswers,
  useCompleteAttempt,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectTotalQuestions,
  selectRemainingTime,
} from '@/features/challenge'
import { CHALLENGE_CONSTANTS } from '@/features/challenge/constants'

function ChallengeTakingContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const shareLink = params.link as string
  const attemptId = searchParams.get('attemptId')

  const [selectedAnswer, setSelectedAnswer] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null)

  // Get attempt data from backend
  const { data: attempt, isLoading } = useAttempt(attemptId || undefined)

  // Mutations
  const { mutate: submitAnswers, isPending: isSubmittingAnswers } = useSubmitAnswers()
  const { mutate: completeAttempt, isPending: isCompleting } = useCompleteAttempt()

  // Store state
  const setCurrentAttempt = useChallengeStore((s) => s.setCurrentAttempt)
  const currentAttempt = useChallengeStore((s) => s.currentAttempt)
  const clearAnswers = useChallengeStore((s) => s.clearAnswers)
  const currentQuestion = useChallengeStore(selectCurrentQuestion)
  const currentQuestionIndex = useChallengeStore(selectCurrentQuestionIndex)
  const totalQuestions = useChallengeStore(selectTotalQuestions)
  const remainingTimeMs = useChallengeStore(selectRemainingTime)
  const goToNextQuestion = useChallengeStore((s) => s.goToNextQuestion)
  const goToPreviousQuestion = useChallengeStore((s) => s.goToPreviousQuestion)
  const getAnswer = useChallengeStore((s) => s.getAnswer)
  const answers = useChallengeStore((s) => s.answers)

  // Clear answers when attemptId changes (new attempt) or when stored attempt doesn't match
  useEffect(() => {
    if (attemptId) {
      // If attemptId changed, or if stored attempt doesn't match current attemptId, clear answers
      if (attemptId !== lastAttemptId || (currentAttempt && currentAttempt.id !== attemptId)) {
        clearAnswers()
        setSelectedAnswer([])
      }
      setLastAttemptId(attemptId)
    }
  }, [attemptId, lastAttemptId, currentAttempt, clearAnswers])

  // Update store when attempt loads
  useEffect(() => {
    if (attempt) {
      setCurrentAttempt(attempt)
      setStartTime(Date.now())
    }
  }, [attempt, setCurrentAttempt])

  // Load existing answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      const existingAnswer = getAnswer(currentQuestion.id)
      setSelectedAnswer(existingAnswer?.selectedOptionIndexes || [])
    }
  }, [currentQuestion, getAnswer])

  // Handle time up
  useEffect(() => {
    if (remainingTimeMs <= 0 && attempt) {
      handleComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTimeMs])

  const handleAnswerChange = (answer: number[] | Array<[number, number]> | Array<[string, number]>) => {
    if (!currentQuestion) return

    if (Array.isArray(answer) && answer.length > 0) {
      // For now, we only handle single/multiple choice (number arrays)
      if (typeof answer[0] === 'number') {
        const answerArray = answer as number[]
        setSelectedAnswer(answerArray)

        // Automatically save the answer when selected
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
        }))
      }
    }
  }

  const handleComplete = () => {
    if (!attempt) return

    setIsSubmitting(true)

    // Prepare all answers to submit
    const answersToSubmit = Object.entries(answers)
      .map(([questionId, answer]) => {
        const question = attempt.questions.find((q) => q.id === questionId)
        if (!question) return null

        const submissionData: {
          questionId: string
          selectedOptionIndexes?: number[]
          matchingPairs?: Array<{ leftContent: string; rightContent: string }>
          orderingItems?: Array<{ content: string; position: number }>
        } = {
          questionId: question.id,
        }

        if (answer.selectedOptionIndexes && answer.selectedOptionIndexes.length > 0) {
          submissionData.selectedOptionIndexes = answer.selectedOptionIndexes
        }

        if (answer.matchingPairs && answer.matchingPairs.length > 0) {
          submissionData.matchingPairs = answer.matchingPairs
        }

        if (answer.orderingItems && answer.orderingItems.length > 0) {
          submissionData.orderingItems = answer.orderingItems
        }

        return submissionData
      })
      .filter(
        (item): item is {
          questionId: string
          selectedOptionIndexes?: number[]
          matchingPairs?: Array<{ leftContent: string; rightContent: string }>
          orderingItems?: Array<{ content: string; position: number }>
        } => item !== null
      )

    if (answersToSubmit.length > 0) {
      // Submit all answers first
      submitAnswers(
        {
          attemptId: attempt.id,
          answers: answersToSubmit,
        },
        {
          onSuccess: () => {
            // Then complete the attempt
            const completionTimeMs = Date.now() - startTime
            completeAttempt(
              {
                attemptId: attempt.id,
                completionTimeMs,
              },
              {
                onSuccess: () => {
                  setIsSubmitting(false)
                  // Navigate to results page
                  router.push(`/challenge/${shareLink}/results?attemptId=${attempt.id}`)
                },
                onError: () => {
                  setIsSubmitting(false)
                },
              }
            )
          },
          onError: () => {
            setIsSubmitting(false)
          },
        }
      )
    } else {
      // If no answers, just complete
      const completionTimeMs = Date.now() - startTime
      completeAttempt(
        {
          attemptId: attempt.id,
          completionTimeMs,
        },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            // Navigate to results page
            router.push(`/challenge/${shareLink}/results?attemptId=${attempt.id}`)
          },
          onError: () => {
            setIsSubmitting(false)
          },
        }
      )
    }
  }

  if (isLoading || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!attemptId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-[var(--text-primary)] font-semibold mb-2">
              Phiên làm bài không hợp lệ
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              Vui lòng bắt đầu lại thử thách.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  // Only show existing answer if it belongs to the current attempt
  // Check that attempt exists and matches the current attemptId
  const existingAnswer = currentQuestion && attempt && attempt.id === attemptId
    ? getAnswer(currentQuestion.id) 
    : undefined

  return (
    <div className="min-h-screen bg-[var(--bg-page)] flex flex-col">
      {/* Header with timer */}
      <header className="sticky top-0 z-10 py-4 px-4 bg-[var(--bg-surface)] border-b border-[var(--border)] shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-[var(--text-primary)] font-semibold">
            {attempt.nickname}
          </div>
          <TimerDisplay />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Progress */}
          <ChallengeProgress />

          {/* Time warning */}
          {remainingTimeMs <= CHALLENGE_CONSTANTS.TIMER.WARNING_THRESHOLD &&
            remainingTimeMs > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {CHALLENGE_CONSTANTS.MESSAGES.TIME_RUNNING_OUT}
                </AlertDescription>
              </Alert>
            )}

          {/* Question */}
          <QuestionDisplay onAnswerChange={handleAnswerChange} />

          {/* Answer status */}
          {existingAnswer && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Bạn đã trả lời câu hỏi này
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="flex gap-3">
              <Button
                variant="neutral"
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Câu trước
              </Button>
              {currentQuestion && (
                <FlagButton
                  attemptId={attempt.id}
                />
              )}
            </div>

            <div className="flex gap-3">
              {isLastQuestion ? (
                <Button
                  variant="default"
                  onClick={handleComplete}
                  disabled={isSubmitting || isSubmittingAnswers || isCompleting}
                >
                  {isSubmitting || isSubmittingAnswers || isCompleting ? 'Đang hoàn thành...' : 'Hoàn thành'}
                </Button>
              ) : (
                <Button
                  variant="neutral"
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                >
                  Câu tiếp →
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigation */}
          <QuestionNavigation />
        </div>
      </main>
    </div>
  )
}

export default function ChallengeTakePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <ChallengeTakingContent />
    </Suspense>
  )
}

