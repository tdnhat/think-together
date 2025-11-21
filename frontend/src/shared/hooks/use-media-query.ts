/**
 * useMediaQuery Hook
 * 
 * Tracks whether a media query matches the current viewport.
 * Useful for responsive design and conditional rendering.
 */

import { useEffect, useState } from 'react';
import { UI } from '@/config/constants';

/**
 * Check if a media query matches
 * 
 * @param query - Media query string
 * @returns Boolean indicating if the query matches
 * 
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isDesktop = useMediaQuery('(min-width: 1024px)');
 *   
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isDesktop && <DesktopView />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // Legacy browsers
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false;
}

/**
 * Predefined breakpoint hooks
 */

export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${UI.BREAKPOINTS.MD - 1}px)`);
}

export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${UI.BREAKPOINTS.MD}px) and (max-width: ${UI.BREAKPOINTS.LG - 1}px)`
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${UI.BREAKPOINTS.LG}px)`);
}

export function useIsSmallScreen(): boolean {
  return useMediaQuery(`(max-width: ${UI.BREAKPOINTS.SM - 1}px)`);
}

export function useIsLargeScreen(): boolean {
  return useMediaQuery(`(min-width: ${UI.BREAKPOINTS.XL}px)`);
}

/**
 * Get current breakpoint
 * 
 * @returns Current breakpoint name
 * 
 * @example
 * ```tsx
 * function Component() {
 *   const breakpoint = useBreakpoint();
 *   
 *   return <div>Current breakpoint: {breakpoint}</div>;
 * }
 * ```
 */
export function useBreakpoint(): 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const isXl = useMediaQuery(`(min-width: ${UI.BREAKPOINTS['2XL']}px)`);
  const isLg = useMediaQuery(`(min-width: ${UI.BREAKPOINTS.XL}px)`);
  const isMd = useMediaQuery(`(min-width: ${UI.BREAKPOINTS.LG}px)`);
  const isSm = useMediaQuery(`(min-width: ${UI.BREAKPOINTS.MD}px)`);
  const isXs = useMediaQuery(`(min-width: ${UI.BREAKPOINTS.SM}px)`);

  if (isXl) return '2xl';
  if (isLg) return 'xl';
  if (isMd) return 'lg';
  if (isSm) return 'md';
  if (isXs) return 'sm';
  return 'sm';
}

/**
 * Check if device prefers dark mode
 */
export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Check if device prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

