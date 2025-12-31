'use client'

import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/widgets/dashboard'
import { JoinClassForm, useJoinClass, CLASS_CONSTANTS } from '@/features/class'
import { ROUTES } from '@/config/routes'

export default function JoinClassPage() {
  const router = useRouter()
  const joinClassMutation = useJoinClass()

  const handleJoin = async (joinCode: string) => {
    try {
      const classData = await joinClassMutation.mutateAsync({ joinCode })
      router.push(ROUTES.classes.detail(classData.id))
    } catch (error) {
      console.error('Failed to join class:', error)
      // Error handling and toast notification can be added here
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Tham gia lớp học
            </h1>
            <p className="mt-2 text-muted-foreground">
              Nhập mã tham gia do giáo viên cung cấp để tham gia lớp học
            </p>
          </div>

          <JoinClassForm
            onSubmit={handleJoin}
            isSubmitting={joinClassMutation.isPending}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
