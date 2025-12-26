import type { ReactNode } from "react";

import {
  SidebarProvider,
} from "@/shared/ui/sidebar";
import { Separator } from "@/shared/ui/separator";
import { DashboardNavbar } from "./dashboard-navbar";
import { AppSidebar } from "./app-sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: Readonly<DashboardLayoutProps>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <header className="relative flex h-16 shrink-0 items-center gap-2 bg-[var(--bg-page)]/95 backdrop-blur">

          <DashboardNavbar />
          <Separator className="absolute bottom-0 left-0 right-0" />
        </header>
        <main className="flex flex-1 flex-col bg-[var(--bg-surface)] px-10 pb-12 pt-8 overflow-hidden">
          <div className="mx-auto w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
