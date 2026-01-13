/**
 * Player Session Storage
 *
 * LocalStorage utilities for persisting player session data.
 * Enables reconnection after page refresh or browser close.
 */

const STORAGE_KEY = 'think-together:player-session'

export interface StoredPlayerSession {
    pin: string
    playerId: string
    nickname: string
    sessionId: string
    joinedAt: string
}

/**
 * Save player session to localStorage
 */
export function savePlayerSession(session: StoredPlayerSession): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
        console.warn('[PlayerSession] Failed to save session to localStorage')
    }
}

/**
 * Get stored player session if exists and matches the PIN
 */
export function getPlayerSession(pin: string): StoredPlayerSession | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return null

        const session = JSON.parse(stored) as StoredPlayerSession

        // Only return if PIN matches
        if (session.pin !== pin) return null

        return session
    } catch {
        return null
    }
}

/**
 * Get any stored player session (regardless of PIN)
 */
export function getAnyPlayerSession(): StoredPlayerSession | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) return null

        return JSON.parse(stored) as StoredPlayerSession
    } catch {
        return null
    }
}

/**
 * Clear stored player session
 */
export function clearPlayerSession(): void {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // Ignore errors
    }
}

/**
 * Check if player session is valid (not expired)
 * Sessions are considered valid for 24 hours
 */
export function isSessionValid(session: StoredPlayerSession): boolean {
    const joinedAt = new Date(session.joinedAt)
    const now = new Date()
    const hoursElapsed = (now.getTime() - joinedAt.getTime()) / (1000 * 60 * 60)

    return hoursElapsed < 24
}
