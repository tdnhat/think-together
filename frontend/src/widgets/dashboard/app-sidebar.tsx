"use client";

import { Sidebar, SidebarRail } from "@/shared/ui/sidebar";
import {
  SidebarBrand,
  SidebarNavigation,
  SidebarFooterContent,
} from "./components";

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarBrand />
      <SidebarNavigation />
      <SidebarFooterContent />
      <SidebarRail />
    </Sidebar>
  );
}
