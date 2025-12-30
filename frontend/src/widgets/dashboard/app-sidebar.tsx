"use client";

import * as React from "react"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Clock,
  GraduationCap,
  Home,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { useAuthStore, selectUser, selectIsHydrated } from "@/features/auth/stores/auth.store";
import { ROUTES } from "@/config/routes";
import { BecomeCreatorButton } from "@/features/become-creator";
import { BecomeCreatorModal } from "@/features/become-creator/components/modal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/ui/sidebar";

// Data structure
const data = {
  navMain: [
    {
      title: "Menu chính",
      items: [
        { title: "Trang chủ", url: ROUTES.dashboard.home, icon: Home },
        { title: "Bộ câu hỏi", url: ROUTES.quiz.list, icon: BookOpen },
        { title: "Lớp học", url: ROUTES.classes.list, icon: GraduationCap },
        { title: "Bảng xếp hạng", url: ROUTES.leaderboard, icon: TrendingUp },
        { title: "Tiến trình", url: "/progress", icon: Activity },
      ],
    },
    {
      title: "Khác",
      items: [
        { title: "Bài đã lưu", url: "/saved", icon: Star },
        { title: "Lịch sử", url: "/history", icon: Clock },
        { title: "Cộng đồng", url: "/community", icon: Users },
        { title: "Cài đặt", url: "/settings", icon: Settings },
      ],
    },
  ],
};

function SidebarHeaderContent() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn(
      "flex w-full items-center px-2 min-h-[2.5rem]",
      isCollapsed ? "justify-center" : "justify-start"
    )}>
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-[var(--brand-primary)] p-1.5 shrink-0">
          <BookOpen className={cn(
            "text-white transition-all duration-200",
            isCollapsed ? "h-6 w-6" : "h-5 w-5"
          )} />
        </div>
        <span className={cn(
          "text-sm font-heading font-semibold text-[var(--text-primary)] transition-all duration-200 whitespace-nowrap",
          isCollapsed ? "opacity-0 w-0 overflow-hidden ml-0" : "opacity-100 ml-0"
        )}>
          ThinkTogether
        </span>
      </div>
    </div>
  );
}

function SidebarFooterContent() {
  const { state } = useSidebar();
  const isHydrated = useAuthStore(selectIsHydrated);
  const user = useAuthStore(selectUser);
  const isCollapsed = state === "collapsed";
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showBecomeCreator = isHydrated && user?.role !== "Creator";

  if (!showBecomeCreator) return null;

  return (
    <>
      <SidebarFooter>
        {isCollapsed ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsModalOpen(true)}
                tooltip="Trở thành Người sáng tạo"
                className="group-data-[state=collapsed]:justify-center"
              >
                <Sparkles className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5 transition-all duration-200" />
                <span className="group-data-[state=collapsed]:hidden">Trở thành Người sáng tạo</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <BecomeCreatorButton className="w-full justify-start text-left" />
        )}
      </SidebarFooter>

      <BecomeCreatorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooterContent />
      <SidebarRail />
    </Sidebar>
  );
}
