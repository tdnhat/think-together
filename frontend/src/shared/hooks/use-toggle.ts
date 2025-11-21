/**
 * useToggle Hook
 * 
 * Manages boolean state with toggle, set, and reset functions.
 * Cleaner API than useState for boolean values.
 */

import { useCallback, useState } from 'react';

export interface UseToggleReturn {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
  setValue: (value: boolean) => void;
}

/**
 * Toggle boolean state
 * 
 * @param initialValue - Initial boolean value (default: false)
 * @returns Toggle state and actions
 * 
 * @example
 * ```tsx
 * function Modal() {
 *   const { value: isOpen, toggle, setTrue: open, setFalse: close } = useToggle();
 *   
 *   return (
 *     <>
 *       <button onClick={open}>Open Modal</button>
 *       {isOpen && (
 *         <div>
 *           <h2>Modal Content</h2>
 *           <button onClick={close}>Close</button>
 *         </div>
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const setValueCallback = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue: setValueCallback,
  };
}

/**
 * useBoolean - Alias for useToggle with more semantic naming
 */
export const useBoolean = useToggle;

