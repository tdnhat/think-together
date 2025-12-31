"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import type { QuizSetDto } from "@/types/api";

interface PublishQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizSet: QuizSetDto | null;
  onConfirm: () => void;
}

export function PublishQuizDialog({
  open,
  onOpenChange,
  quizSet,
  onConfirm,
}: PublishQuizDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xuất bản bộ trắc nghiệm?</AlertDialogTitle>
          <AlertDialogDescription>
            Xuất bản bộ trắc nghiệm &quot;{quizSet?.title}&quot; sẽ cho phép người
            khác sử dụng. Bạn có muốn tiếp tục?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Hủy</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="default" onClick={onConfirm}>
              Xuất bản
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

