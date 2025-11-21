/**
 * Error Handling Infrastructure
 * 
 * Centralized error handling, logging, and reporting.
 * Provides consistent error handling across the application.
 */

import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/config/constants';
import { env } from '@/config/env';
import type { ApiError } from '@/types/api';

// ============================================================================
// ERROR TYPES
// ============================================================================

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly severity: ErrorSeverity;
  public readonly statusCode?: number;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class NetworkError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR, details?: Record<string, unknown>) {
    super(message, ErrorType.NETWORK, ErrorSeverity.HIGH, 0, details);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, ErrorType.VALIDATION, ErrorSeverity.LOW, 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED, details?: Record<string, unknown>) {
    super(message, ErrorType.AUTHENTICATION, ErrorSeverity.HIGH, 401, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN, details?: Record<string, unknown>) {
    super(message, ErrorType.AUTHORIZATION, ErrorSeverity.MEDIUM, 403, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND, details?: Record<string, unknown>) {
    super(message, ErrorType.NOT_FOUND, ErrorSeverity.LOW, 404, details);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends AppError {
  constructor(message: string = ERROR_MESSAGES.SERVER_ERROR, details?: Record<string, unknown>) {
    super(message, ErrorType.SERVER, ErrorSeverity.CRITICAL, 500, details);
    this.name = 'ServerError';
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = ERROR_MESSAGES.TIMEOUT, details?: Record<string, unknown>) {
    super(message, ErrorType.TIMEOUT, ErrorSeverity.MEDIUM, 408, details);
    this.name = 'TimeoutError';
  }
}

// ============================================================================
// ERROR PARSER
// ============================================================================

/**
 * Parse Axios error into AppError
 */
export function parseAxiosError(error: AxiosError<ApiError>): AppError {
  // Network error (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return new TimeoutError();
    }
    return new NetworkError(undefined, {
      code: error.code,
      message: error.message,
    });
  }

  const { status, data } = error.response;
  const message = data?.detail || data?.title || ERROR_MESSAGES.GENERIC;
  const details = data?.errors || {};

  // Map HTTP status codes to error types
  switch (status) {
    case 400:
      return new ValidationError(message, details);
    case 401:
      return new AuthenticationError(message, details);
    case 403:
      return new AuthorizationError(message, details);
    case 404:
      return new NotFoundError(message, details);
    case 408:
      return new TimeoutError(message, details);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message, details);
    default:
      return new AppError(message, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM, status, details);
  }
}

/**
 * Parse any error into AppError
 */
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Axios error
  if (error instanceof AxiosError) {
    return parseAxiosError(error);
  }

  // Standard Error
  if (error instanceof Error) {
    return new AppError(error.message, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM);
  }

  // Unknown error type
  return new AppError(
    typeof error === 'string' ? error : ERROR_MESSAGES.GENERIC,
    ErrorType.UNKNOWN,
    ErrorSeverity.MEDIUM
  );
}

// ============================================================================
// ERROR HANDLER
// ============================================================================

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToSentry?: boolean;
  customMessage?: string;
  onError?: (error: AppError) => void;
}

const defaultOptions: ErrorHandlerOptions = {
  showToast: true,
  logToConsole: env.isDevelopment,
  reportToSentry: env.isProduction,
};

/**
 * Handle error with logging, reporting, and user notification
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}): AppError {
  const opts = { ...defaultOptions, ...options };
  const appError = parseError(error);

  // Log to console in development
  if (opts.logToConsole) {
    console.error('[Error Handler]', {
      type: appError.type,
      severity: appError.severity,
      message: appError.message,
      statusCode: appError.statusCode,
      details: appError.details,
      stack: appError.stack,
      timestamp: appError.timestamp,
    });
  }

  // Report to Sentry in production
  if (opts.reportToSentry && appError.severity !== ErrorSeverity.LOW) {
    reportToSentry(appError);
  }

  // Show toast notification
  if (opts.showToast) {
    const message = opts.customMessage || appError.message;
    
    switch (appError.severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        toast.error(message);
        break;
      case ErrorSeverity.MEDIUM:
        toast.error(message);
        break;
      case ErrorSeverity.LOW:
        toast(message);
        break;
    }
  }

  // Custom error callback
  if (opts.onError) {
    opts.onError(appError);
  }

  return appError;
}

/**
 * Report error to Sentry
 */
function reportToSentry(error: AppError): void {
  if (!env.services.sentryDsn) {
    return;
  }

  try {
    // TODO: Implement Sentry SDK integration
    // Sentry.captureException(error, {
    //   level: mapSeverityToSentryLevel(error.severity),
    //   tags: {
    //     errorType: error.type,
    //     statusCode: error.statusCode?.toString(),
    //   },
    //   extra: error.details,
    // });
    
    console.warn('[Sentry] Error reporting not yet implemented:', error.message);
  } catch (sentryError) {
    console.error('[Sentry] Failed to report error:', sentryError);
  }
}

// ============================================================================
// ERROR BOUNDARY HANDLER
// ============================================================================

/**
 * Handle errors from React Error Boundaries
 */
export function handleErrorBoundary(error: Error, errorInfo: React.ErrorInfo): void {
  const appError = new AppError(
    error.message,
    ErrorType.UNKNOWN,
    ErrorSeverity.HIGH,
    undefined,
    {
      componentStack: errorInfo.componentStack,
    }
  );

  handleError(appError, {
    showToast: true,
    customMessage: 'Đã có lỗi xảy ra. Vui lòng tải lại trang.',
  });
}

// ============================================================================
// VALIDATION ERROR HELPERS
// ============================================================================

/**
 * Extract validation errors from API response
 */
export function extractValidationErrors(error: AppError): Record<string, string[]> {
  if (error.type !== ErrorType.VALIDATION || !error.details) {
    return {};
  }

  return error.details as Record<string, string[]>;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string[]>): string {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
}

// ============================================================================
// RETRY HELPERS
// ============================================================================

export interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  backoff?: boolean;
  shouldRetry?: (error: AppError) => boolean;
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
    shouldRetry = (error) => error.type === ErrorType.NETWORK || error.type === ErrorType.TIMEOUT,
  } = options;

  let lastError: AppError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = parseError(error);

      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      const waitTime = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { toast };

