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


interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
}

const mainMenuItems: SidebarItem[] = [
  { icon: Home, label: "Trang chủ", href: "/home" },
  { icon: BookOpen, label: "Bộ câu hỏi", href: "/quiz" },
  { icon: TrendingUp, label: "Bảng xếp hạng", href: "/leaderboard" },
  { icon: Activity, label: "Tiến trình", href: "/progress" },
];

const otherMenuItems: SidebarItem[] = [
  { icon: Star, label: "Bài đã lưu", href: "/saved" },
  { icon: Clock, label: "Lịch sử", href: "/history" },
  { icon: Users, label: "Cộng đồng", href: "/community" },
  { icon: Settings, label: "Cài đặt", href: "/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--color-border-main)] bg-[var(--bg-surface)]">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <nav className="space-y-6">
            <section>
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]/70">
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
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]/70">
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
      ? "bg-[var(--brand-primary)] text-white shadow-brutal-sm"
      : "bg-[var(--brand-secondary)] text-[var(--text-primary)] shadow-brutal-sm";
  const baseClasses = isActive ? activeClasses : "text-[var(--text-primary)]";

  let hoverClasses = "";
  let iconBaseClass = "text-white";
  let iconHoverClass = "";

  if (!isActive) {
    if (variant === "main") {
      hoverClasses = "hover:bg-[color-mix(in_oklab,var(--brand-primary)_10%,#fff_90%)] hover:text-[var(--brand-primary)]";
      iconBaseClass = "text-[var(--brand-primary)]";
      iconHoverClass = "group-hover:text-[var(--brand-primary)]";
    } else {
      hoverClasses = "hover:bg-[color-mix(in_oklab,var(--brand-secondary)_20%,#fff_80%)] hover:text-[var(--text-primary)]";
      iconBaseClass = "text-[var(--brand-secondary)]";
      iconHoverClass = "group-hover:text-[var(--brand-secondary)]";
    }
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-transform duration-150",
        baseClasses,
        hoverClasses
      )}
    >
      <Icon className={cn("h-5 w-5 transition-colors", iconBaseClass, iconHoverClass)} />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto rounded-full bg-[var(--brand-secondary)] px-2 py-0.5 text-xs font-semibold text-[var(--text-primary)]">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
