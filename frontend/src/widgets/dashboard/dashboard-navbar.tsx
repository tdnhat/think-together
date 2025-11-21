"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Bell, GraduationCap, Search } from "lucide-react";
import toast from "react-hot-toast";

import { Input, Button } from "@/shared";
import { ProfileDropdown } from "@/widgets/dashboard";
import { BecomeCreatorButton } from "@/features/become-creator"
import { useAuth } from "@/features/auth";
import { handleError } from "@/lib/errors/error-handler";
import { ROUTES } from "@/config/constants";

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
      toast.success('Đăng xuất thành công!');
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      handleError(error, { 
        showToast: true, 
        customMessage: 'Không thể đăng xuất. Vui lòng thử lại.'
      });
    }
  }, [logout, router]);

  // Check if user should see the "Become a Creator" button
  const shouldShowBecomeCreator = useMemo(() => {
    return user?.isEmailVerified === true && user?.role === 'Student';
  }, [user]);

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b-4 border-[var(--color-border-main)] bg-[var(--bg-page)]/95 backdrop-blur">
      <div className="flex h-full w-full items-center justify-between gap-6 px-6">
        <Link href="/home" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <GraduationCap className="h-8 w-8 text-[var(--brand-primary)]" />
            <span className="text-xl font-heading font-semibold text-[var(--text-primary)]">ThinkTogether</span>
          </Link>

        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-secondary)]/40" />
            <Input
              type="search"
              placeholder="Tìm kiếm bộ câu hỏi..."
              className="h-10 w-full rounded-xl border-2 border-[var(--color-border-main)] pl-12 pr-4 text-[var(--text-secondary)] shadow-brutal-secondary-sm transition-all focus:shadow-brutal-secondary-sm"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {/* Show "Become a Creator" button for verified users with NGUOIDUNG role */}
          {shouldShowBecomeCreator && <BecomeCreatorButton />}

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="relative h-10 w-10 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-brutal-sm transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutal-sm"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--color-border-main)] bg-[var(--brand-secondary)] text-xs font-bold">
              3
            </span>
          </Button>

          <ProfileDropdown initials={initials} onSignOut={handleLogout} />
        </div>
      </div>
    </header>
  );
}
