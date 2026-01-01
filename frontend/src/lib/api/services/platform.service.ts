/**
 * Platform API Service
 * 
 * Handles platform-wide statistics and information API calls.
 */

import { api } from '../client';
import { PLATFORM_ENDPOINTS } from '../endpoints';

// ============================================================================
// PLATFORM STATS TYPES
// ============================================================================

export interface PlatformStatsDto {
  totalUsers: number;
  totalQuestions: number;
  totalQuizSets: number;
  totalPublishedQuizSets: number;
  totalChallengeAttempts: number;
  totalGameSessions: number;
  totalCategories: number;
}

// ============================================================================
// PLATFORM SERVICE
// ============================================================================

export class PlatformService {
  /**
   * Get platform statistics
   */
  async getStats(): Promise<PlatformStatsDto> {
    const response = await api.get<PlatformStatsDto>(
      PLATFORM_ENDPOINTS.GET_STATS
    );
    
    return response;
    
    // Response handled by error interceptor
  }
}

export const platformService = new PlatformService();

