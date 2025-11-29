'use client'

import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import { useQuizSet } from '@/features/quiz/hooks/use-quiz-set'
import { useQuestions } from '@/features/quiz/hooks/use-questions'
import { 
  QuizDetailHeader, 
  QuizInfoStats, 
  QuizPreviewQuestions,
  QuizActions 
} from '@/features/quiz/components'

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const quizSetId = params.id as string

  const { quizSet, isLoadingQuizSet } = useQuizSet(quizSetId)
  const { questions, isLoadingQuestions } = useQuestions(quizSetId, { pageSize: 10 })

  const handleBack = () => {
    router.back()
  }

  const handleStart = () => {
    // Navigate to play/lobby page (to be implemented)
    console.log('Start quiz', quizSetId)
    // router.push(ROUTES.quiz.play(quizSetId)) 
  }

  const handleViewAllQuestions = () => {
    // Navigate to edit page or questions page (to be implemented)
    console.log('View all questions', quizSetId)
  }

  if (isLoadingQuizSet) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      </DashboardLayout>
    )
  }

  if (!quizSet) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
            Không tìm thấy bộ trắc nghiệm
          </h2>
          <button
            onClick={handleBack}
            className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] underline"
          >
            Quay lại
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <QuizDetailHeader quizSet={quizSet} onBack={handleBack} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Preview Questions and More Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Preview Section */}
            <QuizPreviewQuestions
              questions={questions}
              isLoading={isLoadingQuestions}
              total={quizSet.questionCount || 0}
              onViewAll={handleViewAllQuestions}
              showViewAllButton={true}
              maxPreview={3}
            />
          </div>

          {/* Right Sidebar: Stats and Actions */}
          <div className="space-y-6">
            {/* Info Stats Card */}
            <QuizInfoStats quizSet={quizSet} />

            {/* Action Card */}
            <QuizActions 
              quizSet={quizSet} 
              onStart={handleStart}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

