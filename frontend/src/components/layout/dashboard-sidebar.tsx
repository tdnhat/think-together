'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Star,
  Clock,
  Users,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const mainMenuItems: SidebarItem[] = [
  { icon: Home, label: 'Trang chủ', href: '/home' },
  { icon: BookOpen, label: 'Bộ câu hỏi', href: '/quiz' },
  { icon: TrendingUp, label: 'Bảng xếp hạng', href: '/leaderboard' },
  { icon: Activity, label: 'Tiến trình', href: '/progress' },
];

const otherMenuItems: SidebarItem[] = [
  { icon: Star, label: 'Bài đã lưu', href: '/saved' },
  { icon: Clock, label: 'Lịch sử', href: '/history' },
  { icon: Users, label: 'Cộng đồng', href: '/community' },
  { icon: Settings, label: 'Cài đặt', href: '/settings' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-black bg-[#F8FAFC]">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <nav className="space-y-6">
            <section>
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Menu chính
              </h2>
              <div className="space-y-2">
                {mainMenuItems.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    variant="main"
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Khác
              </h2>
              <div className="space-y-2">
                {otherMenuItems.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    variant="other"
                  />
                ))}
              </div>
            </section>
          </nav>
        </div>
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  item: SidebarItem;
  isActive: boolean;
  variant: 'main' | 'other';
}

function SidebarLink({ item, isActive, variant }: Readonly<SidebarLinkProps>) {
  const Icon = item.icon;
  let iconBaseClass = 'text-white';
  let iconHoverClass = 'text-white';

  if (!isActive) {
    if (variant === 'main') {
      iconBaseClass = 'text-[#00A8E8]';
      iconHoverClass = 'group-hover:text-[#00A8E8]';
    } else {
      iconBaseClass = 'text-[#FFE066]';
      iconHoverClass = 'group-hover:text-[#FFE066]';
    }
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-transform duration-150',
        isActive
          ? 'bg-[#00A8E8] text-white shadow-[3px_3px_0_#000]'
          : 'text-[#003459]',
        !isActive && variant === 'main' && 'hover:text-[#00A8E8] hover:bg-[#00a6e820]',
        !isActive && variant === 'other' && 'hover:bg-[#ffe06629]'
      )}
    >
      <Icon className={cn('h-5 w-5 transition-colors', iconBaseClass, iconHoverClass)} />
      <span>{item.label}</span>
      {item.badge && (
        <span className="ml-auto rounded-full bg-[#FFE066] px-2 py-0.5 text-xs font-semibold text-black">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
