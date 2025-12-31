import { useState } from 'react';
import type { QuizFilter } from '../../constants/home';

export function useQuizFilters() {
  const [filterBy, setFilterBy] = useState<QuizFilter>('all');

  return {
    filterBy,
    setFilterBy,
  };
}

