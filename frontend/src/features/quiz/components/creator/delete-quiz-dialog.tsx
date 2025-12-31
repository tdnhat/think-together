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

interface DeleteQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizSet: QuizSetDto | null;
  onConfirm: () => void;
}

export function DeleteQuizDialog({
  open,
  onOpenChange,
  quizSet,
  onConfirm,
}: DeleteQuizDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bộ trắc nghiệm?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bộ trắc nghiệm &quot;{quizSet?.title}&quot;
            không? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Hủy</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="default" onClick={onConfirm}>
              Xóa
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

