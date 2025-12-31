'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Tags, Users, FileText, Settings, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/config/routes'

interface AdminMenuItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const menuItems: AdminMenuItem[] = [
  {
    label: 'Tổng quan',
    href: ROUTES.admin.dashboard,
    icon: LayoutDashboard,
    description: 'Xem thống kê chung',
  },
  {
    label: 'Danh mục',
    href: ROUTES.admin.categories,
    icon: Tags,
    description: 'Quản lý danh mục chủ đề',
  },
  {
    label: 'Quiz',
    href: ROUTES.admin.quizzes,
    icon: BookOpen,
    description: 'Quản lý tất cả quiz',
  },
  {
    label: 'Người dùng',
    href: ROUTES.admin.users,
    icon: Users,
    description: 'Quản lý tài khoản người dùng',
  },
  {
    label: 'Báo cáo',
    href: ROUTES.admin.reports,
    icon: FileText,
    description: 'Xem báo cáo hệ thống',
  },
  {
    label: 'Cài đặt',
    href: ROUTES.admin.settings,
    icon: Settings,
    description: 'Cấu hình hệ thống',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 space-y-2">
      <div className="mb-6">
        <h2 className="px-4 text-lg font-semibold text-foreground">
          Quản lý
        </h2>
        <p className="px-4 text-sm text-muted-foreground mt-1">
          Bảng điều khiển quản trị viên
        </p>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200',
                'text-sm font-medium group relative',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              title={item.description}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l opacity-80" />
              )}
            </Link>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Thống kê nhanh
        </div>
        <div className="space-y-2">
          <div className="px-4 py-2 bg-accent rounded-lg">
            <div className="text-xs text-muted-foreground">Danh mục</div>
            <div className="text-lg font-semibold text-foreground">-</div>
          </div>
          <div className="px-4 py-2 bg-accent rounded-lg">
            <div className="text-xs text-muted-foreground">Quiz</div>
            <div className="text-lg font-semibold text-foreground">-</div>
          </div>
          <div className="px-4 py-2 bg-accent rounded-lg">
            <div className="text-xs text-muted-foreground">Người dùng</div>
            <div className="text-lg font-semibold text-foreground">-</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
