import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardNavbar } from '@/components/layout/dashboard-navbar';
import type { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardNavbar />
        <main className="min-h-screen bg-[#F8FAFC] px-10 pb-12 pt-24">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
