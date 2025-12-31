"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import { useAuthStore, selectUser, selectIsHydrated } from "@/features/auth/stores/auth.store";
import { BecomeCreatorButton } from "@/features/become-creator";
import { BecomeCreatorModal } from "@/features/become-creator/components/modal";

export function SidebarFooterContent() {
  const { state } = useSidebar();
  const isHydrated = useAuthStore(selectIsHydrated);
  const user = useAuthStore(selectUser);
  const isCollapsed = state === "collapsed";
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showBecomeCreator = isHydrated && user?.role !== "Creator";

  if (!showBecomeCreator) return null;

  return (
    <>
      <SidebarFooter>
        {isCollapsed ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsModalOpen(true)}
                tooltip="Trở thành Người sáng tạo"
              >
                <Sparkles className="h-4 w-4 transition-all duration-200" />
                <span className="group-data-[state=collapsed]:hidden">
                  Trở thành Người sáng tạo
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <BecomeCreatorButton className="w-full justify-start text-left" />
        )}
      </SidebarFooter>

      <BecomeCreatorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}

