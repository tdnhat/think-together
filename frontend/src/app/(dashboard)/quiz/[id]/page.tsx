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
import { useCreateChallenge, useChallengeByQuizSetId } from '@/features/challenge'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export default function QuizDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const quizSetId = params.id as string

  const { quizSet, isLoadingQuizSet } = useQuizSet(quizSetId)
  const { questions, isLoadingQuestions } = useQuestions(quizSetId, { pageSize: 10 })
  const { data: existingChallenge, isLoading: isLoadingChallenge } = useChallengeByQuizSetId(quizSetId)
  const { mutate: createChallenge, isPending: isCreatingChallenge } = useCreateChallenge()

  const handleBack = () => {
    router.back()
  }

  const handleStart = () => {
    // Navigate to play/lobby page (to be implemented)
    console.log('Start quiz', quizSetId)
    // router.push(ROUTES.quiz.play(quizSetId)) 
  }

  const handleCreateChallenge = () => {
    if (!quizSet) return

    createChallenge(
      {
        quizSetId: quizSet.id,
        title: quizSet.title,
        description: quizSet.description,
      },
      {
        onSuccess: (challenge) => {
          toast.success('Thử thách đã được tạo thành công!')
          // Invalidate query to refetch challenge
          queryClient.invalidateQueries({ queryKey: ['challenge-by-quiz', quizSetId] })
          // Navigate to challenge details
          router.push(`/quiz/${quizSetId}/challenge`)
        },
      }
    )
  }

  const handleViewChallenge = () => {
    router.push(`/quiz/${quizSetId}/challenge`)
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
              challenge={existingChallenge}
              onStart={handleStart}
              onCreateChallenge={handleCreateChallenge}
              onViewChallenge={handleViewChallenge}
              isCreatingChallenge={isCreatingChallenge}
              isLoadingChallenge={isLoadingChallenge}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

