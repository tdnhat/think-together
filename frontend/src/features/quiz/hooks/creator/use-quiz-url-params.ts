import { useMemo } from 'react';
import type { QuizSetQueryParams } from '@/types/api';
import type { QuizSortBy, QuizFilterBy } from '../../constants/creator';
import { DEFAULT_PAGE_SIZE } from '../../constants/creator';
import { useUrlParams } from '@/hooks/use-url-params';

export function useQuizUrlParams() {
  const { params, updateParams } = useUrlParams<QuizSortBy>({
    defaultPageSize: DEFAULT_PAGE_SIZE,
    defaultSortBy: 'newest',
    defaultFilterBy: 'all'
  });

  const queryParams: QuizSetQueryParams = useMemo(
    () => ({
      search: params.search || undefined,
      sortBy: params.sortBy,
      filterBy: params.filterBy as QuizFilterBy,
      page: params.page,
      pageSize: params.pageSize,
    }),
    [params]
  );

  return {
    params: {
      searchQuery: params.search,
      sortBy: params.sortBy,
      filterBy: params.filterBy as QuizFilterBy,
      page: params.page,
      pageSize: params.pageSize
    },
    queryParams,
    updateUrlParams: updateParams,
  };
}

