/**
 * useAsync Hook
 * 
 * Manages async operations with loading, error, and data states.
 * Handles cleanup and prevents state updates on unmounted components.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { handleError } from '@/lib/errors/error-handler';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export interface AsyncActions<T> {
  execute: (...args: unknown[]) => Promise<T | undefined>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: Error | null) => void;
}

export type UseAsyncReturn<T> = AsyncState<T> & AsyncActions<T>;

/**
 * Manage async operations
 * 
 * @param asyncFunction - Async function to execute
 * @param immediate - Execute immediately on mount (default: false)
 * @returns Async state and actions
 * 
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data: user, isLoading, error, execute } = useAsync(
 *     () => services.user.getUser(userId),
 *     true // Execute immediately
 *   );
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!user) return null;
 *   
 *   return <div>{user.name}</div>;
 * }
 * ```
 */
export function useAsync<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  immediate: boolean = false
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const isMountedRef = useRef<boolean>(true);
  const pendingPromiseRef = useRef<Promise<T> | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | undefined> => {
      if (!isMountedRef.current) return;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        isError: false,
        error: null,
      }));

      try {
        const promise = asyncFunction(...args);
        pendingPromiseRef.current = promise;

        const data = await promise;

        if (isMountedRef.current && pendingPromiseRef.current === promise) {
          setState({
            data,
            error: null,
            isLoading: false,
            isError: false,
            isSuccess: true,
          });
          return data;
        }
      } catch (error) {
        if (isMountedRef.current) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          setState({
            data: null,
            error: errorObj,
            isLoading: false,
            isError: true,
            isSuccess: false,
          });
          handleError(errorObj, { showToast: false });
        }
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    if (isMountedRef.current) {
      setState({
        data: null,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
    }
  }, []);

  const setData = useCallback((data: T | null) => {
    if (isMountedRef.current) {
      setState((prev) => ({
        ...prev,
        data,
        isSuccess: data !== null,
      }));
    }
  }, []);

  const setError = useCallback((error: Error | null) => {
    if (isMountedRef.current) {
      setState((prev) => ({
        ...prev,
        error,
        isError: error !== null,
      }));
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    execute,
    reset,
    setData,
    setError,
  };
}

/**
 * useAsyncCallback - Execute async function on demand
 * 
 * @example
 * ```tsx
 * function DeleteButton({ quizId }: { quizId: string }) {
 *   const { execute: deleteQuiz, isLoading } = useAsyncCallback(
 *     () => services.quiz.deleteQuiz(quizId)
 *   );
 *   
 *   return (
 *     <button onClick={deleteQuiz} disabled={isLoading}>
 *       {isLoading ? 'Deleting...' : 'Delete'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useAsyncCallback<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>
): UseAsyncReturn<T> {
  return useAsync(asyncFunction, false);
}

/**
 * useAsyncEffect - Execute async function on mount
 * 
 * @example
 * ```tsx
 * function QuizList() {
 *   const { data: quizzes, isLoading } = useAsyncEffect(
 *     () => services.quiz.listQuizzes()
 *   );
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   return <div>{quizzes?.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}</div>;
 * }
 * ```
 */
export function useAsyncEffect<T>(
  asyncFunction: (...args: unknown[]) => Promise<T>
): UseAsyncReturn<T> {
  return useAsync(asyncFunction, true);
}

