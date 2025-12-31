export type QuizSortBy = 'newest' | 'oldest' | 'title' | 'questions';
export type QuizFilterBy = 'all' | 'published' | 'draft';

export interface SortOption {
  value: QuizSortBy;
  label: string;
}

export interface FilterOption {
  value: QuizFilterBy;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'title', label: 'Tên A-Z' },
  { value: 'questions', label: 'Số câu hỏi' },
] as const;

export const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'draft', label: 'Nháp' },
] as const;

export const DEFAULT_PAGE_SIZE = 10;

