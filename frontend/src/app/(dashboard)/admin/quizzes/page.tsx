'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { QuizList } from '@/features/quiz/components/quiz-list'
import { QuizFilters } from '@/features/quiz/components/quiz-filters'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/shared/ui/pagination'

export default function QuizzesAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  // Mock data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quizzes = [] as any[]
  const isLoading = false

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Quản Lý Quiz
        </h1>
        <p className="text-muted-foreground mt-2">
          Xem, chỉnh sửa, và quản lý tất cả quiz trên hệ thống.
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Quiz</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả quiz trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <QuizFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <QuizList
            quizzes={quizzes}
            isLoading={isLoading}
            onView={(quiz) => console.log('View quiz', quiz)}
          />

          {/* Pagination Placeholder */}
          {/* <Pagination>...</Pagination> */}
        </CardContent>
      </Card>
    </div>
  )
}
