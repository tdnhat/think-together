import { useMemo } from "react";
import { usePathname } from "next/navigation";

export interface BreadcrumbItem {
  href: string;
  title: string;
  isLast: boolean;
}

// Comprehensive Vietnamese route mapping
const PATH_TITLE_MAP: Record<string, string> = {
  // Main sections
  home: "Trang chủ",
  profile: "Hồ sơ",
  leaderboard: "Bảng xếp hạng",
  host: "Chủ trì",

  // Quiz related
  "my-quizzes": "Quiz của tôi",
  quiz: "Bộ câu hỏi",
  quizzes: "Bộ câu hỏi",
  questions: "Câu hỏi",

  // Class related
  classes: "Lớp học",
  students: "Học sinh",
  homeworks: "Bài tập",
  homework: "Bài tập",
  submission: "Bài nộp",
  statistics: "Thống kê",
  join: "Tham gia",

  // Admin
  admin: "Quản trị",
  users: "Người dùng",
  categories: "Danh mục",
  reports: "Báo cáo",
  settings: "Cài đặt",

  // Other
  creator: "Người sáng tạo",
  create: "Tạo mới",
  edit: "Chỉnh sửa",
} as const;

// Check if a path segment is likely a UUID or numeric ID
function isId(segment: string): boolean {
  // UUID pattern or numeric ID
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment) ||
    /^\d+$/.test(segment);
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);

    // Filter out IDs and limit to max 3 levels
    const filteredPaths = paths.filter(path => !isId(path));
    const maxLevels = 3;
    const limitedPaths = filteredPaths.slice(0, maxLevels);

    return limitedPaths.map((path, index) => {
      // Reconstruct href using original paths up to this point
      const originalIndex = paths.indexOf(path);
      const href = `/${paths.slice(0, originalIndex + 1).join("/")}`;
      const isLast = index === limitedPaths.length - 1;

      // Get Vietnamese title or capitalize first letter
      const title = PATH_TITLE_MAP[path] ||
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

      return { href, title, isLast };
    });
  }, [pathname]);
}
