/**
 * usePrevious Hook
 * 
 * Keeps track of the previous value of a state or prop.
 * Useful for comparing current and previous values.
 */

import { useEffect, useRef } from 'react';

/**
 * Get the previous value
 * 
 * @param value - Current value
 * @returns Previous value
 * 
 * @example
 * ```tsx
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const prevCount = usePrevious(count);
 *   
 *   return (
 *     <div>
 *       <p>Current: {count}</p>
 *       <p>Previous: {prevCount}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Compare current and previous values
 * 
 * @param value - Current value
 * @returns Object with current, previous, and hasChanged
 * 
 * @example
 * ```tsx
 * function UserStatus({ userId }: { userId: string }) {
 *   const { current, previous, hasChanged } = useCompare(userId);
 *   
 *   useEffect(() => {
 *     if (hasChanged) {
 *       console.log(`User changed from ${previous} to ${current}`);
 *     }
 *   }, [hasChanged, current, previous]);
 *   
 *   return <div>User ID: {userId}</div>;
 * }
 * ```
 */
export function useCompare<T>(value: T) {
  const previous = usePrevious(value);
  const hasChanged = previous !== value;

  return {
    current: value,
    previous,
    hasChanged,
  };
}

