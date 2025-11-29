"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useState, type ButtonHTMLAttributes } from "react";

import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/shared";
import { cn } from "@/lib/utils";
import { User, Settings, HelpCircle, LogOut, Sparkles, Home } from "lucide-react";
import { useAuthStore, selectUser } from "@/features/auth/stores/auth.store";
import { ROUTES } from "@/config/routes";
import { BecomeCreatorModal } from "@/features/become-creator";

interface ProfileDropdownProps {
  initials?: string;
  onSignOut?: () => Promise<void> | void;
}

function AvatarButton({ className, type = "button", ...props }: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <Button
      type={type}
      size="icon"
      variant="default"
      className={cn(
        "rounded-xl border border-[var(--brand-primary-hover)] bg-[var(--brand-primary)] font-heading uppercase text-white",
        "focus-visible:ring-[var(--brand-secondary)]",
        className,
      )}
      {...props}
    />
  );
}

export function ProfileDropdown({ initials = "ND", onSignOut }: Readonly<ProfileDropdownProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore(selectUser)
  const isCreator = user?.role === 'Creator' || user?.role === 'Admin'
  const [isBecomeCreatorModalOpen, setIsBecomeCreatorModalOpen] = useState(false)

  const isOnHomePage = pathname === ROUTES.dashboard.home
  const isOnCreatorPage = pathname === ROUTES.quiz.list || pathname.startsWith('/creator/')

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
          <AvatarButton>{initials}</AvatarButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={12}
          className="w-60"
        >
          <DropdownMenuItem asChild>
            <Link href={ROUTES.dashboard.profile}>
              <User className="text-[var(--brand-primary)]" />
              <span>Xem hồ sơ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.dashboard.settings}>
              <Settings className="text-[var(--brand-primary)]" />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={ROUTES.dashboard.support}>
              <HelpCircle className="text-[var(--brand-primary)]" />
              <span>Trợ giúp &amp; Hỗ trợ</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {isCreator && (
            <>
              {isOnHomePage && (
                <DropdownMenuItem onSelect={handleSwitchToCreator}>
                  <Sparkles className="text-[var(--brand-primary)]" />
                  <span>Chế độ người sáng tạo</span>
                </DropdownMenuItem>
              )}
              {isOnCreatorPage && (
                <DropdownMenuItem onSelect={handleSwitchToPlayer}>
                  <Home className="text-[var(--brand-primary)]" />
                  <span>Chế độ người chơi</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {!isCreator && (
            <DropdownMenuItem onSelect={handleBecomeCreator}>
              <Sparkles className="text-[var(--brand-primary)]" />
              <span>Trở thành Người sáng tạo</span>
            </DropdownMenuItem>
          )}

          {isCreator && <DropdownMenuSeparator />}

          <DropdownMenuItem onSelect={handleSignOut}>
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

