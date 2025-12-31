"use client";

import {
  NavbarBreadcrumb,
  NavbarSearch,
  NavbarActions,
} from "./components";

export function DashboardNavbar() {
  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-[var(--bg-page)]/95 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <NavbarBreadcrumb />
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-xl px-4">
        <NavbarSearch />
      </div>
      <NavbarActions />
    </header>
  );
}
