/**
 * Host Session Storage Utilities
 * 
 * Manages localStorage for host game sessions.
 */

import type { GameSession } from '../types'

export interface StoredHostSession {
  sessionId: string
  pin: string
  quizSetId: string
  createdAt: number
}

const HOST_SESSION_STORAGE_KEY = 'host_game_session'
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000 // 2 hours

export function saveHostSession(session: GameSession): void {
  if (typeof window === 'undefined') return
  
  const stored: StoredHostSession = {
    sessionId: session.id,
    pin: session.pin,
    quizSetId: session.quizSetId,
    createdAt: Date.now(),
  }
  
  localStorage.setItem(HOST_SESSION_STORAGE_KEY, JSON.stringify(stored))
}

export function getStoredHostSession(): StoredHostSession | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(HOST_SESSION_STORAGE_KEY)
    if (!stored) return null
    
    const parsed = JSON.parse(stored) as StoredHostSession
    
    // Check if session expired
    if (Date.now() - parsed.createdAt > SESSION_EXPIRY_MS) {
      localStorage.removeItem(HOST_SESSION_STORAGE_KEY)
      return null
    }
    
    return parsed
  } catch {
    return null
  }
}

export function clearStoredHostSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(HOST_SESSION_STORAGE_KEY)
}

