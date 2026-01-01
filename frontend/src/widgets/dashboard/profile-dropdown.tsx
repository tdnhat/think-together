"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { User, Settings, HelpCircle, LogOut, Sparkles, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { useAuthStore, selectUser } from "@/features/auth/stores/auth.store";
import { ROUTES } from "@/config/routes";
import { BecomeCreatorModal } from "@/features/become-creator";

interface ProfileDropdownProps {
  initials?: string;
  onSignOut?: () => Promise<void> | void;
}

export function ProfileDropdown({ initials = "ND", onSignOut }: Readonly<ProfileDropdownProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore(selectUser)
  const isCreator = user?.role === 'Creator' || user?.role === 'Administrator'
  const [isBecomeCreatorModalOpen, setIsBecomeCreatorModalOpen] = useState(false)

  const isOnHomePage = pathname === ROUTES.dashboard.home
  const isOnCreatorPage = pathname === ROUTES.quiz.list || pathname.startsWith(ROUTES.quiz.list)

  const handleSignOut = useCallback(() => {
    if (!onSignOut) {
      return;
    }
    const result = onSignOut();
    if (result instanceof Promise) {
      result.catch(() => undefined);
    }
  }, [onSignOut]);

  const handleSwitchToCreator = useCallback(() => {
    router.push(ROUTES.quiz.list)
  }, [router])

  const handleSwitchToPlayer = useCallback(() => {
    router.push(ROUTES.dashboard.home)
  }, [router])

  const handleBecomeCreator = useCallback(() => {
    setIsBecomeCreatorModalOpen(true)
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="relative h-10 w-10 rounded-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-full"
            aria-label="User menu"
          >
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarFallback className="bg-primary text-primary-foreground font-heading uppercase text-sm rounded-full">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-60">
          <DropdownMenuItem asChild>
            <Link href={ROUTES.dashboard.profile}>
              <User />
              <span>Xem hồ sơ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.dashboard.settings}>
              <Settings />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.dashboard.support}>
              <HelpCircle />
              <span>Trợ giúp &amp; Hỗ trợ</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {isCreator && (
            <>
              {isOnHomePage && (
                <DropdownMenuItem onSelect={handleSwitchToCreator}>
                  <Sparkles />
                  <span>Chế độ người sáng tạo</span>
                </DropdownMenuItem>
              )}
              {isOnCreatorPage && (
                <DropdownMenuItem onSelect={handleSwitchToPlayer}>
                  <Home />
                  <span>Chế độ người chơi</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {!isCreator && (
            <DropdownMenuItem onSelect={handleBecomeCreator}>
              <Sparkles />
              <span>Trở thành Người sáng tạo</span>
            </DropdownMenuItem>
          )}

          {isCreator && <DropdownMenuSeparator />}

          <DropdownMenuItem onSelect={handleSignOut} variant="destructive">
            <LogOut />
            <span>Đăng xuất</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {!isCreator && (
        <BecomeCreatorModal
          open={isBecomeCreatorModalOpen}
          onOpenChange={setIsBecomeCreatorModalOpen}
        />
      )}
    </>
  );
}

