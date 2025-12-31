import { useMemo } from "react";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  href: string;
  title: string;
  isLast: boolean;
}

const PATH_TITLE_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  home: "Trang chủ",
  quiz: "Bộ câu hỏi",
  classes: "Lớp học",
  settings: "Cài đặt",
  profile: "Hồ sơ",
} as const;

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = `/${paths.slice(0, index + 1).join("/")}`;
      const isLast = index === paths.length - 1;
      const title =
        PATH_TITLE_MAP[path] || path.charAt(0).toUpperCase() + path.slice(1);

      return { href, title, isLast };
    });
  }, [pathname]);
}

