import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import type { QuizSetQueryParams } from '@/types/api';
import type { QuizSortBy, QuizFilterBy } from '../../constants/creator';
import { DEFAULT_PAGE_SIZE } from '../../constants/creator';

export function useQuizUrlParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const searchQuery = searchParams.get('search') || '';
    const sortBy = (searchParams.get('sortBy') as QuizSortBy) || 'newest';
    const filterBy = (searchParams.get('filterBy') as QuizFilterBy) || 'all';
    const page = Number.parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Number.parseInt(
      searchParams.get('pageSize') || DEFAULT_PAGE_SIZE.toString(),
      10
    );

    return {
      searchQuery,
      sortBy,
      filterBy,
      page,
      pageSize,
    };
  }, [searchParams]);

  const queryParams: QuizSetQueryParams = useMemo(
    () => ({
      search: params.searchQuery || undefined,
      sortBy: params.sortBy,
      filterBy: params.filterBy,
      page: params.page,
      pageSize: params.pageSize,
    }),
    [params]
  );

  const updateUrlParams = (updates: Partial<QuizSetQueryParams>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (updates.search !== undefined) {
      if (updates.search) {
        newParams.set('search', updates.search);
      } else {
        newParams.delete('search');
      }
    }

    if (updates.sortBy) newParams.set('sortBy', updates.sortBy);
    if (updates.filterBy && updates.filterBy !== 'all') {
      newParams.set('filterBy', updates.filterBy);
    } else {
      newParams.delete('filterBy');
    }

    if (updates.page && updates.page > 1) {
      newParams.set('page', updates.page.toString());
    } else {
      newParams.delete('page');
    }

    if (updates.pageSize && updates.pageSize !== DEFAULT_PAGE_SIZE) {
      newParams.set('pageSize', updates.pageSize.toString());
    } else {
      newParams.delete('pageSize');
    }

    router.push(`?${newParams.toString()}`);
  };

  return {
    params,
    queryParams,
    updateUrlParams,
  };
}

