import { Sidebar, SidebarFooter, SidebarRail } from "@/shared/ui/sidebar"
import {
  SidebarBrand,
  SidebarNavigation,
} from "@/widgets/dashboard/components"
import { ROUTES } from "@/config/routes"
import { LayoutDashboard, Tags, Users, FileText, Settings, BookOpen } from 'lucide-react'
import { NavigationGroup } from "@/widgets/dashboard/constants"

const adminMenuGroups: NavigationGroup[] = [
  {
    title: "Quản lý",
    items: [
      {
        title: 'Tổng quan',
        url: ROUTES.admin.dashboard,
        icon: LayoutDashboard,
      },
      {
        title: 'Danh mục',
        url: ROUTES.admin.categories,
        icon: Tags,
      },
      {
        title: 'Quiz',
        url: ROUTES.admin.quizzes,
        icon: BookOpen,
      },
      {
        title: 'Người dùng',
        url: ROUTES.admin.users,
        icon: Users,
      },
      {
        title: 'Báo cáo',
        url: ROUTES.admin.reports,
        icon: FileText,
      },
      {
        title: 'Cài đặt',
        url: ROUTES.admin.settings,
        icon: Settings,
      },
    ]
  }
]

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarBrand />
      <SidebarNavigation groups={adminMenuGroups} />
      <SidebarFooter>
        {/* Add admin specific footer content or stats if needed later */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
