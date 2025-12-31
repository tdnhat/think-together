import { useState, useCallback } from 'react';

export function useChallengePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return {
    page,
    handlePageChange,
  };
}

