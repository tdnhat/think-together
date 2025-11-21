/**
 * useDebounce Hook
 * 
 * Debounces a value, delaying updates until after a specified delay.
 * Useful for search inputs, API calls, etc.
 */

import { useEffect, useState } from 'react';
import { UI } from '@/config/constants';

/**
 * Debounce a value
 * 
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced value
 * 
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 500);
 *   
 *   useEffect(() => {
 *     if (debouncedSearch) {
 *       // Make API call with debounced value
 *       searchAPI(debouncedSearch);
 *     }
 *   }, [debouncedSearch]);
 *   
 *   return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
 * }
 * ```
 */
export function useDebounce<T>(value: T, delay: number = UI.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback function
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds (default: 300ms)
 * @returns Debounced callback
 * 
 * @example
 * ```tsx
 * function SearchInput() {
 *   const debouncedSearch = useDebouncedCallback((query: string) => {
 *     searchAPI(query);
 *   }, 500);
 *   
 *   return <input onChange={(e) => debouncedSearch(e.target.value)} />;
 * }
 * ```
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = UI.DEBOUNCE_DELAY
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);

    setTimeoutId(newTimeoutId);
  };
}

