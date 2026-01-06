"use client";

import { ExpandableSearch } from "./expandable-search";
import { NotificationDropdown } from "../notification-dropdown";
import { ProfileDropdown } from "../profile-dropdown";
import { useUserInitials } from "../hooks";
import { useAuth } from "@/features/auth";

export function NavbarActions() {
  const { logout } = useAuth();
  const initials = useUserInitials();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <ExpandableSearch placeholder="Tìm kiếm bộ câu hỏi..." />
      <NotificationDropdown />
      <ProfileDropdown initials={initials} onSignOut={logout} />
    </div>
  );
}
