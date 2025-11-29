"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { useAuthStore, selectUser, selectIsHydrated } from "@/features/auth/stores/auth.store";
import { BecomeCreatorModal } from "@/features/become-creator";
import { Button } from "@/shared/ui/button";
import { Sparkles } from "lucide-react";

interface CreatorRouteGuardProps {
  children: ReactNode;
}

export function CreatorRouteGuard({ children }: Readonly<CreatorRouteGuardProps>) {
  const router = useRouter();
  const user = useAuthStore(selectUser);
  const isHydrated = useAuthStore(selectIsHydrated);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isCreator = user?.role === 'Creator' || user?.role === 'Admin';

  if (!isHydrated) {
    return null;
  }

  if (!isCreator) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              Chế độ Người sáng tạo
            </h2>
            <p className="text-sm text-foreground/70 max-w-md">
              Bạn cần trở thành Người sáng tạo để truy cập trang này. Hãy kích hoạt để bắt đầu tạo các bộ câu hỏi của riêng bạn.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="default"
            size="lg"
            className="gap-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Trở thành Người sáng tạo</span>
          </Button>
        </div>
        <BecomeCreatorModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSuccess={() => {
            setIsModalOpen(false);
            router.refresh();
          }}
        />
      </>
    );
  }

  return <>{children}</>;
}

