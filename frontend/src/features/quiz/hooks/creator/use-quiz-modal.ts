import { useState, useCallback } from 'react';
import type { QuizSetDto } from '@/types/api';

export function useQuizModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuizSet, setEditingQuizSet] = useState<QuizSetDto | null>(null);

  const openModal = useCallback((quizSet?: QuizSetDto) => {
    setEditingQuizSet(quizSet || null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingQuizSet(null);
  }, []);

  return {
    modalOpen,
    editingQuizSet,
    openModal,
    closeModal,
  };
}

