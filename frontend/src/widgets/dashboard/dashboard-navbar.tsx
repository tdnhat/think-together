"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Bell, GraduationCap, Search } from "lucide-react";
import { toastSuccess } from "@/lib/utils/toast";

import { Input, Button } from "@/shared";
import { ProfileDropdown } from "@/widgets/dashboard";
import { useAuth } from "@/features/auth";
import { handleError } from "@/lib/errors/error-handler";
import { ROUTES } from "@/config/routes";

export function DashboardNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const initials = useMemo(() => {
    if (!user) {
      return 'ND';
    }

    const fromName = user.name
      ?.trim()
      .split(' ')
      .filter((segment) => segment.length > 0)
      .map((segment) => segment[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase();

    if (fromName && fromName.length > 0) {
      return fromName;
    }

    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }

    return 'TT';
  }, [user]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toastSuccess('Đăng xuất thành công!');
      router.push(ROUTES.auth.login);
    } catch (error) {
      handleError(error, {
        showToast: true,
        customMessage: 'Không thể đăng xuất. Vui lòng thử lại.'
      });
    }
  }, [logout, router]);
    return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-[var(--brand-primary-shadow)] bg-[var(--bg-page)]/95 backdrop-blur">
      <div className="flex h-full w-full items-center justify-between gap-6 px-6">
        <Link href={ROUTES.dashboard.home} className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <GraduationCap className="h-8 w-8 text-[var(--brand-primary)]" />
            <span className="text-xl font-heading font-semibold text-[var(--text-primary)]">ThinkTogether</span>
          </Link>

        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]/40" />
            <Input
              type="search"
              placeholder="Tìm kiếm bộ câu hỏi..."
              className="h-10 w-full rounded-xl pl-12 pr-4 text-[var(--text-secondary)] transition-all"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            type="button"
            variant="neutral"
            size="icon"
            className="relative h-10 w-10 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--brand-secondary-hover)] bg-[var(--brand-secondary)] text-xs font-bold shadow-brutal-secondary-xs">
              3
            </span>
          </Button>

          <ProfileDropdown initials={initials} onSignOut={handleLogout} />
        </div>
      </div>
    </header>
  );
}
