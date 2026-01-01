/**
 * Platform API Service
 * 
 * Handles platform-wide statistics and information API calls.
 */

import { api } from '../client';
import { PLATFORM_ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';

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
    const response = await api.get<ApiResponse<PlatformStatsDto>>(
      PLATFORM_ENDPOINTS.GET_STATS
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Không thể tải thống kê nền tảng');
  }
}

export const platformService = new PlatformService();

