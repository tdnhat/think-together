import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/ui/sidebar";
import { DashboardNavbar } from "./dashboard-navbar";
import { AppSidebar } from "./app-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="flex flex-1 flex-col bg-[var(--bg-surface)] px-6 pb-12 pt-8 overflow-hidden">
            <div className="mx-auto w-full max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
