"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Clock,
  Home,
  Settings,
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

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
}

const mainMenuItems: SidebarItem[] = [
  { icon: Home, label: "Trang chủ", href: ROUTES.dashboard.home },
  { icon: BookOpen, label: "Bộ câu hỏi", href: ROUTES.quiz.list },
  { icon: TrendingUp, label: "Bảng xếp hạng", href: ROUTES.leaderboard },
  { icon: Activity, label: "Tiến trình", href: "/progress" }, // TODO: Add to routes when implemented
];

const otherMenuItems: SidebarItem[] = [
  { icon: Star, label: "Bài đã lưu", href: "/saved" }, // TODO: Add to routes when implemented
  { icon: Clock, label: "Lịch sử", href: "/history" }, // TODO: Add to routes when implemented
  { icon: Users, label: "Cộng đồng", href: "/community" }, // TODO: Add to routes when implemented
  { icon: Settings, label: "Cài đặt", href: ROUTES.dashboard.settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore(selectUser);
  const isHydrated = useAuthStore(selectIsHydrated);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <nav className="space-y-6">
            <section>
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                Menu chính
              </h2>
              <div className="space-y-2">
                {mainMenuItems.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    variant="main"
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                Khác
              </h2>
              <div className="space-y-2">
                {otherMenuItems.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    variant="other"
                  />
                ))}
              </div>
            </section>
          </nav>

          {isHydrated && user?.role !== "Creator" && (
            <div className="mt-8 px-1">
              <BecomeCreatorButton className="w-full justify-center" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  item: SidebarItem;
  isActive: boolean;
  variant: "main" | "other";
}

function SidebarLink({ item, isActive, variant }: Readonly<SidebarLinkProps>) {
  const Icon = item.icon;
  const activeClasses =
    variant === "main"
      ? "bg-primary text-primary-foreground"
      : "bg-secondary text-secondary-foreground";
  const baseClasses = isActive ? activeClasses : "text-foreground";

  let hoverClasses = "";
  let iconBaseClass = "text-primary-foreground";
  let iconHoverClass = "";

  if (!isActive) {
    if (variant === "main") {
      hoverClasses =
        "hover:bg-primary/10 hover:text-primary";
      iconBaseClass = "text-primary";
      iconHoverClass = "group-hover:text-primary";
    } else {
      hoverClasses =
        "hover:bg-secondary/20 hover:text-foreground";
      iconBaseClass = "text-secondary";
      iconHoverClass = "group-hover:text-secondary";
    }
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
        baseClasses,
        hoverClasses
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-colors",
          iconBaseClass,
          iconHoverClass
        )}
      />
      <span>{item.label}</span>
      {item.badge && (
        <Badge variant="outline" className="ml-auto">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}
