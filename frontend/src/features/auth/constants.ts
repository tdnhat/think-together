import { BookOpen, GraduationCap, Palette, PenTool, Star } from "lucide-react";

export const AUTH_BRAND_NAME = "Think Together" as const;

export const AUTH_LEGAL_TEXT = "Bằng việc đăng nhập, bạn đã đồng ý với Điều khoản sử dụng và Quyền riêng tư." as const;

export const FLOATING_STATIONERY_ITEMS = [
  {
    id: 'pencil',
    icon: PenTool,
    className: 'top-[12%] left-[6%]',
    colors: 'bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400',
    size: 'h-16 w-16',
    float: { rotate: [-6, 8, -4] as number[], x: [0, 14, -10, 0] as number[], y: [0, -10, 8, 0] as number[] },
    delay: 0,
    duration: 14,
  },
  {
    id: 'notebook',
    icon: BookOpen,
    className: 'bottom-[18%] left-[12%]',
    colors: 'bg-primary/10 text-primary',
    size: 'h-20 w-20',
    float: { rotate: [4, -6, 6] as number[], x: [0, -16, 10, 0] as number[], y: [0, 12, -14, 0] as number[] },
    delay: 2,
    duration: 16,
  },
  {
    id: 'cap',
    icon: GraduationCap,
    className: 'top-[20%] right-[12%]',
    colors: 'bg-secondary/10 text-secondary',
    size: 'h-[4.75rem] w-[4.75rem]',
    float: { rotate: [-3, 7, -3] as number[], x: [0, -8, 6, 0] as number[], y: [0, 14, -10, 0] as number[] },
    delay: 1.5,
    duration: 18,
  },
  {
    id: 'palette',
    icon: Palette,
    className: 'bottom-[22%] right-[8%]',
    colors: 'bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
    size: 'h-16 w-16',
    float: { rotate: [2, -4, 4] as number[], x: [0, 12, -12, 0] as number[], y: [0, -8, 12, 0] as number[] },
    delay: 0.5,
    duration: 15,
  },
  {
    id: 'sparkles',
    icon: Star,
    className: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    colors: 'bg-background/70 text-primary backdrop-blur',
    size: 'h-14 w-14',
    float: { rotate: [-8, 8, -6] as number[], x: [0, 10, -10, 0] as number[], y: [0, -12, 12, 0] as number[] },
    delay: 3,
    duration: 20,
  },
] as const;

