import { useState, useEffect } from 'preact/hooks'
import type { Settings } from '../types/settings'

const STORAGE_KEY = 'homescreen-settings'

const DEFAULT_SETTINGS: Settings = {
  clock: {
    showClock: true,
    use24HourFormat: false,
    showSeconds: false,
    size: 'large',
    alignment: 'center',
    showDate: true,
  },
}

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Settings
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error)
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error)
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(() => {
    const loaded = loadSettings()
    // Save defaults if nothing was stored
    if (!localStorage.getItem(STORAGE_KEY)) {
      saveSettings(loaded)
    }
    return loaded
  })

  const setSettings = (
    newSettings: Settings | ((prev: Settings) => Settings)
  ) => {
    setSettingsState(prev => {
      const updated =
        typeof newSettings === 'function' ? newSettings(prev) : newSettings
      saveSettings(updated)
      return updated
    })
  }

  // Sync with localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as Settings
          setSettingsState(parsed)
        } catch (error) {
          console.error('Failed to parse settings from storage event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return { settings, setSettings }
}
