"use client";

import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/shared/ui/separator";
import {
  SidebarHeader,
  useSidebar,
} from "@/shared/ui/sidebar";

export function SidebarBrand() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader className="relative p-0 h-16">
      <div
        className={cn(
          "flex w-full items-center h-16",
          isCollapsed ? "justify-center px-0" : "justify-start px-4"
        )}
      >
        <div
          className={cn(
            "flex items-center",
            isCollapsed && "justify-center"
          )}
        >
          <div className="rounded-lg bg-primary text-primary-foreground p-1.5 shrink-0">
            <GraduationCap className="h-4 w-4 transition-all duration-200" />
          </div>
          <span
            className={cn(
              "text-sm font-heading font-semibold text-[var(--text-primary)] transition-all duration-200 whitespace-nowrap",
              isCollapsed ? "opacity-0 w-0 overflow-hidden ml-0" : "opacity-100 ml-2"
            )}
          >
            <span className="text-lg font-bold tracking-wide text-primary">
              ThinkTogether
            </span>
          </span>
        </div>
      </div>
      <Separator className="absolute bottom-0 left-0 right-0" />
    </SidebarHeader>
  );
}

