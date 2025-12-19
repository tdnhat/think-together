'use client'

import { Suspense, useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { Card, CardContent } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { PageLayout, PageMain } from '@/shared/components'
import { ChallengeProgress, QuestionDisplay, QuestionGrid, useChallengeStore, useAttempt, useSubmitAnswers, selectCurrentQuestion, selectCurrentQuestionIndex, selectTotalQuestions, selectRemainingTime, } from '@/features/challenge'
import { CHALLENGE_CONSTANTS } from '@/features/challenge/constants'
import { AlertCircle } from 'lucide-react'

function ChallengeTakingContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const shareLink = params.link as string
  const attemptId = searchParams.get('attemptId')
  const homeworkId = searchParams.get('homeworkId')

  const [startTime, setStartTime] = useState<number>(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null)

  // Get attempt data from backend
  const { data: attempt, isLoading } = useAttempt(attemptId || undefined)

  // Mutations
  const { mutate: submitAnswers, isPending: isSubmittingAnswers } = useSubmitAnswers()

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
      getAnswer(currentQuestion.id)
    }
  }, [currentQuestion, getAnswer])

  // Handle time up
  useEffect(() => {
    if (remainingTimeMs <= 0 && attempt) {
      handleComplete()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTimeMs])

  const handleAnswerChange = (
    answer:
      | number[]
      | Array<[number, number]>
      | Array<[string, number]>
      | Array<{ leftContent: string; rightContent: string }>
      | Array<{ content: string; position: number }>
  ) => {
    if (!currentQuestion) return

    if (Array.isArray(answer) && answer.length > 0) {
      // Handle single/multiple choice (number arrays)
      if (typeof answer[0] === 'number') {
        const answerArray = answer as number[]

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
      // Handle matching questions
      else if (
        answer.length > 0 &&
        typeof answer[0] === 'object' &&
        'leftContent' in answer[0] &&
        'rightContent' in answer[0]
      ) {
        const matchingPairs = answer as Array<{ leftContent: string; rightContent: string }>

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
        }))
      }
      // Handle ordering questions
      else if (
        answer.length > 0 &&
        typeof answer[0] === 'object' &&
        'content' in answer[0] &&
        'position' in answer[0]
      ) {
        const orderingItems = answer as Array<{ content: string; position: number }>

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

    // Submit all answers (server grades immediately and returns completed attempt)
    submitAnswers(
      {
        attemptId: attempt.id,
        answers: answersToSubmit,
        homeworkId: homeworkId || undefined,
      },
      {
        onSuccess: (completedAttempt) => {
          setIsSubmitting(false)
          
          // Update store with completed attempt so results page has fresh data
          setCurrentAttempt({
            ...completedAttempt,
            currentQuestionIndex: 0,
            flaggedQuestionIds: [],
            questions: completedAttempt.questions.map(q => ({
              ...q,
              isFlagged: false,
              isAnswered: true,
              answer: undefined,
            })),
          })
          
          // Navigate to results page with homeworkId if present
          const queryParams = new URLSearchParams()
          queryParams.set('attemptId', attempt.id)
          if (homeworkId) {
            queryParams.set('homeworkId', homeworkId)
          }
          router.push(`/challenge/${shareLink}/results?${queryParams.toString()}`)
        },
        onError: () => {
          setIsSubmitting(false)
        },
      }
    )
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

  return (
    <PageLayout>
      {/* Main Content */}
      <PageMain className="py-6">
        <div className="space-y-4">
          {/* Progress (match reference layout) */}
          <ChallengeProgress />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Question */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question */}
            <QuestionDisplay onAnswerChange={handleAnswerChange} />

            {/* Time warning */}
            {remainingTimeMs <= CHALLENGE_CONSTANTS.TIMER.WARNING_THRESHOLD &&
              remainingTimeMs > 0 && (
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {CHALLENGE_CONSTANTS.MESSAGES.TIME_RUNNING_OUT}
                  </AlertDescription>
                </Alert>
              )}

            {/* Navigation buttons (match reference layout) */}
            <Card className="py-4 gap-0">
              <CardContent className="flex items-center justify-between">
                <Button
                  variant="neutral"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Trước
                </Button>

                {isLastQuestion ? (
                  <Button
                    variant="default"
                    onClick={handleComplete}
                    disabled={isSubmitting || isSubmittingAnswers}
                  >
                    {isSubmitting || isSubmittingAnswers ? 'Đang nộp bài...' : 'Hoàn thành'}
                  </Button>
                ) : (
                  <Button
                    variant="neutral"
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                  >
                    Tiếp theo →
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Overview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <QuestionGrid
                questions={attempt.questions}
                onQuestionClick={(index) => {
                  useChallengeStore.getState().jumpToQuestion(index)
                }}
                onSubmit={handleComplete}
                isSubmitting={isSubmitting || isSubmittingAnswers}
                submitDisabled={isSubmitting || isSubmittingAnswers}
              />
            </div>
          </div>
        </div>
      </PageMain>
    </PageLayout>
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
