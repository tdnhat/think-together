/**
 * useSessionStorage Hook
 * 
 * Manages state synchronized with sessionStorage.
 * Similar to useState but persists across page reloads (within the same session).
 */

import { useCallback, useEffect, useState } from 'react';

type SetValue<T> = T | ((val: T) => T);

/**
 * Use session storage with type safety
 * 
 * @param key - Storage key
 * @param initialValue - Initial value
 * @returns Tuple of [value, setValue, removeValue]
 * 
 * @example
 * ```tsx
 * function GameLobby() {
 *   const [playerName, setPlayerName, removePlayerName] = useSessionStorage<string>(
 *     'player_name',
 *     ''
 *   );
 *   
 *   return (
 *     <div>
 *       <input
 *         value={playerName}
 *         onChange={(e) => setPlayerName(e.target.value)}
 *       />
 *       <button onClick={removePlayerName}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // Get from session storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      // Prevent build error "window is undefined" but keep working
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting sessionStorage key "${key}" even though environment is not a client`
        );
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Save to session storage
        window.sessionStorage.setItem(key, JSON.stringify(newValue));

        // Save state
        setStoredValue(newValue);

        // Dispatch custom event so every useSessionStorage hook is notified
        window.dispatchEvent(new Event('session-storage'));
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from session storage
  const removeValue = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event('session-storage'));
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key in other tabs/windows
  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Listen for custom storage event
    window.addEventListener('session-storage', handleStorageChange);

    return () => {
      window.removeEventListener('session-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue, removeValue];
}

