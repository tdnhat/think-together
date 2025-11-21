/**
 * Environment Configuration
 * 
 * Centralized environment variable validation and access.
 * Ensures all required environment variables are present at build time.
 */

import { z } from 'zod';

// ============================================================================
// ENVIRONMENT SCHEMA
// ============================================================================

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // API Configuration (Required)
  NEXT_PUBLIC_API_URL: z.string().url('Invalid API URL').min(1, 'API URL is required'),
  
  // Socket Configuration (Optional)
  NEXT_PUBLIC_SOCKET_URL: z.string().url('Invalid Socket URL').optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_VIDEO_QUESTIONS: z.string().optional().default('true'),
  NEXT_PUBLIC_ENABLE_AI_GENERATION: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_LIVE_CHAT: z.string().optional().default('false'),
  NEXT_PUBLIC_ENABLE_MOCK_DATA: z.string().optional().default('false'),
  
  // Third-party Services (Optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url('Invalid Sentry DSN').optional(),
  NEXT_PUBLIC_INTERCOM_APP_ID: z.string().optional(),
  
  // Azure Storage (Optional - for production)
  AZURE_STORAGE_CONNECTION_STRING: z.string().optional(),
  AZURE_STORAGE_CONTAINER_NAME: z.string().optional(),
});

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

function validateEnv() {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN,
    NEXT_PUBLIC_ENABLE_VIDEO_QUESTIONS: process.env.NEXT_PUBLIC_ENABLE_VIDEO_QUESTIONS,
    NEXT_PUBLIC_ENABLE_AI_GENERATION: process.env.NEXT_PUBLIC_ENABLE_AI_GENERATION,
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_LIVE_CHAT: process.env.NEXT_PUBLIC_ENABLE_LIVE_CHAT,
    NEXT_PUBLIC_ENABLE_MOCK_DATA: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING,
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME,
  };

  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        return `  - ${err.path.join('.')}: ${err.message}`;
      });

      throw new Error(
        `❌ Invalid environment variables:\n${missingVars.join('\n')}\n\n` +
        `Please check your .env.local file and ensure all required variables are set.`
      );
    }
    throw error;
  }
}

// Validate environment variables at module load time
const validatedEnv = validateEnv();

// ============================================================================
// TYPED ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Strongly-typed environment configuration
 * Use this instead of process.env directly
 */
export const env = {
  // Node Environment
  isDevelopment: validatedEnv.NODE_ENV === 'development',
  isProduction: validatedEnv.NODE_ENV === 'production',
  isTest: validatedEnv.NODE_ENV === 'test',
  nodeEnv: validatedEnv.NODE_ENV,
  
  // API Configuration
  apiUrl: validatedEnv.NEXT_PUBLIC_API_URL,
  socketUrl: validatedEnv.NEXT_PUBLIC_SOCKET_URL || validatedEnv.NEXT_PUBLIC_API_URL,
  
  // Feature Flags
  features: {
    socialLogin: validatedEnv.NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN === 'true',
    videoQuestions: validatedEnv.NEXT_PUBLIC_ENABLE_VIDEO_QUESTIONS === 'true',
    aiGeneration: validatedEnv.NEXT_PUBLIC_ENABLE_AI_GENERATION === 'true',
    analytics: validatedEnv.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    liveChat: validatedEnv.NEXT_PUBLIC_ENABLE_LIVE_CHAT === 'true',
    mockData: validatedEnv.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  },
  
  // Third-party Services
  services: {
    googleAnalyticsId: validatedEnv.NEXT_PUBLIC_GA_ID,
    sentryDsn: validatedEnv.NEXT_PUBLIC_SENTRY_DSN,
    intercomAppId: validatedEnv.NEXT_PUBLIC_INTERCOM_APP_ID,
  },
  
  // Azure Storage
  azure: {
    storageConnectionString: validatedEnv.AZURE_STORAGE_CONNECTION_STRING,
    storageContainerName: validatedEnv.AZURE_STORAGE_CONTAINER_NAME,
  },
} as const;

// ============================================================================
// ENVIRONMENT UTILITIES
// ============================================================================

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof env.features): boolean {
  return env.features[feature];
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is not defined and no fallback provided`);
  }
  return value || fallback || '';
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Check if running on server
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Env = typeof env;
export type FeatureFlag = keyof typeof env.features;

