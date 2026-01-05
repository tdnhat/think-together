/**
 * Time Utilities
 * Shared utilities for time formatting and calculations
 */

import { SHARED_CONSTANTS, type TimeStatus } from '../constants'

/**
 * Format milliseconds to MM:SS format
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "03:45")
 */
export function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Format seconds to human-readable duration
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "3 phút 45 giây", "45 giây")
 */
export function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds} giây`
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (remainingSeconds === 0) {
        return `${minutes} phút`
    }

    return `${minutes} phút ${remainingSeconds} giây`
}

/**
 * Get time status based on remaining time
 * @param remainingMs - Remaining time in milliseconds
 * @returns Time status ('normal', 'warning', or 'critical')
 */
export function getTimeStatus(remainingMs: number): TimeStatus {
    if (remainingMs <= SHARED_CONSTANTS.TIMER.CRITICAL_THRESHOLD) {
        return 'critical'
    }
    if (remainingMs <= SHARED_CONSTANTS.TIMER.WARNING_THRESHOLD) {
        return 'warning'
    }
    return 'normal'
}

/**
 * Convert seconds to milliseconds
 * @param seconds - Time in seconds
 * @returns Time in milliseconds
 */
export function secondsToMs(seconds: number): number {
    return seconds * 1000
}

/**
 * Convert milliseconds to seconds
 * @param ms - Time in milliseconds
 * @returns Time in seconds
 */
export function msToSeconds(ms: number): number {
    return Math.floor(ms / 1000)
}

/**
 * Get color class based on time status
 * @param status - Time status
 * @returns Tailwind color class
 */
export function getTimeColorClass(status: TimeStatus): string {
    switch (status) {
        case 'critical':
            return 'text-red-500 animate-pulse'
        case 'warning':
            return 'text-orange-500'
        case 'normal':
        default:
            return 'text-foreground'
    }
}
