"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/shared";
import { cn } from "@/lib/utils";
import { BecomeCreatorModal } from "./modal";

interface BecomeCreatorButtonProps {
  className?: string;
  onSuccess?: () => void;
}

export function BecomeCreatorButton({ className, onSuccess }: Readonly<BecomeCreatorButtonProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsModalOpen(true)}
        variant="primary"
        size="lg"
        className={cn(
          "group relative gap-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--accent-purple)]",
          className
        )}
      >
        <Sparkles className="h-5 w-5 transition-transform group-hover:rotate-12" strokeWidth={3} />
        <span>Trở thành Người sáng tạo</span>
      </Button>

      <BecomeCreatorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}

