/**
 * Host Page Error Component
 */

'use client'

import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { Button } from '@/shared/ui/button'
import { ROUTES } from '@/config/routes'
import { useRouter } from 'next/navigation'

interface HostPageErrorProps {
  error: string
  quizId?: string | null
  onRetry?: () => void
}

export function HostPageError({ error, quizId, onRetry }: HostPageErrorProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.push(ROUTES.quiz.list)
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      <div className="flex gap-3 mt-4">
        <Button variant="outline" onClick={handleGoBack} className="gap-2">
          <ArrowLeft className="h-5 w-5" />
          Quay lại
        </Button>
        {quizId && onRetry && (
          <Button variant="default" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-5 w-5" />
            Thử lại
          </Button>
        )}
      </div>
    </div>
  )
}

