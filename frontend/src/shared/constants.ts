/**
 * Shared Constants
 * Common constants used across multiple features
 */

export const SHARED_CONSTANTS = {
    /**
     * Timer configuration
     */
    TIMER: {
        /** Warning threshold in milliseconds (1 minute) */
        WARNING_THRESHOLD: 60000,
        /** Critical threshold in milliseconds (10 seconds) */
        CRITICAL_THRESHOLD: 10000,
        /** Tick interval in milliseconds (1 second) */
        TICK_INTERVAL: 1000,
    },

    /**
     * Question configuration
     */
    QUESTION: {
        TIME_LIMITS: {
            /** Minimum time limit in seconds */
            MIN: 5,
            /** Maximum time limit in seconds */
            MAX: 300,
            /** Default time limit in seconds */
            DEFAULT: 30,
            /** Preset time limit options in seconds */
            PRESETS: [10, 20, 30, 45, 60, 90, 120],
        },
    },

    /**
     * Validation patterns and limits
     */
    VALIDATION: {
        /** PIN length for game sessions */
        PIN_LENGTH: 6,
        /** PIN pattern (6 digits) */
        PIN_PATTERN: /^\d{6}$/,
        /** Minimum nickname length */
        NICKNAME_MIN_LENGTH: 2,
        /** Maximum nickname length */
        NICKNAME_MAX_LENGTH: 100,
    },

    /**
     * Common messages
     */
    MESSAGES: {
        LOADING: 'Đang tải...',
        CONNECTING: 'Đang kết nối...',
        CONNECTED: 'Đã kết nối!',
        DISCONNECTED: 'Mất kết nối',
        RECONNECTING: 'Đang kết nối lại...',
        RECONNECTED: 'Đã kết nối lại!',
    },
} as const

/**
 * Time status based on remaining time
 */
export type TimeStatus = 'normal' | 'warning' | 'critical'

/**
 * Timer display format
 */
export type TimerFormat = 'compact' | 'full'
