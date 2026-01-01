import { useQuery } from '@tanstack/react-query';
import { platformService } from '@/lib/api/services/platform.service';

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => platformService.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

