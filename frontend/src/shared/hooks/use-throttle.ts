/**
 * useThrottle Hook
 * 
 * Throttles a value or callback, limiting updates to once per specified interval.
 * Useful for scroll handlers, resize handlers, etc.
 */

import { useEffect, useRef, useState } from 'react';
import { UI } from '@/config/constants';

/**
 * Throttle a value
 * 
 * @param value - The value to throttle
 * @param interval - Interval in milliseconds (default: 1000ms)
 * @returns Throttled value
 * 
 * @example
 * ```tsx
 * function ScrollComponent() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, 100);
 *   
 *   useEffect(() => {
 *     const handleScroll = () => setScrollY(window.scrollY);
 *     window.addEventListener('scroll', handleScroll);
 *     return () => window.removeEventListener('scroll', handleScroll);
 *   }, []);
 *   
 *   return <div>Scroll position: {throttledScrollY}</div>;
 * }
 * ```
 */
export function useThrottle<T>(value: T, interval: number = UI.THROTTLE_DELAY): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timeoutId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastExecution);

      return () => clearTimeout(timeoutId);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Throttle a callback function
 * 
 * @param callback - Function to throttle
 * @param interval - Interval in milliseconds (default: 1000ms)
 * @returns Throttled callback
 * 
 * @example
 * ```tsx
 * function ScrollComponent() {
 *   const handleScroll = useThrottledCallback(() => {
 *     console.log('Scrolled!');
 *   }, 100);
 *   
 *   useEffect(() => {
 *     window.addEventListener('scroll', handleScroll);
 *     return () => window.removeEventListener('scroll', handleScroll);
 *   }, [handleScroll]);
 *   
 *   return <div>Scroll me!</div>;
 * }
 * ```
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  interval: number = UI.THROTTLE_DELAY
): (...args: Parameters<T>) => void {
  const lastExecuted = useRef<number>(0);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now;
      callback(...args);
    } else if (!timeoutId.current) {
      timeoutId.current = setTimeout(() => {
        lastExecuted.current = Date.now();
        callback(...args);
        timeoutId.current = null;
      }, interval - timeSinceLastExecution);
    }
  };
}

