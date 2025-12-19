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
  BECOME_CREATOR: `${BASE}/auth/become-creator`,
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
// QUIZ SET ENDPOINTS
// ============================================================================

export const QUIZ_SET_ENDPOINTS = {
  // Quiz Set CRUD
  LIST_QUIZ_SETS: `${BASE}/quiz-sets`,
  GET_QUIZ_SET: (id: string) => `${BASE}/quiz-sets/${id}`,
  CREATE_QUIZ_SET: `${BASE}/quiz-sets`,
  UPDATE_QUIZ_SET: (id: string) => `${BASE}/quiz-sets/${id}`,
  DELETE_QUIZ_SET: (id: string) => `${BASE}/quiz-sets/${id}`,

  // Quiz Set Actions
  PUBLISH_QUIZ_SET: (id: string) => `${BASE}/quiz-sets/${id}/publish`,
  DUPLICATE_QUIZ_SET: (id: string) => `${BASE}/quiz-sets/${id}/duplicate`,
  UPLOAD_COVER_IMAGE: (id: string) => `${BASE}/quiz-sets/${id}/upload-cover`,
  UPLOAD_COVER_IMAGE_TEMP: `${BASE}/quiz-sets/upload-cover-temp`,
  
  // Upload endpoints
  UPLOAD_AUDIO: `${BASE}/upload/audio`,

  // Quiz Set Questions
  LIST_QUESTIONS: (quizSetId: string) => `${BASE}/quiz-sets/${quizSetId}/questions`,
  GET_QUESTION: (quizSetId: string, questionId: string) =>
    `${BASE}/quiz-sets/${quizSetId}/questions/${questionId}`,
  CREATE_QUESTION: (quizSetId: string) => `${BASE}/quiz-sets/${quizSetId}/questions`,
  UPDATE_QUESTION: (quizSetId: string, questionId: string) =>
    `${BASE}/quiz-sets/${quizSetId}/questions/${questionId}`,
  DELETE_QUESTION: (quizSetId: string, questionId: string) =>
    `${BASE}/quiz-sets/${quizSetId}/questions/${questionId}`,
  DUPLICATE_QUESTION: (quizSetId: string, questionId: string) =>
    `${BASE}/quiz-sets/${quizSetId}/questions/${questionId}/duplicate`,
  REORDER_QUESTIONS: (quizSetId: string) => `${BASE}/quiz-sets/${quizSetId}/questions/reorder`,
} as const;

// ============================================================================
// QUIZ ENDPOINTS (Individual Quizzes with Questions)
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
// LEADERBOARD ENDPOINTS
// ============================================================================

export const LEADERBOARD_ENDPOINTS = {
  // Leaderboard
  GET_LEADERBOARD: `${BASE}/leaderboard`,
  GET_LEADERBOARD_ENTRY: (attemptId: string) => `${BASE}/leaderboard/${attemptId}`,
  GET_QUIZ_SET_LEADERBOARD: (quizSetId: string) => `${BASE}/quiz-sets/${quizSetId}/leaderboard`,
  GET_CHALLENGE_LEADERBOARD: (challengeId: string) => `${BASE}/challenges/${challengeId}/leaderboard`,
} as const;

// ============================================================================
// CLASS ENDPOINTS
// ============================================================================

export const CLASS_ENDPOINTS = {
  // Class CRUD
  GET_CLASSES: `${BASE}/classes`,
  GET_CLASS: (id: string) => `${BASE}/classes/${id}`,
  CREATE_CLASS: `${BASE}/classes`,
  UPDATE_CLASS: (id: string) => `${BASE}/classes/${id}`,
  DELETE_CLASS: (id: string) => `${BASE}/classes/${id}`,
  
  // Class Actions
  JOIN_CLASS: `${BASE}/classes/join`,
  LEAVE_CLASS: (id: string) => `${BASE}/classes/${id}/leave`,
  GET_CLASS_MEMBERS: (id: string) => `${BASE}/classes/${id}/members`,
  REMOVE_MEMBER: (classId: string, memberId: string) => `${BASE}/classes/${classId}/members/${memberId}`,
  
  // Homework CRUD
  GET_HOMEWORKS: (classId: string) => `${BASE}/classes/${classId}/homeworks`,
  GET_HOMEWORK: (classId: string, homeworkId: string) => `${BASE}/classes/${classId}/homeworks/${homeworkId}`,
  CREATE_HOMEWORK: (classId: string) => `${BASE}/classes/${classId}/homeworks`,
  UPDATE_HOMEWORK: (classId: string, homeworkId: string) => `${BASE}/classes/${classId}/homeworks/${homeworkId}`,
  DELETE_HOMEWORK: (classId: string, homeworkId: string) => `${BASE}/classes/${classId}/homeworks/${homeworkId}`,
  
  // Homework Submissions
  GET_HOMEWORK_SUBMISSIONS: (classId: string, homeworkId: string) => `${BASE}/classes/${classId}/homeworks/${homeworkId}/submissions`,
  SUBMIT_HOMEWORK: (classId: string, homeworkId: string) => `${BASE}/classes/${classId}/homeworks/${homeworkId}/submit`,
} as const;

// ============================================================================
// CATEGORY ENDPOINTS
// ============================================================================

export const CATEGORY_ENDPOINTS = {
  // Category CRUD
  LIST_CATEGORIES: `${BASE}/categories`,
  GET_CATEGORY: (id: string) => `${BASE}/categories/${id}`,
  CREATE_CATEGORY: `${BASE}/categories`,
  UPDATE_CATEGORY: (id: string) => `${BASE}/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `${BASE}/categories/${id}`,
  
  // Category Search
  SEARCH_CATEGORIES: `${BASE}/categories/search`,
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
  QUIZ_SET: QUIZ_SET_ENDPOINTS,
  QUIZ: QUIZ_ENDPOINTS,
  LEADERBOARD: LEADERBOARD_ENDPOINTS,
  CLASS: CLASS_ENDPOINTS,
  CATEGORY: CATEGORY_ENDPOINTS,
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
export type QuizSetEndpoint = typeof QUIZ_SET_ENDPOINTS[keyof typeof QUIZ_SET_ENDPOINTS];

/**
 * Type for the consolidated API_ENDPOINTS object
 */
export type ApiEndpoints = typeof API_ENDPOINTS;

