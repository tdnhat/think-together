"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import { Bell } from "lucide-react";
import { toastSuccess } from "@/lib/utils/toast";

import { Button } from "@/shared";
import { Badge } from "@/shared/ui/badge";
import { SearchInput } from "@/shared/components";
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
    <div className="flex flex-1 items-center justify-between gap-4 px-4">
      <div className="flex flex-1 justify-center">
        <SearchInput
          className="w-full max-w-xl"
          placeholder="Tìm kiếm bộ câu hỏi..."
          value=""
          onChange={() => { }}
          iconColor="text-[var(--text-secondary)]/40"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <Badge variant="default" className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center p-0 text-xs font-bold">
            3
          </Badge>
        </Button>

        <ProfileDropdown initials={initials} onSignOut={handleLogout} />
      </div>
    </div>
  );
}
