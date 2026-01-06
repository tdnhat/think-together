"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import { SIDEBAR_NAVIGATION, type NavigationGroup } from "../constants";

interface SidebarNavigationProps {
  groups?: NavigationGroup[];
}

/**
 * Check if a menu item is active based on the current pathname
 * Handles both exact matches and nested routes
 */
function isMenuItemActive(pathname: string, itemUrl: string): boolean {
  // Exact match
  if (pathname === itemUrl) {
    return true;
  }

  // Nested route match (e.g., /my-quizzes/123 matches /my-quizzes)
  // But /home should not match /homeworks
  if (pathname.startsWith(itemUrl + "/")) {
    return true;
  }

  return false;
}

export function SidebarNavigation({
  groups = SIDEBAR_NAVIGATION,
}: SidebarNavigationProps) {
  const pathname = usePathname();

  return (
    <SidebarContent>
      {groups.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = isMenuItemActive(pathname, item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={cn(
                            isActive && "text-primary-foreground"
                          )}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}
