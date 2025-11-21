import type { ReactNode } from "react";

import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <DashboardSidebar />
      <div className="pl-64">
        <DashboardNavbar />
        <main className="min-h-screen bg-[var(--bg-surface)] px-10 pb-12 pt-24">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
