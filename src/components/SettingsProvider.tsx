import { useState, useEffect } from 'preact/hooks'
import type { ComponentChildren } from 'preact'
import {
  SettingsContext,
  loadSettings,
  saveSettings,
  STORAGE_KEY,
  type SettingsContextValue,
} from '../hooks/useSettings'
import type { Settings } from '../types/settings'

type SettingsProviderProps = {
  children: ComponentChildren
}

export function SettingsProvider({ children }: SettingsProviderProps) {
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

  const value: SettingsContextValue = { settings, setSettings }

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}
