"use client";

import { SearchInput } from "@/shared/components";

export function NavbarSearch() {
  return (
    <SearchInput
      className="w-full"
      placeholder="Tìm kiếm bộ câu hỏi..."
      value=""
      onChange={() => {}}
      iconColor="text-muted-foreground/40"
    />
  );
}

