'use client'

import { redirect } from 'next/navigation'
import { useAuthStore, selectUser, selectIsHydrated } from '@/features/auth/stores/auth.store'
import { SidebarProvider, SidebarTrigger } from '@/shared/ui/sidebar'
import { Separator } from '@/shared/ui/separator'
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
    redirect('/login')
  }

  if (user.role !== 'Admin') {
    redirect('/home')
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="relative flex h-16 shrink-0 items-center gap-2 bg-[var(--bg-page)]/95 backdrop-blur px-4 border-b border-[var(--border-color)]">
        <div className="flex-1">
          <DashboardNavbar />
        </div>
        <Separator className="absolute bottom-0 left-0 right-0" />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-surface)] overflow-y-auto">
          <div className="p-6">
            <AdminSidebar />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-page)]">
          <div className="px-10 py-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
