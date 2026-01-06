"use client";

import {
  NavbarBreadcrumb,
  NavbarActions,
} from "./components";

export function DashboardNavbar() {
  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <NavbarBreadcrumb />
      <NavbarActions />
    </header>
  );
}
