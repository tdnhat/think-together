/**
 * API Module
 * 
 * Central export point for all API-related modules.
 * Import API functionality from here instead of individual files.
 */

// ============================================================================
// CLIENT
// ============================================================================

export { apiClient, api } from './client';

// ============================================================================
// ENDPOINTS
// ============================================================================

export * from './endpoints';

// ============================================================================
// TYPES
// ============================================================================

export * from './types';

// ============================================================================
// SERVICES
// ============================================================================

export { authService } from './services/auth.service';
export { quizService } from './services/quiz.service';

// ============================================================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================================================

import { authService } from './services/auth.service';
import { quizService } from './services/quiz.service';

/**
 * Centralized API services object
 * 
 * Usage:
 * ```typescript
 * import { services } from '@/lib/api';
 * 
 * const user = await services.auth.login({ email, password });
 * const quizzes = await services.quiz.listQuizzes();
 * ```
 */
export const services = {
  auth: authService,
  quiz: quizService,
} as const;

export default services;

