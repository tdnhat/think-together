/**
 * Store Hydration Hook
 * 
 * Ensures stores are hydrated before rendering (prevents hydration mismatches)
 */

import { useEffect, useState } from 'react';

export function useStoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for stores to hydrate from localStorage
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * HOC to wrap components that need hydrated stores
 */
export function withStoreHydration<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  const HydratedComponent = (props: P) => {
    const isHydrated = useStoreHydration();

    if (!isHydrated) {
      return null; // or loading spinner
    }

    return <Component {...props} />;
  };
  
  HydratedComponent.displayName = `withStoreHydration(${Component.displayName || Component.name || 'Component'})`;
  
  return HydratedComponent;
}

