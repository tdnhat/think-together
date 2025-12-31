"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'
import { toastSuccess, toastError } from "@/lib/utils/toast";

import { useBecomeCreator } from "../hooks/use-become-creator";
import { BECOME_CREATOR_STEPS } from "../constants";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { ROUTES } from "@/config/routes";
import { ProgressIndicator } from "./progress-indicator";
import { IntroStep } from "./intro-step";
import { FeaturesStep } from "./features-step";
import { ConfirmStep } from "./confirm-step";

interface BecomeCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BecomeCreatorModal({
  open,
  onOpenChange,
  onSuccess,
}: Readonly<BecomeCreatorModalProps>) {
  const router = useRouter()
  const { currentStep, isActivating, error, nextStep, prevStep, becomeCreator, resetState } =
    useBecomeCreator()
  const { updateUser } = useAuthStore((state) => state.actions)

  const handleOpenChange = (newOpen: boolean) => {
    if (!isActivating) {
      if (!newOpen) {
        resetState()
      }
      onOpenChange(newOpen)
    }
  }

  const handleActivate = async () => {
    const success = await becomeCreator()

    if (success) {
      toastSuccess("Bạn đã trở thành Người sáng tạo!")

      updateUser({ role: 'Creator' })

      onSuccess?.()
      handleOpenChange(false)

      router.push(ROUTES.quiz.list)
    } else {
      toastError(error || "Đã xảy ra lỗi khi kích hoạt vai trò Người sáng tạo")
    }
  }

  const currentStepIndex = BECOME_CREATOR_STEPS.indexOf(currentStep);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trở thành Người sáng tạo</DialogTitle>
          <DialogDescription>
            Khám phá các tính năng mới và bắt đầu tạo nội dung của riêng bạn.
          </DialogDescription>
        </DialogHeader>
        <ProgressIndicator steps={[...BECOME_CREATOR_STEPS]} currentStepIndex={currentStepIndex} />

        {currentStep === "intro" && (
          <IntroStep onNext={nextStep} onClose={() => handleOpenChange(false)} />
        )}

        {currentStep === "features" && (
          <FeaturesStep onNext={nextStep} onBack={prevStep} />
        )}

        {currentStep === "confirm" && (
          <ConfirmStep isActivating={isActivating} onActivate={handleActivate} onBack={prevStep} />
        )}
      </DialogContent>
    </Dialog>
  )
}
