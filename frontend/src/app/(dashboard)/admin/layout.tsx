'use client'

import { redirect } from 'next/navigation'
import { useAuthStore, selectUser, selectIsHydrated } from '@/features/auth/stores/auth.store'
import { SidebarInset, SidebarProvider } from '@/shared/ui/sidebar'
import { ROUTES } from '@/config/routes'
import { DashboardNavbar } from '@/widgets/dashboard/dashboard-navbar'
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
    redirect(ROUTES.auth.login)
  }

  if (user.role !== 'Administrator') {
    redirect(ROUTES.dashboard.home)
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="flex flex-1 flex-col bg-background px-6 pb-12 pt-8 overflow-hidden">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
