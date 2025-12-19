"use client";

import { useState } from "react";
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

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
}

const mainMenuItems: SidebarItem[] = [
  { icon: Home, label: "Trang chủ", href: ROUTES.dashboard.home },
  { icon: BookOpen, label: "Bộ câu hỏi", href: ROUTES.quiz.list },
  { icon: GraduationCap, label: "Lớp học", href: ROUTES.classes.list },
  { icon: TrendingUp, label: "Bảng xếp hạng", href: ROUTES.leaderboard },
  { icon: Activity, label: "Tiến trình", href: "/progress" },
];

const otherMenuItems: SidebarItem[] = [
  { icon: Star, label: "Bài đã lưu", href: "/saved" },
  { icon: Clock, label: "Lịch sử", href: "/history" },
  { icon: Users, label: "Cộng đồng", href: "/community" },
  { icon: Settings, label: "Cài đặt", href: "/settings" },
];

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isHydrated || user?.role === "Creator") {
    return null;
  }

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
      {isCollapsed && (
        <BecomeCreatorModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarHeaderContent />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu chính</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center justify-start gap-2 group-data-[state=collapsed]:gap-0 group-data-[state=collapsed]:justify-center">
                      <item.icon className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5 transition-all duration-200" />
                      <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                      {item.badge && (
                        <Badge variant="neutral" className="ml-auto group-data-[state=collapsed]:hidden">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Khác</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center justify-start gap-2 group-data-[state=collapsed]:gap-0 group-data-[state=collapsed]:justify-center">
                      <item.icon className="h-4 w-4 group-data-[state=collapsed]:h-5 group-data-[state=collapsed]:w-5 transition-all duration-200" />
                      <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                      {item.badge && (
                        <Badge variant="neutral" className="ml-auto group-data-[state=collapsed]:hidden">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooterContent />
      <SidebarRail />
    </Sidebar>
  );
}
