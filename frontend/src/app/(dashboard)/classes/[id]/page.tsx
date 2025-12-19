'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Home, BookOpen, Users, Plus, Copy } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent } from '@/shared/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { LoadingSpinner } from '@/shared/ui/loading-spinner'
import { DashboardLayout } from '@/widgets/dashboard'
import {
  ClassDetailHeader,
  ClassMembersList,
  HomeworkList,
  HomeworkForm,
  useClass,
  useCreateHomework,
  useUpdateHomework,
  useDeleteHomework,
  CLASS_CONSTANTS,
} from '@/features/class'
import { challengeService, useStartAttempt } from '@/features/challenge'
import { ROUTES } from '@/config/routes'
import { useAuthStore, selectUser } from '@/features/auth/stores/auth.store'
import { toast } from 'sonner'
import type { HomeworkDto } from '@/features/class/types'

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const classId = params.id as string
  const user = useAuthStore(selectUser)
  const isTeacher = user?.role === 'Creator' || user?.role === 'Admin'

  const [activeTab, setActiveTab] = useState('home')
  const [isCreateHomeworkModalOpen, setIsCreateHomeworkModalOpen] = useState(false)
  const [editingHomework, setEditingHomework] = useState<HomeworkDto | null>(null)

  const { data: classData, isLoading: isLoadingClass, error } = useClass(classId)

  const createHomeworkMutation = useCreateHomework()
  const updateHomeworkMutation = useUpdateHomework()
  const deleteHomeworkMutation = useDeleteHomework()
  const { mutate: startAttempt } = useStartAttempt()

  const handleCreateHomework = async (
    data: Parameters<typeof createHomeworkMutation.mutateAsync>[0]
  ) => {
    try {
      await createHomeworkMutation.mutateAsync(data)
      setIsCreateHomeworkModalOpen(false)
    } catch (error) {
      console.error('Failed to create homework:', error)
    }
  }

  const handleUpdateHomework = async (
    data: Parameters<typeof updateHomeworkMutation.mutateAsync>[0]['data']
  ) => {
    if (!editingHomework) return

    try {
      await updateHomeworkMutation.mutateAsync({
        classId,
        homeworkId: editingHomework.id,
        data,
      })
      setEditingHomework(null)
    } catch (error) {
      console.error('Failed to update homework:', error)
    }
  }

  const handleDeleteHomework = async (homework: HomeworkDto) => {
    if (!confirm(CLASS_CONSTANTS.MESSAGES.CONFIRM_DELETE_HOMEWORK)) {
      return
    }

    try {
      await deleteHomeworkMutation.mutateAsync({
        classId,
        homeworkId: homework.id,
      })
    } catch (error) {
      console.error('Failed to delete homework:', error)
    }
  }

  const handleStartHomework = async (homework: HomeworkDto) => {
    // First, try to get challenge by quiz set ID
    try {
      const challenge = await challengeService.getChallengeByQuizSetId(homework.quizSetId)
      
      if (challenge) {
        // If user is logged in, auto-start with their name
        if (user?.id) {
          startAttempt(
            {
              challengeId: challenge.id,
              nickname: user.fullName || user.email || 'Học sinh',
              userId: user.id,
              homeworkId: homework.id,
            },
            {
              onSuccess: (attempt) => {
                // Navigate directly to taking page
                router.push(`/challenge/${challenge.shareLink}/take?attemptId=${attempt.id}&homeworkId=${homework.id}`)
              },
              onError: () => {
                toast.error('Không thể bắt đầu làm bài. Vui lòng thử lại.')
              },
            }
          )
        } else {
          // Not logged in, redirect to challenge page with homeworkId in query
          router.push(`${ROUTES.game.challenge(challenge.shareLink)}?homeworkId=${homework.id}`)
        }
      } else {
        // No challenge exists for this quiz set
        toast.error('Chưa có thử thách cho bài tập này. Vui lòng liên hệ giáo viên.')
      }
    } catch (error) {
      console.error('Failed to get challenge:', error)
      toast.error('Không thể tải thử thách. Vui lòng thử lại.')
    }
  }

  const handleCopyJoinCode = () => {
    if (classData?.joinCode) {
      navigator.clipboard.writeText(classData.joinCode)
      // Toast notification can be added here
    }
  }

  const handleEdit = () => {
    // TODO: Implement edit class
  }

  const handleDelete = () => {
    // TODO: Implement delete class
  }

  if (isLoadingClass) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !classData) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-secondary)]">
                {error ? 'Không thể tải lớp học' : 'Lớp học không tồn tại'}
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <ClassDetailHeader
          classData={classData}
          isTeacher={isTeacher}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCopyJoinCode={handleCopyJoinCode}
        />

        {/* Tabs Navigation */}
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="home" className="gap-2">
                <Home className="h-4 w-4" />
                Chung
              </TabsTrigger>
              <TabsTrigger value="classwork" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Bài tập
              </TabsTrigger>
              <TabsTrigger value="people" className="gap-2">
                <Users className="h-4 w-4" />
                Thành viên
              </TabsTrigger>
            </TabsList>

            {/* Home Tab */}
            <TabsContent value="home" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Upcoming Homeworks */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                          Bài tập sắp đến hạn
                        </h2>
                        {isTeacher && (
                          <Button
                            variant="neutral"
                            size="sm"
                            onClick={() => {
                              setIsCreateHomeworkModalOpen(true)
                              setActiveTab('classwork')
                            }}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Tạo bài tập
                          </Button>
                        )}
                      </div>
                      {classData.homeworks && classData.homeworks.length > 0 ? (
                        <div className="space-y-3">
                          {classData.homeworks
                            .filter((h) => {
                              if (!h.dueDate) return false
                              const dueDate = new Date(h.dueDate)
                              const now = new Date()
                              const daysUntilDue = Math.ceil(
                                (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                              )
                              return daysUntilDue >= 0 && daysUntilDue <= 7
                            })
                            .slice(0, 5)
                            .map((homework) => (
                              <div
                                key={homework.id}
                                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-[var(--bg-surface-secondary)]"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-[var(--text-primary)]">
                                    {homework.title}
                                  </p>
                                  {homework.dueDate && (
                                    <p className="text-sm text-[var(--text-secondary)]">
                                      Hạn nộp:{' '}
                                      {new Date(homework.dueDate).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      })}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="neutral"
                                  size="sm"
                                  onClick={() => handleStartHomework(homework)}
                                >
                                  Làm bài
                                </Button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[var(--text-secondary)]">
                          Không có bài tập sắp đến hạn
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)] mb-4">
                        Hoạt động gần đây
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Chưa có hoạt động nào
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                        Thống kê nhanh
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">
                            Tổng bài tập
                          </span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {classData.homeworks?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">
                            Đã nộp
                          </span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {classData.homeworks?.reduce(
                              (sum, h) => sum + (h.submissionCount || 0),
                              0
                            ) || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[var(--text-secondary)]">
                            Thành viên
                          </span>
                          <span className="font-semibold text-[var(--text-primary)]">
                            {classData.members?.length || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Classwork Tab */}
            <TabsContent value="classwork" className="mt-6">
              <div className="space-y-6">
                {isTeacher && (
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                      Bài tập về nhà
                    </h2>
                    <Button onClick={() => setIsCreateHomeworkModalOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Tạo bài tập mới
                    </Button>
                  </div>
                )}

                <HomeworkList
                  homeworks={classData.homeworks || []}
                  isLoading={false}
                  onCreateNew={isTeacher ? () => setIsCreateHomeworkModalOpen(true) : undefined}
                  onEdit={isTeacher ? setEditingHomework : undefined}
                  onDelete={isTeacher ? handleDeleteHomework : undefined}
                  onStart={handleStartHomework}
                />
              </div>
            </TabsContent>

            {/* People Tab */}
            <TabsContent value="people" className="mt-6">
              <ClassMembersList
                members={classData.members || []}
                isLoading={false}
                isTeacher={isTeacher}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Create Homework Modal */}
        <Dialog open={isCreateHomeworkModalOpen} onOpenChange={setIsCreateHomeworkModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo bài tập về nhà mới</DialogTitle>
            </DialogHeader>
            <HomeworkForm
              classId={classId}
              onSubmit={handleCreateHomework}
              onCancel={() => setIsCreateHomeworkModalOpen(false)}
              isSubmitting={createHomeworkMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Homework Modal */}
        <Dialog open={!!editingHomework} onOpenChange={(open) => !open && setEditingHomework(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa bài tập về nhà</DialogTitle>
            </DialogHeader>
            {editingHomework && (
              <HomeworkForm
                classId={classId}
                homework={editingHomework}
                onSubmit={handleUpdateHomework}
                onCancel={() => setEditingHomework(null)}
                isSubmitting={updateHomeworkMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
