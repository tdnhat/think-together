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
        variant="default"
        size="lg"
        className={cn("group gap-2 w-full justify-center h-auto py-3 whitespace-normal text-center", className)}
      >
        <Sparkles className="h-5 w-5 shrink-0 transition-transform group-hover:rotate-12" strokeWidth={2.5} />
        <span className="font-bold text-sm">Trở thành<br /> Người sáng tạo</span>
      </Button>

      <BecomeCreatorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={onSuccess}
      />
    </>
  );
}

