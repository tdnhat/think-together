"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

import { useBecomeCreator } from "../hooks/use-become-creator";
import { BECOME_CREATOR_STEPS } from "../constants";
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
  const [mounted, setMounted] = useState(false)
  const { currentStep, isActivating, error, nextStep, prevStep, activateTeacher, resetState } =
    useBecomeCreator()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => {
    if (!isActivating) {
      resetState()
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isActivating) {
      handleClose()
    }
  }

  const handleActivate = async () => {
    const success = await activateTeacher()

    if (success) {
      toast.success("Bạn đã trở thành Người sáng tạo!")

      setTimeout(() => {
        globalThis.location.reload()
      }, 1000)

      onSuccess?.()
      handleClose()
    } else {
      toast.error(error || "Đã xảy ra lỗi khi kích hoạt vai trò Người sáng tạo")
    }
  }

  const currentStepIndex = BECOME_CREATOR_STEPS.indexOf(currentStep as typeof BECOME_CREATOR_STEPS[number]);

  if (!open || !mounted) return null
  if (!document.body) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden={!open}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
      >
        <button
          className="pointer-events-auto absolute inset-0"
          onClick={handleClose}
          type="button"
          aria-label="Close modal"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        />
        <div
          className="pointer-events-auto relative w-full max-w-2xl rounded-2xl border-4 border-[var(--color-border-main)] bg-[var(--bg-surface)] p-6 shadow-brutal-lg mx-4 my-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <ProgressIndicator steps={[...BECOME_CREATOR_STEPS]} currentStepIndex={currentStepIndex} />

          {currentStep === "intro" && (
            <IntroStep onNext={nextStep} onClose={handleClose} />
          )}

          {currentStep === "features" && (
            <FeaturesStep onNext={nextStep} onBack={prevStep} />
          )}

          {currentStep === "confirm" && (
            <ConfirmStep isActivating={isActivating} onActivate={handleActivate} onBack={prevStep} />
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
