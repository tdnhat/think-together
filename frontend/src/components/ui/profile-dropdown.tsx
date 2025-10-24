"use client";

import Link from "next/link";
import { useCallback, type ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
        "h-10 w-10 rounded-full border-2 border-[var(--color-border-main)] bg-[var(--brand-primary)] font-heading font-bold uppercase text-white shadow-brutal-sm transition-all duration-150",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--color-border-main)]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
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

  const baseItemClass =
    "group flex w-full cursor-pointer select-none items-center gap-3 rounded-lg border-2 border-black px-4 py-2 text-sm font-semibold text-[#003459] shadow-[4px_4px_0_#000] transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none focus-visible:outline-none";
  const neutralItemState = "bg-[#F8FAFC] transition-colors duration-150 hover:bg-[#FFE066]/70 focus:bg-[#FFE066]/80";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AvatarButton>{initials}</AvatarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="mt-2 w-60 rounded-xl border-2 border-black bg-white p-3 shadow-[6px_6px_0_#000] transition-transform duration-150 data-[state=closed]:translate-y-1 data-[state=open]:translate-y-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      >
        <DropdownMenuItem asChild className={cn(baseItemClass, neutralItemState)}>
          <Link href="/profile" className="flex w-full items-center gap-3">
            <User className="h-5 w-5 text-[#00A8E8]" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={cn("mt-2", baseItemClass, neutralItemState)}>
          <Link href="/settings" className="flex w-full items-center gap-3">
            <Settings className="h-5 w-5 text-[#00A8E8]" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={cn("mt-2", baseItemClass, neutralItemState)}>
          <Link href="/support" className="flex w-full items-center gap-3">
            <HelpCircle className="h-5 w-5 text-[#00A8E8]" />
            <span>Help &amp; Support</span>
          </Link>
        </DropdownMenuItem>

  <DropdownMenuSeparator className="my-3 mx-0 h-px bg-black" />

        <DropdownMenuItem
          onSelect={handleSignOut}
          className={cn(
            baseItemClass,
            "bg-[#FFF1F0] text-[#EF4444] transition-colors duration-150 hover:bg-[#FECACA] focus:bg-[#FECACA]",
          )}
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
