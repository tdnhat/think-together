'use client'

/**
 * Timer Hook
 * Generic timer hook that can be used across different features
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { SHARED_CONSTANTS } from '../constants'
import { getTimeStatus } from '../utils/time'

interface UseTimerOptions {
    /** Total time in milliseconds */
    totalTimeMs: number
    /** Callback when time runs out */
    onTimeUp?: () => void
    /** Callback on each tick */
    onTick?: (remainingMs: number) => void
    /** Start timer automatically */
    autoStart?: boolean
}

interface UseTimerReturn {
    /** Remaining time in milliseconds */
    remainingTimeMs: number
    /** Whether timer is currently running */
    isRunning: boolean
    /** Whether time has run out */
    isTimeUp: boolean
    /** Whether in warning state (< 1 minute) */
    isWarning: boolean
    /** Whether in critical state (< 10 seconds) */
    isCritical: boolean
    /** Start the timer */
    start: () => void
    /** Pause the timer */
    pause: () => void
    /** Reset the timer */
    reset: () => void
    /** Add time to the timer */
    addTime: (ms: number) => void
}

export function useTimer(options: UseTimerOptions): UseTimerReturn {
    const { totalTimeMs, onTimeUp, onTick, autoStart = false } = options

    const [remainingTimeMs, setRemainingTimeMs] = useState(totalTimeMs)
    const [isRunning, setIsRunning] = useState(autoStart)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const prevTimeUpRef = useRef(false)

    const start = useCallback(() => {
        setIsRunning(true)
    }, [])

    const pause = useCallback(() => {
        setIsRunning(false)
    }, [])

    const reset = useCallback(() => {
        setRemainingTimeMs(totalTimeMs)
        setIsRunning(autoStart)
        prevTimeUpRef.current = false
    }, [totalTimeMs, autoStart])

    const addTime = useCallback((ms: number) => {
        setRemainingTimeMs((prev) => Math.max(0, prev + ms))
    }, [])

    useEffect(() => {
        if (!isRunning) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        intervalRef.current = setInterval(() => {
            setRemainingTimeMs((prev) => {
                const newTime = Math.max(0, prev - SHARED_CONSTANTS.TIMER.TICK_INTERVAL)

                // Call onTick callback
                onTick?.(newTime)

                // Call onTimeUp callback when time runs out (only once)
                if (newTime <= 0 && !prevTimeUpRef.current) {
                    prevTimeUpRef.current = true
                    onTimeUp?.()
                    setIsRunning(false)
                }

                return newTime
            })
        }, SHARED_CONSTANTS.TIMER.TICK_INTERVAL)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isRunning, onTick, onTimeUp])

    const timeStatus = getTimeStatus(remainingTimeMs)

    return {
        remainingTimeMs,
        isRunning,
        isTimeUp: remainingTimeMs <= 0,
        isWarning: timeStatus === 'warning' || timeStatus === 'critical',
        isCritical: timeStatus === 'critical',
        start,
        pause,
        reset,
        addTime,
    }
}
