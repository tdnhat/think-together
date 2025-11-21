"use client";

import Link from "next/link";
import { useCallback, type ButtonHTMLAttributes } from "react";

import { Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/shared";
import { cn } from "@/lib/utils";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";

interface ProfileDropdownProps {
  initials?: string;
  onSignOut?: () => Promise<void> | void;
}

function AvatarButton({ className, type = "button", ...props }: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <Button
      type={type}
      size="icon"
      variant="secondary"
      className={cn(
        "h-10 w-10 rounded-full border-2 border-[var(--color-border-main)] bg-[var(--brand-primary)] font-heading font-bold uppercase text-white transition-colors duration-200",
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
          <Link href="/profile" className="flex w-full items-center gap-3">
            <User className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>Xem hồ sơ</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex w-full items-center gap-3">
            <Settings className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support" className="flex w-full items-center gap-3">
            <HelpCircle className="h-5 w-5 text-[var(--brand-primary)]" />
            <span>Trợ giúp &amp; Hỗ trợ</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleSignOut}
          variant="destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

