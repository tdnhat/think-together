/**
 * API Endpoints
 * 
 * Centralized API endpoint definitions.
 * Type-safe endpoint builders to avoid hardcoded URLs.
 */

import { AUTH } from '@/config/constants';

// ============================================================================
// BASE ENDPOINTS
// ============================================================================

const BASE = '/api';

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export const AUTH_ENDPOINTS = {
  ...AUTH.ENDPOINTS,
  // Additional auth endpoints not in constants
  CHANGE_PASSWORD: `${BASE}/auth/change-password`,
  GET_PROFILE: `${BASE}/auth/profile`,
  UPDATE_PROFILE: `${BASE}/auth/profile`,
  GOOGLE_LOGIN: `${BASE}/auth/google`,
  FACEBOOK_LOGIN: `${BASE}/auth/facebook`,
} as const;

// ============================================================================
// USER ENDPOINTS
// ============================================================================

export const USER_ENDPOINTS = {
  // User management
  GET_USER: (id: string) => `${BASE}/users/${id}`,
  UPDATE_USER: (id: string) => `${BASE}/users/${id}`,
  DELETE_USER: (id: string) => `${BASE}/users/${id}`,
  
  // User list
  LIST_USERS: `${BASE}/users`,
  SEARCH_USERS: `${BASE}/users/search`,
  
  // User stats
  GET_USER_STATS: (id: string) => `${BASE}/users/${id}/stats`,
  GET_USER_ACTIVITY: (id: string) => `${BASE}/users/${id}/activity`,
  
  // Creator
  BECOME_CREATOR: `${BASE}/users/become-creator`,
  GET_CREATOR_STATUS: `${BASE}/users/creator-status`,
} as const;

// ============================================================================
// QUIZ ENDPOINTS
// ============================================================================

export const QUIZ_ENDPOINTS = {
  // Quiz CRUD
  LIST_QUIZZES: `${BASE}/quizzes`,
  GET_QUIZ: (id: string) => `${BASE}/quizzes/${id}`,
  CREATE_QUIZ: `${BASE}/quizzes`,
  UPDATE_QUIZ: (id: string) => `${BASE}/quizzes/${id}`,
  DELETE_QUIZ: (id: string) => `${BASE}/quizzes/${id}`,
  DUPLICATE_QUIZ: (id: string) => `${BASE}/quizzes/${id}/duplicate`,
  
  // Quiz questions
  LIST_QUESTIONS: (quizId: string) => `${BASE}/quizzes/${quizId}/questions`,
  GET_QUESTION: (quizId: string, questionId: string) => 
    `${BASE}/quizzes/${quizId}/questions/${questionId}`,
  CREATE_QUESTION: (quizId: string) => `${BASE}/quizzes/${quizId}/questions`,
  UPDATE_QUESTION: (quizId: string, questionId: string) => 
    `${BASE}/quizzes/${quizId}/questions/${questionId}`,
  DELETE_QUESTION: (quizId: string, questionId: string) => 
    `${BASE}/quizzes/${quizId}/questions/${questionId}`,
  REORDER_QUESTIONS: (quizId: string) => `${BASE}/quizzes/${quizId}/questions/reorder`,
  
  // Quiz search & filter
  SEARCH_QUIZZES: `${BASE}/quizzes/search`,
  FILTER_QUIZZES: `${BASE}/quizzes/filter`,
  GET_POPULAR_QUIZZES: `${BASE}/quizzes/popular`,
  GET_FEATURED_QUIZZES: `${BASE}/quizzes/featured`,
  
  // Quiz stats
  GET_QUIZ_STATS: (id: string) => `${BASE}/quizzes/${id}/stats`,
  GET_QUIZ_ANALYTICS: (id: string) => `${BASE}/quizzes/${id}/analytics`,
  
  // Quiz sharing
  PUBLISH_QUIZ: (id: string) => `${BASE}/quizzes/${id}/publish`,
  UNPUBLISH_QUIZ: (id: string) => `${BASE}/quizzes/${id}/unpublish`,
  SHARE_QUIZ: (id: string) => `${BASE}/quizzes/${id}/share`,
} as const;

// ============================================================================
// GAME ENDPOINTS
// ============================================================================

export const GAME_ENDPOINTS = {
  // Game session
  CREATE_SESSION: `${BASE}/game/sessions`,
  GET_SESSION: (sessionId: string) => `${BASE}/game/sessions/${sessionId}`,
  END_SESSION: (sessionId: string) => `${BASE}/game/sessions/${sessionId}/end`,
  
  // Game lobby
  JOIN_GAME: `${BASE}/game/join`,
  LEAVE_GAME: (sessionId: string) => `${BASE}/game/sessions/${sessionId}/leave`,
  START_GAME: (sessionId: string) => `${BASE}/game/sessions/${sessionId}/start`,
  
  // Game play
  SUBMIT_ANSWER: (sessionId: string) => `${BASE}/game/sessions/${sessionId}/answer`,
  GET_QUESTION: (sessionId: string, questionId: string) => 
    `${BASE}/game/sessions/${sessionId}/questions/${questionId}`,
  NEXT_QUESTION: (sessionId: string) => `${BASE}/game/sessions/${sessionId}/next`,
  
  // Game results
  GET_RESULTS: (sessionId: string) => `${BASE}/game/sessions/${sessionId}/results`,
  GET_LEADERBOARD: (sessionId: string) => `${BASE}/game/sessions/${sessionId}/leaderboard`,
  GET_PLAYER_STATS: (sessionId: string, playerId: string) => 
    `${BASE}/game/sessions/${sessionId}/players/${playerId}/stats`,
  
  // Challenge mode
  CREATE_CHALLENGE: `${BASE}/game/challenges`,
  GET_CHALLENGE: (challengeId: string) => `${BASE}/game/challenges/${challengeId}`,
  ACCEPT_CHALLENGE: (challengeId: string) => `${BASE}/game/challenges/${challengeId}/accept`,
} as const;

// ============================================================================
// REPORT ENDPOINTS
// ============================================================================

export const REPORT_ENDPOINTS = {
  // Reports
  LIST_REPORTS: `${BASE}/reports`,
  GET_REPORT: (sessionId: string) => `${BASE}/reports/${sessionId}`,
  EXPORT_REPORT: (sessionId: string) => `${BASE}/reports/${sessionId}/export`,
  
  // Analytics
  GET_QUIZ_ANALYTICS: (quizId: string) => `${BASE}/reports/quizzes/${quizId}/analytics`,
  GET_USER_ANALYTICS: (userId: string) => `${BASE}/reports/users/${userId}/analytics`,
  GET_GLOBAL_ANALYTICS: `${BASE}/reports/analytics/global`,
  
  // Statistics
  GET_QUIZ_STATISTICS: (quizId: string) => `${BASE}/reports/quizzes/${quizId}/statistics`,
  GET_QUESTION_STATISTICS: (quizId: string, questionId: string) => 
    `${BASE}/reports/quizzes/${quizId}/questions/${questionId}/statistics`,
} as const;

// ============================================================================
// UPLOAD ENDPOINTS
// ============================================================================

export const UPLOAD_ENDPOINTS = {
  // File upload
  UPLOAD_IMAGE: `${BASE}/upload/image`,
  UPLOAD_VIDEO: `${BASE}/upload/video`,
  UPLOAD_DOCUMENT: `${BASE}/upload/document`,
  
  // File management
  DELETE_FILE: (fileId: string) => `${BASE}/upload/files/${fileId}`,
  GET_FILE_URL: (fileId: string) => `${BASE}/upload/files/${fileId}/url`,
} as const;

// ============================================================================
// ADMIN ENDPOINTS
// ============================================================================

export const ADMIN_ENDPOINTS = {
  // User management
  LIST_ALL_USERS: `${BASE}/admin/users`,
  BAN_USER: (userId: string) => `${BASE}/admin/users/${userId}/ban`,
  UNBAN_USER: (userId: string) => `${BASE}/admin/users/${userId}/unban`,
  
  // Quiz management
  LIST_ALL_QUIZZES: `${BASE}/admin/quizzes`,
  APPROVE_QUIZ: (quizId: string) => `${BASE}/admin/quizzes/${quizId}/approve`,
  REJECT_QUIZ: (quizId: string) => `${BASE}/admin/quizzes/${quizId}/reject`,
  FEATURE_QUIZ: (quizId: string) => `${BASE}/admin/quizzes/${quizId}/feature`,
  
  // Reports
  GET_REPORTED_CONTENT: `${BASE}/admin/reports`,
  RESOLVE_REPORT: (reportId: string) => `${BASE}/admin/reports/${reportId}/resolve`,
  
  // System
  GET_SYSTEM_STATS: `${BASE}/admin/system/stats`,
  GET_SYSTEM_HEALTH: `${BASE}/admin/system/health`,
} as const;

// ============================================================================
// NOTIFICATION ENDPOINTS
// ============================================================================

export const NOTIFICATION_ENDPOINTS = {
  // Notifications
  LIST_NOTIFICATIONS: `${BASE}/notifications`,
  GET_NOTIFICATION: (id: string) => `${BASE}/notifications/${id}`,
  MARK_AS_READ: (id: string) => `${BASE}/notifications/${id}/read`,
  MARK_ALL_AS_READ: `${BASE}/notifications/read-all`,
  DELETE_NOTIFICATION: (id: string) => `${BASE}/notifications/${id}`,
  
  // Preferences
  GET_PREFERENCES: `${BASE}/notifications/preferences`,
  UPDATE_PREFERENCES: `${BASE}/notifications/preferences`,
} as const;

// ============================================================================
// CONSOLIDATED API ENDPOINTS
// ============================================================================

/**
 * Centralized API endpoints object
 * Provides a single source of truth for all API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  QUIZ: QUIZ_ENDPOINTS,
  GAME: GAME_ENDPOINTS,
  REPORT: REPORT_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build query string from params object
 */
export function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Build URL with query params
 */
export function buildUrl(endpoint: string, params?: Record<string, unknown>): string {
  if (!params) return endpoint;
  return `${endpoint}${buildQueryString(params)}`;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AuthEndpoint = typeof AUTH_ENDPOINTS[keyof typeof AUTH_ENDPOINTS];
export type UserEndpoint = typeof USER_ENDPOINTS[keyof typeof USER_ENDPOINTS];
export type QuizEndpoint = typeof QUIZ_ENDPOINTS[keyof typeof QUIZ_ENDPOINTS];
export type GameEndpoint = typeof GAME_ENDPOINTS[keyof typeof GAME_ENDPOINTS];
export type ReportEndpoint = typeof REPORT_ENDPOINTS[keyof typeof REPORT_ENDPOINTS];
export type UploadEndpoint = typeof UPLOAD_ENDPOINTS[keyof typeof UPLOAD_ENDPOINTS];
export type AdminEndpoint = typeof ADMIN_ENDPOINTS[keyof typeof ADMIN_ENDPOINTS];
export type NotificationEndpoint = typeof NOTIFICATION_ENDPOINTS[keyof typeof NOTIFICATION_ENDPOINTS];

/**
 * Type for the consolidated API_ENDPOINTS object
 */
export type ApiEndpoints = typeof API_ENDPOINTS;

