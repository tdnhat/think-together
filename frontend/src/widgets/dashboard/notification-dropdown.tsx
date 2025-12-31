"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { NavbarIconButton } from "./components";

interface NotificationItem {
  title: string;
  description: string;
}

const notifications: NotificationItem[] = [
  {
    title: "Bài tập mới",
    description: "Giáo viên đã giao bài tập mới cho lớp 10A1",
  },
  {
    title: "Nhắc nhở",
    description: "Còn 1 giờ nữa là đến hạn nộp bài",
  },
  {
    title: "Hệ thống",
    description: "Bảo trì hệ thống vào 00:00 ngày mai",
  },
];

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NavbarIconButton variant="outline" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <Badge
            variant="default"
            className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center p-0 text-xs font-bold"
          >
            3
          </Badge>
        </NavbarIconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1 p-2">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.title} className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {notification.description}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-center text-primary cursor-pointer">
          Xem tất cả
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
