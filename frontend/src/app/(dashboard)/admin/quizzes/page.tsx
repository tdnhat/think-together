'use client'

import { BookOpen, Eye } from 'lucide-react'
import { useState } from 'react'
import { DashboardLayout } from '@/widgets/dashboard'
import { PageHeader, PageContainer, ContentCard, FilterBar, EmptyState, DataTable } from '@/shared/components/page'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'

// Mock type until we have real QuizDto
interface QuizDto {
  id: string
  title: string
  category: string
  author: string
  questionsCount: number
  status: 'published' | 'draft'
  createdAt: string
}

export default function QuizzesAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const quizzes: QuizDto[] = []
  const isLoading = false

  return (
    <DashboardLayout>
      <PageContainer>
        <PageHeader
          icon={BookOpen}
          title="Quản Lý Quiz"
          description="Xem, chỉnh sửa, và quản lý tất cả quiz trên hệ thống."
        />

        <ContentCard
          title="Danh Sách Quiz"
          description="Xem và quản lý tất cả quiz trong hệ thống"
        >
          <FilterBar
            searchPlaceholder="Tìm kiếm quiz..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <DataTable<QuizDto>
            data={quizzes}
            columns={[
              {
                key: 'title',
                header: 'Tên Quiz',
                cell: (quiz) => <span className="font-medium">{quiz.title}</span>,
              },
              {
                key: 'category',
                header: 'Danh mục',
                cell: (quiz) => quiz.category,
              },
              {
                key: 'author',
                header: 'Tác giả',
                cell: (quiz) => quiz.author,
              },
              {
                key: 'questions',
                header: 'Số câu hỏi',
                cell: (quiz) => quiz.questionsCount,
                headerClassName: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'status',
                header: 'Trạng thái',
                cell: (quiz) => (
                  <Badge variant={quiz.status === 'published' ? 'default' : 'secondary'}>
                    {quiz.status === 'published' ? 'Công khai' : 'Nháp'}
                  </Badge>
                ),
                headerClassName: 'text-center',
                cellClassName: 'text-center',
              },
              {
                key: 'actions',
                header: 'Hành động',
                cell: (quiz) => (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log('View quiz', quiz)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem</span>
                    </Button>
                  </div>
                ),
                headerClassName: 'text-right',
                cellClassName: 'text-right',
              },
            ]}
            getRowKey={(quiz) => quiz.id}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                icon={BookOpen}
                title="Chưa có quiz nào"
                description="Hệ thống chưa có quiz nào. Quiz sẽ xuất hiện ở đây khi được tạo."
              />
            }
          />
        </ContentCard>
      </PageContainer>
    </DashboardLayout>
  )
}
