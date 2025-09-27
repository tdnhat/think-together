import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value
        
        // Save state
        setStoredValue(valueToStore)
        
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}

// Hook for managing theme
export function useTheme() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }, [setTheme])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }
  }, [theme])

  return {
    theme,
    setTheme,
    toggleTheme,
    removeTheme,
  }
}

// Hook for managing game settings
export function useGameSettings() {
  const [settings, setSettings] = useLocalStorage('game-settings', {
    enableBackgroundMusic: true,
    enableSoundEffects: true,
    showAnimations: true,
  })

  const updateSetting = useCallback((key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [setSettings])

  return {
    settings,
    setSettings,
    updateSetting,
  }
}

// Hook for managing recent games
export function useRecentGames() {
  const [recentGames, setRecentGames] = useLocalStorage<string[]>('recent-games', [])

  const addRecentGame = useCallback((gameId: string) => {
    setRecentGames(prev => {
      const filtered = prev.filter(id => id !== gameId)
      return [gameId, ...filtered].slice(0, 10) // Keep only last 10
    })
  }, [setRecentGames])

  const clearRecentGames = useCallback(() => {
    setRecentGames([])
  }, [setRecentGames])

  return {
    recentGames,
    addRecentGame,
    clearRecentGames,
  }
}
