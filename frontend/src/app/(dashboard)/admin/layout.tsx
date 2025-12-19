'use client'

import { redirect } from 'next/navigation'
import { useAuthStore, selectUser, selectIsHydrated } from '@/features/auth/stores/auth.store'
import { DashboardLayout } from '@/widgets/dashboard/dashboard-layout'
import { AdminSidebar } from '@/widgets/admin/admin-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const isHydrated = useAuthStore(selectIsHydrated)
  const user = useAuthStore(selectUser)

  // Wait for store to hydrate
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Đang tải...</div>
      </div>
    )
  }

  // Redirect if not authenticated or not admin
  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'Admin') {
    redirect('/home')
  }

  return (
    <DashboardLayout>
      <div className="flex gap-6">
        <aside className="w-64 flex-shrink-0">
          <AdminSidebar />
        </aside>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </DashboardLayout>
  )
}
