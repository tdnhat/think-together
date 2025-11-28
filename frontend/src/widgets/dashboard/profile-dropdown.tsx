"use client";

import Link from "next/link";
import { useCallback, type ButtonHTMLAttributes } from "react";

import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/shared";
import { cn } from "@/lib/utils";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { ROUTES } from "@/config/routes";

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
        "h-10 w-10 rounded-full border border-[var(--brand-primary-hover)] bg-[var(--brand-primary)] font-heading font-bold uppercase text-white transition-colors duration-200 shadow-brutal-primary-xs",
        "focus-visible:ring-[var(--brand-secondary)]",
        className,
      )}
      {...props}
    />
  );
}

export function ProfileDropdown({ initials = "ND", onSignOut }: Readonly<ProfileDropdownProps>) {
  const handleSignOut = useCallback(() => {
    if (!onSignOut) {
      return;
    }
    const result = onSignOut();
    if (result instanceof Promise) {
      result.catch(() => undefined);
    }
  }, [onSignOut]);

  return (
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
          <Link href={ROUTES.dashboard.profile} className="flex w-full items-center gap-3">
            <User className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>Xem hồ sơ</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.dashboard.settings} className="flex w-full items-center gap-3">
            <Settings className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.dashboard.support} className="flex w-full items-center gap-3">
            <HelpCircle className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>Trợ giúp &amp; Hỗ trợ</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

