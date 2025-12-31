export type QuizFilter = 'all' | 'popular' | 'newest';

export interface FilterTab {
  id: QuizFilter;
  label: string;
}

export const FILTER_TABS: FilterTab[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'popular', label: 'Phổ biến' },
  { id: 'newest', label: 'Mới nhất' },
] as const;

export const DEFAULT_QUERY_PARAMS = {
  sortBy: 'newest' as const,
  page: 1,
  pageSize: 12,
} as const;

