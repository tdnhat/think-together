import { useState, useCallback } from 'react';
import type { QuizSetDto } from '@/types/api';

export function useQuizDialogs() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedQuizSet, setSelectedQuizSet] = useState<QuizSetDto | null>(null);

  const openDeleteDialog = useCallback((quizSet: QuizSetDto) => {
    setSelectedQuizSet(quizSet);
    setDeleteDialogOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedQuizSet(null);
  }, []);

  const openPublishDialog = useCallback((quizSet: QuizSetDto) => {
    setSelectedQuizSet(quizSet);
    setPublishDialogOpen(true);
  }, []);

  const closePublishDialog = useCallback(() => {
    setPublishDialogOpen(false);
    setSelectedQuizSet(null);
  }, []);

  return {
    deleteDialogOpen,
    publishDialogOpen,
    selectedQuizSet,
    openDeleteDialog,
    closeDeleteDialog,
    openPublishDialog,
    closePublishDialog,
  };
}

