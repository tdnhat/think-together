'use client'

import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/widgets/dashboard'
import { useQuizSet } from '@/features/quiz/hooks/use-quiz-set'
import { useQuestions } from '@/features/quiz/hooks/use-questions'
import {
  QuizDetailHeader,
  QuizInfoStats,
  QuizPreviewQuestions,
  QuizActions,
} from '@/features/quiz/components'
import { useChallengeByQuizSetId } from '@/features/challenge'
import { useQuizDetailActions, useQuizExport } from '@/features/quiz/hooks/detail'
import { QuizDetailLoading, QuizDetailError } from '@/features/quiz/components/detail'
import { DEFAULT_QUESTION_PAGE_SIZE, DEFAULT_QUESTION_PREVIEW_COUNT } from '@/features/quiz/constants/detail'

export default function QuizDetailPage() {
  const params = useParams()
  const quizSetId = params.id as string

  const { quizSet, isLoadingQuizSet } = useQuizSet(quizSetId)
  const { questions, isLoadingQuestions } = useQuestions(quizSetId, {
    pageSize: DEFAULT_QUESTION_PAGE_SIZE,
  })
  const { data: existingChallenge, isLoading: isLoadingChallenge } =
    useChallengeByQuizSetId(quizSetId)

  const {
    handleBack,
    handleStart,
    handleCreateChallenge,
    handleViewChallenge,
    handleViewAllQuestions,
    isCreatingChallenge,
  } = useQuizDetailActions(quizSetId, quizSet)

  const { isExporting, handleExportPdf } = useQuizExport(quizSet)

  if (isLoadingQuizSet) {
    return <QuizDetailLoading />
  }

  if (!quizSet) {
    return <QuizDetailError onBack={handleBack} />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <QuizDetailHeader quizSet={quizSet} onBack={handleBack} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <QuizPreviewQuestions
              questions={questions}
              isLoading={isLoadingQuestions}
              total={quizSet.questionCount || 0}
              onViewAll={handleViewAllQuestions}
              showViewAllButton={true}
              maxPreview={DEFAULT_QUESTION_PREVIEW_COUNT}
            />
          </div>

          <div className="space-y-6">
            <QuizInfoStats quizSet={quizSet} />

            <QuizActions
              quizSet={quizSet}
              challenge={existingChallenge}
              onStart={handleStart}
              onCreateChallenge={handleCreateChallenge}
              onViewChallenge={handleViewChallenge}
              isCreatingChallenge={isCreatingChallenge}
              isLoadingChallenge={isLoadingChallenge}
              onExportPdf={handleExportPdf}
              isExportingPdf={isExporting}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

