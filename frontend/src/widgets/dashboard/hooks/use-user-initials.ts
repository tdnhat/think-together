import { useMemo } from "react";
import { useAuthStore, selectUser } from "@/features/auth/stores/auth.store";

export function useUserInitials(): string {
  const user = useAuthStore(selectUser);

  return useMemo(() => {
    if (!user) {
      return "ND";
    }

    const fromName = user.name
      ?.trim()
      .split(" ")
      .filter((segment) => segment.length > 0)
      .map((segment) => segment[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();

    if (fromName && fromName.length > 0) {
      return fromName;
    }

    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }

    return "TT";
  }, [user]);
}

